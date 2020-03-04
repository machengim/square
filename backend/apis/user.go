package apis

import (
	"square/lib"
	"square/models"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
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

func UpdataUserInfo(c *gin.Context) {
	var u models.User
	c.BindJSON(&u)
	if u.Id <= 0 {
		log.Error("Invalid user id.")
		c.Abort()
		return
	}
	columns := []string{"nickname"}
	values := []interface{}{u.Nickname}
	if u.Password == "" {
		columns = append(columns, "password")
		values = append(values, u.Password)
	}

	_, err := lib.UpdateEntryById("customer", u.Id, columns, values)
	if err != nil {
		log.Error("Cannot update user info: ", err)
		c.Abort()
		return
	}

	c.JSON(200, "OK")
}

func Register(c *gin.Context) {
	log.Info("Enter register process")
	var u models.User
	c.BindJSON(&u)
	// Use simple validation first.
	if strings.TrimSpace(u.Email) == "" || strings.TrimSpace(u.Password) == "" {
		log.Info("Register info not enough.")
		c.Abort()
		return
	}
	if strings.TrimSpace(u.Nickname) == "" {
		u.Nickname = "Anonymous"
	}

	_, err := u.Create(lib.Conn)
	if err != nil {
		log.Error(err)
		c.Abort()
		return
	}

	c.JSON(200, "OK")
}

func Login(c *gin.Context) {
	var u models.User
	c.BindJSON(&u)
	if u.Email == "" || u.Password == "" {
		log.Info("Login info not enough.")
		c.Abort()
		return
	}

	user, err := models.RetrieveUserByLogin(lib.Conn, u.Email, u.Password)
	if err != nil {
		log.Error("Login error: ", err)
		c.JSON(400, "User not found")
		return
	}

	c.SetCookie("local", strconv.Itoa(user.Id), 3600, "/", "localhost", false, false)
}
