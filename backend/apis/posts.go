package apis

import (
	"fmt"
	"net/http"
	"square/lib"
	"square/models"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
	ws "github.com/gorilla/websocket"
)

type PostList struct {
	Min     int           `json:"min"`
	Max     int           `json:"max"`
	HasMore bool          `json:"hasMore"`
	HasNew  bool          `json:"hasNew"`
	Posts   []models.Post `json:"posts"`
}

type PagedList struct {
	Total int           `json:"total"`
	Posts []models.Post `json:"posts"`
}

// Handle /posts, /posts?min={pid}, /posts?max={pid}
func GetPublicPosts(c *gin.Context) {
	op, offset := getOpAndOffset(c)
	posts, _ := models.RetrievePublicPosts(op, offset, lib.Conf.Limit)
	idString, _ := c.Get("id")
	id, _ := strconv.Atoi(fmt.Sprint(idString))
	posts = checkPostMarked(posts, id)
	list := PostList{0, 0, false, false, posts}
	if len(list.Posts) > 0 {
		list.Min = posts[len(posts)-1].Id
		list.Max = posts[0].Id
	}
	// This method to check hasMore is really primitive. Need refinement later.
	if op != 1 && len(posts) == lib.Conf.Limit {
		list.HasMore = true
	}

	c.JSON(200, list)
}

// Handle /posts/user/:uid, with ?op={op}&page={page}.
func GetPrivatePosts(c *gin.Context) {
	uid := lib.GetUidFromParam(c)
	// op == 0 means posts; op == 1 means marks; op ==-1 means comments.
	op, page := getOpAndPage(c)
	if page <= 0 {
		page = 1
	}

	posts, err := models.RetrievePrivatePosts(op, page, uid)
	posts = checkPostMarked(posts, uid)
	if err != nil {
		c.Abort()
		return
	}

	// The list.Total cannot cover other cases.
	list := PagedList{-1, posts}
	if page == 1 {
		count, err := getTotalPostByUid(uid, op)
		log.Debug("count = ", count)
		if err != nil {
			log.Error("Cannot get total page", err)
		} else if count == 0 {
			list.Total = 1
		} else {
			list.Total = count / lib.Conf.Limit
			if count%lib.Conf.Limit > 0 {
				list.Total += 1
			}
		}
	}
	c.JSON(200, list)
}

func PostPosts(c *gin.Context) {
	var p models.Post
	c.BindJSON(&p)
	if p.Uid <= 0 {
		log.Error("Cannot get user id of post.")
		c.Abort()
		return
	}
	if p.Content == "" {
		log.Error("No content in the post.")
		c.Abort()
		return
	}
	if p.Nickname == "" {
		p.Nickname = "Anonymous"
	}

	p.Create(lib.Conn)
}

// This function has two usage.
// When getting public posts, op means direction(newer/older/none), offset means the post id to start search.
// When in private, op means options (posts/marks/comments), offset means the user-specified page number.
func getOpAndOffset(c *gin.Context) (op int, offset int) {
	op, offset = 0, 0
	result := c.Query("min")
	if result != "" {
		op = -1
		offset, _ = strconv.Atoi(result)
	} else if result = c.Query("max"); result != "" {
		op = 1
		offset, _ = strconv.Atoi(result)
	}
	if offset < 0 {
		offset = 0
	}

	return
}

func getOpAndPage(c *gin.Context) (op int, page int) {
	opString := c.Query("op")
	pageString := c.Query("page")

	if opString == "" {
		op = 0
	} else {
		op, _ = strconv.Atoi(opString)
	}

	if pageString == "" {
		page = 0
	} else {
		page, _ = strconv.Atoi(pageString)
	}

	return op, page
}

func getTotalPostByUid(uid int, op int) (int, error) {
	condition := "WHERE uid=$1"
	values := []interface{}{uid}
	table := "post"
	if op == 1 {
		table = "mark"
	}
	count, err := lib.QueryCount(table, condition, values)
	return count, err
}

