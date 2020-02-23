package lib

import (
	"database/sql"
	"fmt"
	"time"

	log "github.com/sirupsen/logrus"
)

func connect(config Config) *sql.DB {
	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s password=%s "+
		"dbname=%s sslmode=disable", config.Host, config.Port, config.User,
		config.Password, config.Dbname)

	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		log.Fatal("Cannot connect to database.")
	}

	db.SetMaxOpenConns(5)
	db.SetMaxIdleConns(2)
	db.SetConnMaxLifetime(5 * time.Minute)

	return db
}

func InsertData(d Draft, config Config) bool {
	db := connect(config)

	stmt, err := db.Prepare("INSERT INTO post(uid, nickname, status, content) VALUES($1, $2, $3, $4)")
	if err != nil {
		log.Error(err)
		return false
	}

	_, err = stmt.Exec(d.Uid, d.Nickname, d.Status, d.Content)
	if err != nil {
		log.Error(err)
		return false
	}

	return true
}

// Return the public posts and the last row in the result set.
func RetrievePublicPosts(offset int, config Config) ([]Post, int) {
	db := connect(config)

	queryString := "SELECT * FROM post WHERE status=0 "
	if offset <= 0 {
		queryString += " ORDER BY ID DESC LIMIT $1"
	} else {
		queryString += " AND id<$1 ORDER BY ID DESC LIMIT $2"
	}

	var (
		rows *sql.Rows
		err  error
	)

	stmt, err := db.Prepare(queryString)
	if err != nil {
		log.Error(err)
		return nil, 0
	}
	// Retrieve 5 posts everytime.
	// TODO: this numbers should be written into config file later.
	if offset <= 0 {
		rows, err = stmt.Query(5)
	} else {
		rows, err = stmt.Query(5, offset)
	}

	if err != nil {
		log.Error(err)
		return nil, 0
	}

	defer rows.Close()

	var posts []Post
	for rows.Next() {
		var p Post
		err := rows.Scan(&p.Id, &p.Ts, &p.Uid, &p.Nickname, &p.Status,
			&p.Comments, &p.Content)
		if err != nil {
			log.Error(err)
			return nil, 0
		}
		p.Ts = TimeFromNow(p.Ts)
		posts = append(posts, p)
		offset = p.Id
	}

	return posts, offset
}

func CloseDB(config Config) {
	db := connect(config)
	db.Close()
}

func InsertUser(u NewUser, config Config) (int, string) {
	db := connect(config)

	stmt, err := db.Prepare("SELECT email FROM customer WHERE email=$1")
	if err != nil {
		log.Error(err)
		return -1, ""
	}

	rows, err := stmt.Query(u.Email)
	if err != nil {
		log.Error(err)
		return -1, ""
	}
	defer rows.Close()
	if rows.Next() {
		log.Debug("Email existed.")
		return 400, "Email already registered."
	}

	stmt, err = db.Prepare("INSERT INTO customer(email, password, nickname) VALUES($1, $2, $3)")
	if err != nil {
		log.Error(err)
		return -1, ""
	}

	_, err = stmt.Exec(u.Email, u.Password, u.Nickname)
	if err != nil {
		log.Error(err)
		return -1, ""
	}

	return 200, "OK"
}

func ValidateUser(i LoginInfo, config Config) int {
	db := connect(config)

	stmt, err := db.Prepare("SELECT id FROM customer WHERE email=$1 AND password=$2")
	if err != nil {
		log.Error(err)
		return -1
	}

	rows, err := stmt.Query(i.Email, i.Password)
	if err != nil {
		log.Error(err)
		return -1
	}
	defer rows.Close()

	id := -1
	for rows.Next() {
		err := rows.Scan(&id)
		if err != nil {
			log.Error(err)
			return -1
		}
	}

	return id
}

func GetUserSummary(id int, config Config) (UserSummary, error) {
	db := connect(config)

	var summary UserSummary
	stmt, err := db.Prepare("SELECT nickname, posts, marks, comments FROM customer " +
		"WHERE id=$1")
	if err != nil {
		log.Error(err)
		return summary, err
	}

	rows, err := stmt.Query(id)
	if err != nil {
		log.Error(err)
		return summary, err
	}
	defer rows.Close()

	for rows.Next() {
		err := rows.Scan(&summary.Nickname, &summary.Posts, &summary.Marked, &summary.Comments)
		if err != nil {
			log.Error(err)
			return summary, err
		}
	}

	return summary, nil
}
