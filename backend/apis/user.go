package apis

import (
	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
	"square/lib"
	"square/models"
)

func GetUserSummary(c *gin.Context) {
	uid := lib.GetUidFromParam(c)
	user, err := models.RetrieveUserById(lib.Conn, uid)
	if err != nil {
		log.Error("Cannot retrieve user info: ", err)
		c.Abort()
	}
	user.Password = ""
	c.JSON(200, user)
}