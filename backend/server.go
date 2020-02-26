package main

import (
	"fmt"
	"net/http"
	"server/lib"
	"strconv"
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	ws "github.com/gorilla/websocket"
	_ "github.com/lib/pq"
	log "github.com/sirupsen/logrus"
)

var config lib.Config = lib.ReadJsonConfig()

func init() {
	log.SetLevel(log.DebugLevel)
}

func main() {
	r := gin.Default()

	corsConfig := cors.DefaultConfig()
	corsConfig.AllowOrigins = []string{config.Site}
	// Cooperate with axios withCredentials to transfer cookie in cors mode.
	corsConfig.AllowCredentials = true
	r.Use(cors.New(corsConfig))

	r.GET("/quit", quit)
	r.POST("/register", register)
	r.POST("/login", login)

	public := r.Group("/")
	public.Use(authPub())
	{
		public.GET("/posts", getPosts)
		public.GET("/userSummary", getUserSummary)
		public.GET("/newPosts", webSocket)
		public.POST("/posts", postDraft)
		public.POST("/userInfo", postUserInfo)
	}

	r.Run(":8080")
}

func getPosts(c *gin.Context) {
	// op == 0 means no arguments, -1 means get old posts, 1 means get new
	// current is used to store the current row number
	op, current := 0, 0
	if c.Query("min") != "" {
		op = -1
		current, _ = strconv.Atoi(c.Query("min"))
	} else if c.Query("max") != "" {
		op = 1
		current, _ = strconv.Atoi(c.Query("max"))
	}

	results, err := lib.RetrievePublicPosts(op, current, config)
	if err != nil {
		c.Abort()
	}
	c.JSON(200, results)
}

// Notice the parameter in PostForm should be the same with the 'name' attribute of form
func postDraft(c *gin.Context) {
	// Switch PostForm method to BindJson later.
	content := strings.TrimSpace(c.PostForm("draft"))
	if content == "" {
		c.String(400, "Empty input.")
	}

	id, _ := c.Get("id")
	uid, _ := strconv.Atoi(fmt.Sprint(id))

	nickname := "Anonymous"
	if c.PostForm("is_anonymous") == "" {
		var err error
		nickname, err = lib.RetrieveNicknameById(uid, config)
		if err != nil {
			c.Abort()
		}
	}

	status := 0
	if c.PostForm("is_private") != "" {
		status = 1
	}

	draft := lib.Draft{uid, nickname, status, content}
	if lib.InsertDraft(draft, config) {
		c.String(200, "OK")
	} else {
		c.String(400, "Post failed.")
	}
}

func register(c *gin.Context) {
	log.Debug("Enter register process...")
	var user lib.NewUser
	c.BindJSON(&user)
	if len(strings.TrimSpace(user.Nickname)) == 0 {
		user.Nickname = "Anonymous"
	}
	status, detail := lib.InsertUser(user, config)
	if status < 0 {
		c.String(400, "Internal Error")
	}
	c.String(status, detail)
}

func login(c *gin.Context) {
	log.Debug("Enter login process...")

	var info lib.LoginInfo
	c.BindJSON(&info)
	id := lib.ValidateUser(info, config)
	if id > 0 {
		tokenString := lib.GenerateToken(id)
		if tokenString == "" || len(tokenString) == 0 {
			log.Error("Cannot sign token")
			c.Abort()
		}
		log.Debug("Setting cookie...")
		// Two cookie, one for jwt used in backend, one for validation by frontend.
		c.SetCookie("square", tokenString, 3600, "/", "localhost", false, true)
		c.SetCookie("local", strconv.Itoa(id), 3600, "/", "localhost", false, false)
	} else {
		c.String(400, "Login failed!")
	}
}

// Authentication for public request, including public posts and single post.
func authPub() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString, err := c.Cookie("square")

		if err != nil {
			log.Error(err)
			c.Abort()
		}

		id := lib.CheckToken(tokenString)

		if id < 0 {
			log.Error("Auth failed.")
			c.Abort()
		}

		c.Set("id", id)
		c.Next()
	}
}

func getUserSummary(c *gin.Context) {
	id := c.GetInt("id")
	summary, err := lib.GetUserSummary(id, config)
	if err != nil {
		c.Abort()
	}
	log.Debug(summary.Nickname)
	c.JSON(200, summary)
}

func postUserInfo(c *gin.Context) {
	id := c.GetInt("id")
	name := c.Query("name")
	if name == "" {
		c.Abort()
	}

	if !lib.UpdateNickname(id, name, config) {
		c.String(400, "Update error")
	} else {
		c.String(200, "OK")
	}
}

// This function may have security problem.
// Try to generate a random negative time later.
func quit(c *gin.Context) {
	// Set expire time 5 secs before current time to force it to expire.
	c.SetCookie("square", "", -5, "/", "localhost", false, true)
	c.SetCookie("login", "", -5, "/", "localhost", false, false)
	c.String(200, "OK")
}

func webSocket(c *gin.Context) {
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

	ch := make(chan string)
	// Use anther goroutine to read so it doesn't block other functions.
	go readWs(conn, ch)
	writeWs(conn, ch, config)
}

func readWs(conn *ws.Conn, ch chan string) {
	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			log.Error(err)
			return
		}
		ch <- string(message)
	}
}

func writeWs(conn *ws.Conn, ch chan string, config lib.Config) {
	msg := ""

	// Use this part of code to check whether channel is empty
	// Without the 'select' it will block the process.
	for {
		select {
		case msg = <-ch:
			log.Debug("Get new message: ", msg)
		default:
			log.Debug("Channel is empty")
		}

		if msg == "" {
			time.Sleep(5 * time.Second)
			continue
		}

		max, _ := strconv.Atoi(msg)
		count, err := lib.CheckNewPost(max, config)

		if count >= 0 {
			log.Debug("Writing count ", count)
			err = conn.WriteMessage(ws.TextMessage, []byte(strconv.Itoa(count)))
			if err != nil {
				log.Error(err)
				return
			}
		}

		time.Sleep(5 * time.Second)
	}
}
