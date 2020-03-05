package lib

import (
	"encoding/json"
	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
)

// Simple implementation for now.
// TODO: JWT
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
