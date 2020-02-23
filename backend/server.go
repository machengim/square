package main

import (
	"fmt"
	"server/lib"
	"strings"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

var config lib.Config = lib.ReadJsonConfig()

func main() {
	r := gin.Default()

	corsConfig := cors.DefaultConfig()
	corsConfig.AllowOrigins = []string{config.Site}
	// Cooperate with axios withCredentials to transfer cookie in cors mode.
	corsConfig.AllowCredentials = true
	r.Use(cors.New(corsConfig))

	r.GET("/index", getRoot)
	r.GET("/posts", getPosts)
	r.POST("/posts", postDraft)
	r.POST("/register", register)
	r.POST("/login", login)
	/*
		public := r.Group("/")
		public.Use(authPub())
			{
				public.GET("/posts", getPosts)
			}
	*/
	r.Run(":8080")
}

func getRoot(c *gin.Context) {
	c.HTML(200, config.Site+"/index.html", "index")
}

func getPosts(c *gin.Context) {
	var posts []lib.Post
	posts = lib.RetrieveData(config)
	lib.CloseDB(config)
	c.JSON(200, posts)
}

// Notice the parameter in PostForm should be the same with the 'name' attribute of form
func postDraft(c *gin.Context) {
	// Switch PostForm method to BindJson later.
	draft := lib.Draft{1, "Anonymous", 0, c.PostForm("draft")}
	lib.InsertData(draft, config)
	lib.CloseDB(config)
}

func register(c *gin.Context) {
	fmt.Println("Enter register process...")
	var user lib.NewUser
	c.BindJSON(&user)
	if len(strings.TrimSpace(user.Nickname)) == 0 {
		user.Nickname = "Anonymous"
	}
	status, detail := lib.InsertUser(user, config)
	lib.CloseDB(config)
	c.String(status, detail)
}

// Should return a token
func login(c *gin.Context) {
	fmt.Println("Enter login process...")

	var info lib.LoginInfo
	c.BindJSON(&info)
	id := lib.ValidateUser(info, config)
	if id > 0 {
		tokenString := lib.GenerateToken(id)
		fmt.Println("setting cookie...")
		c.SetCookie("square", tokenString, 3600, "/", "localhost", false, true)
	} else {
		c.String(400, "Login failed!")
	}

}

// Wait for complete.
func authPub() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("claims", "TheTokenYouGet")
	}
}
