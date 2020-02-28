package main

import (
	"database/sql"
	"os"
	"os/signal"
	"square/db"
	"square/lib"
	"syscall"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
	log "github.com/sirupsen/logrus"
)

var (
	config lib.Config
	conn   *sql.DB
)

func init() {
	var err error
	config, err = lib.ReadConfig("assets/config.json")
	if err != nil {
		os.Exit(1)
	}

	conn, err = db.OpenDb(config)
	if err != nil {
		os.Exit(1)
	}
	log.Info("Database connection opened.")
}

func main() {
	shutdown()

	app := gin.Default()
	app.GET("/", func(c *gin.Context) {
		c.String(200, "Hello world!")
	})
	app.Run(":8080")
}

func shutdown() {
	c := make(chan os.Signal, 2)
	signal.Notify(c, os.Interrupt, syscall.SIGTERM)
	go func() {
		<-c
		db.CloseDb(conn)
		log.Info("Database connection closed.")
		os.Exit(0)
	}()
}
