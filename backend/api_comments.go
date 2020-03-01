package main

import (
	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
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
	comments, err := RetrieveCommentsByPid(pid)
	if err != nil {
		c.Abort()
		return
	}
	c.JSON(200, comments)
}
