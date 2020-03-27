package apis

import (
	"square/auth"
	"square/lib"
	"square/models"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	log "github.com/sirupsen/logrus"
)

func GetUserSummary(c *gin.Context) {
	uid := lib.GetUidFromParam(c)
	user, err := models.RetrieveUserById(lib.Conn, uid)
	if err != nil {
		log.Error("Cannot retrieve user info: ", err)
		c.Abort()
		return
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
	if u.Password != "" {
		columns = append(columns, "password")
		values = append(values, u.Password)
	}

	_, err := lib.UpdateEntryById("customer", u.Id, columns, values)
	if err != nil {
		log.Error("Cannot update user info: ", err)
		c.Abort()
		return
	}
	setCookie(u, c)
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

	_, err := models.RetrieveUserByLogin(lib.Conn, u.Email)
	if err == nil {
		log.Error("Same User Email")
		c.AbortWithStatusJSON(400, "Same email found.")
		return
	}

	hashedPw, err := hashPassword(u.Password)
	if err != nil {
		log.Error(err)
		c.Abort()
		return
	}

	u.Password = hashedPw
	success, err := u.Create(lib.Conn)
	if err != nil {
		log.Error(err)
		c.AbortWithStatusJSON(400, "Cannot create user")
		return
	} else if !success {
		log.Error("Creating user failed.")
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

	user, err := models.RetrieveUserByLogin(lib.Conn, u.Email)
	if err != nil {
		log.Error("Login error: ", err)
		c.JSON(400, "User not found")
		return
	}

	if !checkPasswordHash(u.Password, user.Password) {
		log.Error("Password not match.")
		c.JSON(400, "Password error")
		return
	}
	setCookie(user, c)
	c.JSON(200, "OK")
}

func Logout(c *gin.Context)  {
	c.SetCookie("square", "", -5, "/", "localhost", false, false)
	c.SetCookie("jwt", "", -5, "/", "localhost", false, true)
	c.JSON(200, "OK")
}

func setCookie(user models.User, c *gin.Context) {
	id := strconv.Itoa(user.Id)
	info := "{\"id\":" + id + ",\"nickname\":\"" + user.Nickname + "\"}"
	c.SetCookie("square", info, 3600 * 24, "/", "localhost", false, false)
	token := auth.GenerateToken(user.Id)
	c.SetCookie("jwt", token, 3600 * 24, "/", "localhost", false, true)
}

func hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	log.Debug("hashed pw: ", string(bytes))
	return string(bytes), err
}

func checkPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}