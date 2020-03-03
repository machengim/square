package main

import (
	"os"
	"os/signal"
	"square/apis"
	"square/lib"
	"syscall"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
	log "github.com/sirupsen/logrus"
)

func init() {
	log.SetLevel(log.DebugLevel)
	lib.InitSystem()
}

func main() {
	shutdownHandler()

	app := gin.Default()
	corsConfig := cors.DefaultConfig()
	corsConfig.AllowOrigins = []string{"http://localhost:4200"}
	// Cooperate with axios withCredentials to transfer cookie in cors mode.
	corsConfig.AllowCredentials = true
	app.Use(cors.New(corsConfig))

	app.GET("/posts", apis.GetPublicPosts)
	app.GET("/posts/user/:uid", apis.GetPrivatePosts)
	app.GET("/user/:uid", apis.GetUserSummary)
	app.GET("/comments", apis.GetComments)
	app.POST("/posts", apis.PostPosts)
	app.POST("/comments", apis.PostComments)
	app.Run(":8080")
}

func shutdownHandler() {
	c := make(chan os.Signal, 2)
	signal.Notify(c, os.Interrupt, syscall.SIGTERM)
	go func() {
		<-c
		lib.CloseDb(lib.Conn)
		log.Info("Database connection closed.")
		os.Exit(0)
	}()
}
