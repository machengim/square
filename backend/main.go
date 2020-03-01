package main

import (
	"database/sql"
	"os"
	"os/signal"
	"syscall"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
	log "github.com/sirupsen/logrus"
)

type Config struct {
	Host     string `json:"host"`
	Port     int    `json:"port"`
	User     string `json:"user"`
	Password string `json:"password"`
	Dbname   string `json:"dbname"`
	Limit    int    `json:"limit"`
}

const configPath = "assets/config.json"

var (
	conf Config
	conn *sql.DB
)

func init() {
	log.SetLevel(log.DebugLevel)

	var err error
	conf, err = ReadConfig(configPath)
	if err != nil {
		os.Exit(1)
	}

	conn, err = OpenDb(conf)
	if err != nil {
		os.Exit(1)
	}

	log.Info("Database connection opened.")
}

func main() {
	shutdownHandler()

	app := gin.Default()
	app.GET("/posts", GetPublicPosts)
	app.GET("/posts/user/:uid", GetPrivatePosts)
	app.GET("/user/:uid", GetUserSummary)
	app.GET("/comments", GetComments)
	app.POST("/posts", PostPosts)
	app.Run(":8080")
}

func shutdownHandler() {
	c := make(chan os.Signal, 2)
	signal.Notify(c, os.Interrupt, syscall.SIGTERM)
	go func() {
		<-c
		CloseDb(conn)
		log.Info("Database connection closed.")
		os.Exit(0)
	}()
}
