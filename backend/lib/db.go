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

	return posts
}

func CloseDB(config Config) {
	db := connect(config)
	db.Close()
}

func InsertUser(u NewUser, config Config) (int, string) {
	db := connect(config)

	stmt, err := db.Prepare("SELECT email FROM customer WHERE email=$1")
	ErrLog(err)

	rows, err := stmt.Query(u.Email)
	ErrLog(err)
	defer rows.Close()
	if rows.Next() {
		fmt.Println("Email already existed in database.")
		return 400, "Email already existed in database."
	}

	stmt, err = db.Prepare("INSERT INTO customer(email, password, nickname) VALUES($1, $2, $3)")
	ErrLog(err)

	_, err = stmt.Exec(u.Email, u.Password, u.Nickname)
	ErrLog(err)

	return 200, "OK"
}

func ValidateUser(i LoginInfo, config Config) int {
	db := connect(config)

	stmt, err := db.Prepare("SELECT id FROM customer WHERE email=$1 AND password=$2")
	ErrLog(err)

	rows, err := stmt.Query(i.Email, i.Password)
	ErrLog(err)
	defer rows.Close()

	id := -1
	for rows.Next() {
		err := rows.Scan(&id)
		ErrLog(err)
	}

	return id
}

func GetUserSummary(id int, config Config) UserSummary {
	db := connect(config)

	stmt, err := db.Prepare("SELECT nickname, posts, marks, comments FROM customer " +
		"WHERE id=$1")
	ErrLog(err)

	rows, err := stmt.Query(id)
	ErrLog(err)
	defer rows.Close()

	var summary UserSummary
	for rows.Next() {
		err := rows.Scan(&summary.Nickname, &summary.Posts, &summary.Marked, &summary.Comments)
		ErrLog(err)
	}

	return summary
}
