package lib

import (
	"database/sql"
	"fmt"
	"time"
)

func connect() *sql.DB {
	var (
		host     = "localhost"
		port     = 5432
		user     = "postgres"
		password = "qwer1234"
		dbname   = "test"
	)

	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s password=%s "+
		"dbname=%s sslmode=disable", host, port, user, password, dbname)
	db, err := sql.Open("postgres", psqlInfo)
	ErrLog(err)

	db.SetMaxOpenConns(5)
	db.SetMaxIdleConns(2)
	db.SetConnMaxLifetime(5 * time.Minute)

	return db
}

func InsertData() {
	db := connect()

	stmt, err := db.Prepare("INSERT INTO post(uid, nickname, content) VALUES($1, $2, $3)")
	ErrLog(err)

	_, err = stmt.Exec(1, "Dog", "Haha, I'm here!")
	ErrLog(err)

	fmt.Println("Insertion complete!")
}

func RetrieveData() []Post {
	db := connect()

	rows, err := db.Query("select * from post order by ts desc")
	ErrLog(err)

	defer rows.Close()

	var posts []Post
	for rows.Next() {
		var p Post
		err := rows.Scan(&p.Id, &p.Ts, &p.Uid, &p.Nickname, &p.Status,
			&p.Comments, &p.Content)
		ErrLog(err)
		p.Ts = TimeFromNow(p.Ts)
		posts = append(posts, p)
	}

	fmt.Println(time.Now())
	err = rows.Err()
	ErrLog(err)

	fmt.Println("Retrieved complete!")
	return posts
}

func CloseDB() {
	db := connect()
	db.Close()
}
