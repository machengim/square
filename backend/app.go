package main

import (
	"os"
	"os/signal"
	"square/apis"
	"square/auth"
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
	app.MaxMultipartMemory = 8 << 20 // Max file size allowed is 8MB.

	app.POST("/login", apis.Login)
	app.POST("/register", apis.Register)

	public := app.Group("/")
	public.Use(auth.AuthPub())
	{
		public.GET("/posts", apis.GetPublicPosts)
		public.GET("/comments", apis.GetComments)
		public.GET("/logout", apis.Logout)
		public.GET("/newPosts", apis.GetNewPostsNumber)
		public.GET("/search/:keyword", apis.GetSearchPosts)
		public.POST("/posts", apis.PostPosts)
		public.POST("/comments", apis.PostComments)
		public.POST("/marks", apis.MarkPost)
		public.PUT("/user", apis.UpdataUserInfo)
	}

	private := app.Group("/")
	private.Use(auth.AuthPri())
	{
		public.GET("/posts/user/:uid", apis.GetPrivatePosts)
		public.GET("/user/:uid", apis.GetUserSummary)
	}

	markAuth := app.Group("/")
	markAuth.Use(auth.AuthDeleteMark())
	{
		markAuth.DELETE("/marks/:mid", apis.DeleteMark)
	}

	postAuth := app.Group("/")
	postAuth.Use(auth.AuthDeletePost())
	{
		postAuth.DELETE("/posts/:pid", apis.DeletePost)
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
