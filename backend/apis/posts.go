package apis

import (
	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
	"square/lib"
	"square/models"
	"strconv"
)

type PostList struct {
	Min     int           `json:"min"`
	Max     int           `json:"max"`
	HasMore bool          `json:"hasMore"`
	HasNew  bool          `json:"hasNew"`
	Posts   []models.Post `json:"posts"`
}

// Handle /posts, /posts?min={pid}, /posts?max={pid}
func GetPublicPosts(c *gin.Context) {
	op, offset := getOpAndOffset(c)
	posts, _ := models.RetrievePublicPosts(op, offset, lib.Conf.Limit)
	list := PostList{0, 0, true, false, posts}
	if len(list.Posts) > 0 {
		list.Min = posts[len(posts)-1].Id
		list.Max = posts[0].Id
	}
	// This method to check hasMore is really primitive. Need refinement later.
	if len(posts) < lib.Conf.Limit {
		list.HasMore = false
	}

	c.JSON(200, list)
}

// Handle /posts/user/:uid, or with ?min/max option.
func GetPrivatePosts(c *gin.Context) {
	uid := lib.GetUidFromParam(c)
	op, offset := getOpAndOffset(c)
	posts, err := models.RetrievePrivatePosts(op, offset, lib.Conf.Limit, uid)
	if err != nil {
		c.Abort()
	}
	list := PostList{
		Min:     0,
		Max:     0,
		HasMore: true,
		HasNew:  false,
		Posts:   posts,
	}

	if len(posts) > 0 {
		list.Min = posts[len(posts)-1].Id
		list.Max = posts[0].Id
	}

	c.JSON(200, list)
}

func PostPosts(c *gin.Context) {
	var d models.Draft
	c.BindJSON(&d)
	if d.Uid <= 0 {
		log.Error("Cannot get user id of post.")
		c.Abort()
		return
	}
	if d.Content == "" {
		log.Error("No content in the post.")
		c.Abort()
		return
	}
	if d.Nickname == "" {
		d.Nickname = "Anonymous"
	}

	post := d.GeneratePost()
	post.Create(lib.Conn)
}

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

	log.Debug("option is ", op, " and offset is ", offset)
	return
}

// TODO: need another function to retrieve unread comments in here and post.go
