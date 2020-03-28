package auth

import (
	"fmt"
	jwt "github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
	"square/lib"
	"square/models"
	"strconv"
	"time"
)

var secret = "unicorn"

func AuthDeleteMark() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		authHelper(ctx)
		uid := ctx.GetInt("id")
		midStr := ctx.Param("mid")
		mid, err := strconv.Atoi(midStr)
		if err != nil {
			log.Error("Cannot retrieve user id")
			ctx.Abort()
			return
		}

		uidInDb, err := models.GetUidByMid(mid)
		if err != nil {
			log.Error("Cannot get user id by mark id")
			ctx.Abort()
			return
		} else if uid != uidInDb {
			log.Error("User id not match mark record")
			ctx.Abort()
			return
		}

	}
}

func AuthDeletePost() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		authHelper(ctx)
		uid := ctx.GetInt("id")
		pidStr := ctx.Param("pid")
		pid, err := strconv.Atoi(pidStr)
		if err != nil {
			log.Error("Cannot retrieve user id")
			ctx.Abort()
			return
		}

		post, err := models.GetPostById(pid)
		if err != nil {
			log.Error("Cannot get user id by post id")
			ctx.Abort()
			return
		} else if uid != post.Uid {
			log.Error("User id not match post record")
			ctx.Abort()
			return
		}

	}
}

func AuthPri() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		authHelper(ctx)
		uid := ctx.GetInt("id")
		claimId := lib.GetUidFromParam(ctx)
		if claimId != uid {
			log.Error("User id not match!")
			ctx.Abort()
			return
		}
	}
}

func AuthPub() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		authHelper(ctx)
	}
}

// This function has been replaced by jwt method.
/*
func AuthPub() gin.HandlerFunc{
	return func(ctx *gin.Context) {
		token, err := ctx.Cookie("square")
		if err != nil {
			log.Error("Cannot read cookie: ", err)
			ctx.Abort()
			return
		} else if token == "" {
			log.Error("Empty cookie: ", err)
			ctx.Abort()
			return
		}

		var cookie map[string]interface{}
		err = json.Unmarshal([]byte(token), &cookie)
		if err != nil{
			log.Error("Parsing cookie failed: ", err)
			ctx.Abort()
			return
		}
		ctx.Set("id", cookie["id"])
		ctx.Next()
	}
}
*/

func GenerateToken(id int) string {
	token := jwt.New(jwt.GetSigningMethod("HS256"))
	token.Claims = jwt.MapClaims{
		"id":  id,
		"iss": "square",
		"exp": time.Now().Add(time.Hour * 24).Unix(),
	}

	tokenString, err := token.SignedString([]byte(secret))
	if err != nil {
		log.Error(err)
		return ""
	}
	return tokenString
}

func authHelper(ctx *gin.Context) {
	token, err := ctx.Cookie("jwt")
	if err != nil {
		log.Error("Cannot read token: ", err)
		ctx.Abort()
		return
	} else if token == "" {
		log.Error("Empty token.")
		ctx.Abort()
		return
	}

	id := checkToken(token)
	if id <= 0 {
		log.Error("Invalid token")
		ctx.Abort()
		return
	} else {
		ctx.Set("id", id)
	}
}

func checkToken(tokenString string) int {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Don't forget to validate the alg is what you expect:
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		return []byte(secret), nil
	})

	if err != nil {
		log.Error(err)
		return -1
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		id, _ := strconv.Atoi(fmt.Sprint(claims["id"]))
		return id
	} else {
		log.Error("token invalid")
		return -1
	}
}