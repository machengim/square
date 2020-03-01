package apis

import (
	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
	"square/lib"
	"square/models"
	"strconv"
)

func GetComments(c *gin.Context) {
	pidString := c.Query("pid")

	if pidString == "" {
		log.Error("No post id provided in the request.")
		c.Abort()
		return
	}
	pid, err := strconv.Atoi(pidString)
	if err != nil {
		log.Error("Cannot parse pid into integer: ", err)
		c.Abort()
		return
	}
	comments, err := models.RetrieveCommentsByPid(pid)
	if err != nil {
		c.Abort()
		return
	}
	c.JSON(200, comments)
}

func PostComments(c *gin.Context) {
	var cmt models.Comment
	c.BindJSON(&c)
	if cmt.Uid <= 0 {
		log.Error("Cannot get user id of comment.")
		c.Abort()
		return
	}
	if cmt.Content == "" {
		log.Error("No content in the post.")
		c.Abort()
		return
	}
	if cmt.Nickname == "" {
		cmt.Nickname = "Anonymous"
	}
	cmt.Create(lib.Conn)
}