func MarkPost(c *gin.Context) {
	var mark models.Mark
	c.BindJSON(&mark)
	if mark.Pid <= 0 || mark.Uid <= 0 {
		log.Error("Invalid mark request")
		c.Abort()
		return
	}
	id, _ := mark.Create()
	c.JSON(200, id)
}

func DeleteMark(c *gin.Context) {
	midVal := c.Param("mid")
	mid, err := strconv.Atoi(midVal)
	if err != nil || mid <= 0 {
		log.Error("Invalid mark request")
		c.Abort()
		return
	}

	success, err := reduceMarkByOne(mid)
	if err != nil || !success {
		log.Error("Cannot reduce mark by one")
		c.Abort()
		return
	}
	success, err = lib.DeleteById(lib.Conn, mid, "mark")
	if err != nil || !success {
		log.Error("Cannot delete mark")
		c.Abort()
		return
	}
	c.JSON(200, "OK")
}

func checkPostMarked(posts []models.Post, uid int) []models.Post {
	for i := 0; i < len(posts); i++ {
		mid, err := models.GetMarkIdByInfo(uid, posts[i].Id)
		if err != nil || mid <= 0{
			posts[i].Mid = -1
		} else {
			posts[i].Mid = mid
		}
	}

	return posts
}

func reduceMarkByOne(mid int) (bool, error) {
	columns := []string{"id"}
	values := []interface{} {mid}
	row, err := lib.QuerySingle(lib.Conn, "mark", columns, values)
	if err != nil {
		log.Error("Cannot query mark: ", err)
		return false, err
	}

	var mark models.Mark
	err = row.Scan(&mark.Id, &mark.Uid, &mark.Pid)
	if err != nil {
		log.Error("Cannot scan mark: ", err)
		return false, err
	}

	user, err := models.RetrieveUserById(lib.Conn, mark.Uid)
	if err != nil {
		log.Error("Cannot retrieve user by id: ", err)
		return false, err
	}
	user.Marks -= 1
	user.UpdateById(lib.Conn)
	return true, nil
}

func ClearUnreadPosts(uid int) {
	sqlString := "UPDATE post SET hasNewComments=$1 WHERE uid=$2"
	values := []interface{}{false, uid}
	success := lib.ComplexExec(sqlString, values)
	if !success {
		log.Error("Update posts status error: ")
		return
	}
	user, err := models.RetrieveUserById(lib.Conn, uid)
	if err != nil {
		log.Error("Cannot read user: ", err)
		return
	}
	user.Comments = 0
	user.UpdateById(lib.Conn)
}

func GetNewPostsNumber(c *gin.Context) {
	var upgrader = ws.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
	}

	// Notice the security problem
	upgrader.CheckOrigin = func(*http.Request) bool {
		return true
	}

	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Error(err)
		c.String(400, "Cannot establish websocket.")
	}

	msg, err := readWs(conn)
	if err != nil {
		c.Abort()
		return
	}

	writeWs(conn, msg)
}

func readWs(conn *ws.Conn) (string, error) {
		_, message, err := conn.ReadMessage()
		if err != nil {
			log.Error(err)
			return "", err
		}

		return string(message), nil
}

func writeWs(conn *ws.Conn, msg string) {
	for {
		max, _ := strconv.Atoi(msg)
		count, err := models.CheckNewPost(max)

		if count > 0 { // Notice it should be count > 0 after debug.
			log.Debug("Writing count ", count)
			err = conn.WriteMessage(ws.TextMessage, []byte(strconv.Itoa(count)))
			if err != nil {
				log.Error(err)
				return
			}

			// After a successful push, the websocket closes.
			err = conn.Close()
			if err != nil {
				log.Error("Cannot close websocket")
			}
			return
		}

		time.Sleep(5 * time.Second)
	}
}