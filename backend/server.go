package main

import (
	"server/lib"
	"strconv"
	"strings"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
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
	r.POST("/posts", postDraft)
	r.POST("/register", register)
	r.POST("/login", login)

	public := r.Group("/")
	public.Use(authPub())
	{
		public.GET("/posts", getPosts)
		public.GET("/userSummary", getUserSummary)
	}

	r.Run(":8080")
}

func getPosts(c *gin.Context) {
	var posts []lib.Post
	offsetString := c.Query("offset")
	offset := 0
	if offsetString != "" {
		offset, _ = strconv.Atoi(offsetString)
	}
	posts, offset = lib.RetrievePublicPosts(offset, config)
	if posts == nil {
		c.Abort()
	}
	//c.JSON(200, posts)
	c.JSON(200, gin.H{
		"posts":  posts,
		"offset": offset,
	})
}

// Notice the parameter in PostForm should be the same with the 'name' attribute of form
func postDraft(c *gin.Context) {
	// Switch PostForm method to BindJson later.
	draft := lib.Draft{1, "Anonymous", 0, c.PostForm("draft")}
	lib.InsertData(draft, config)
	lib.CloseDB(config)
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
		c.SetCookie("login", "1", 3600, "/", "localhost", false, false)
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

// This function may have security problem.
// Try to generate a random negative time later.
func quit(c *gin.Context) {
	// Set expire time 5 secs before current time to force it to expire.
	c.SetCookie("square", "", -5, "/", "localhost", false, true)
	c.SetCookie("login", "", -5, "/", "localhost", false, false)
	c.String(200, "OK")
}
