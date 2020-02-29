package main

import (
	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
)

func GetUserSummary(c *gin.Context) {
	uid := GetUidFromParam(c)
	user, err := RetrieveUserById(conn, uid)
	if err != nil {
		log.Error("Cannot retrieve user info: ", err)
		c.Abort()
	}
	user.Password = ""
	c.JSON(200, user)
}