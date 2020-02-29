package main

import (
	"github.com/gin-gonic/gin"
)

func GetPosts(c *gin.Context) {
	posts, _ := RetrievePublicPosts(0, 0, 5)
	c.JSON(200, posts)
}
