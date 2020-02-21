package lib

import (
	"database/sql"
	"fmt"
	"time"
)

func connect(config Config) *sql.DB {
	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s password=%s "+
		"dbname=%s sslmode=disable", config.Host, config.Port, config.User,
		config.Password, config.Dbname)

	db, err := sql.Open("postgres", psqlInfo)
	ErrLog(err)

	db.SetMaxOpenConns(5)
	db.SetMaxIdleConns(2)
	db.SetConnMaxLifetime(5 * time.Minute)

	return db
}

func InsertData(d Draft, config Config) {
	db := connect(config)

	stmt, err := db.Prepare("INSERT INTO post(uid, nickname, status, content) VALUES($1, $2, $3, $4)")
	ErrLog(err)

	_, err = stmt.Exec(d.Uid, d.Nickname, d.Status, d.Content)
	ErrLog(err)

	fmt.Println("Insertion complete!")
}

func RetrieveData(config Config) []Post {
	db := connect(config)

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

func CloseDB(config Config) {
	db := connect(config)
	db.Close()
}
