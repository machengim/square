package main

import (
	"database/sql"
	"fmt"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

const (
	host     = "localhost"
	port     = 5432
	user     = "postgres"
	password = "1234"
	dbname   = "test"
)

/* Notice how this struct binds to json */
type Post struct {
	Author  string `json:"author"`
	Content string `json:"content"`
	Time    string `json:"time"`
}

func main() {
	r := gin.Default()
	r.Use(cors.Default())
	r.GET("/ping", getPing)
	r.GET("/summary", getSummary)
	r.GET("/posts", getPost)
	r.Run(":8080")
}

func getPing(c *gin.Context) {
	c.String(200, "Hello, world!")
}

func getSummary(c *gin.Context) {
	connect()
	c.JSON(200, gin.H{
		"total_jobs":     6792,
		"average_salary": 54778,
		"hottest_career": "Frontend Developer",
		"best_city":      "Sydney",
	})
}

func getPost(c *gin.Context) {
	p1 := Post{"Alice", "This is my first post!", "One hour ago"}
	p2 := Post{"Bob", "Hello world.", "Yesterday"}
	p3 := Post{"Caroline", "Good night, everyone...", "One week ago"}
	posts := []Post{p1, p2, p3}
	c.JSON(200, posts)
}

func connect() {
	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s password=%s "+
		"dbname=%s sslmode=disable", host, port, user, password, dbname)
	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		panic(err)
	}
	defer db.Close()
	err = db.Ping()
	if err != nil {
		panic(err)
	}

	fmt.Println("Successfully connected!")
}
