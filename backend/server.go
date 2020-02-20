package main

import (
	"server/lib"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

func main() {
	r := gin.Default()
	r.Use(cors.Default())
	r.GET("/ping", getPing)
	r.GET("/posts", getPosts)
	r.POST("/posts", postDraft)
	r.Run(":8080")
}

func getPing(c *gin.Context) {
	c.String(200, "Hello, world!")
}

func getPosts(c *gin.Context) {
	var posts []lib.Post
	posts = lib.RetrieveData()
	lib.CloseDB()
	c.JSON(200, posts)
}

// Notice the parameter in PostForm should be the same with the 'name' attribute of form
func postDraft(c *gin.Context) {
	draft := lib.Draft{1, "Alice", 0, c.PostForm("draft")}
	lib.InsertData(draft)
	lib.CloseDB()
}
