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
	corsConfig.AllowOrigins = []string{"http://localhost:4200", "http://localhost"}
	// Cooperate with axios withCredentials to transfer cookie in cors mode.
	corsConfig.AllowCredentials = true
	app.Use(cors.New(corsConfig))

	public := app.Group("/")
	public.Use(lib.AuthPub())
	{
		public.GET("/posts", apis.GetPublicPosts)
		public.GET("/posts/user/:uid", apis.GetPrivatePosts)
		public.GET("/user/:uid", apis.GetUserSummary)
		public.GET("/comments", apis.GetComments)
		public.POST("/login", apis.Login)
		public.POST("/posts", apis.PostPosts)
		public.POST("/comments", apis.PostComments)
		public.POST("/register", apis.Register)
		public.POST("/marks", apis.MarkPost)
		public.PUT("/user", apis.UpdataUserInfo)
		public.DELETE("/marks/:mid", apis.DeleteMark)
	}

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
