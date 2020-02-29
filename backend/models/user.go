package models

import (
	"database/sql"
	"square/db"

	log "github.com/sirupsen/logrus"
)

// Only use when a new user is registering
type NewUser struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Nickname string `json:"nickname"`
}

type User struct {
	Id       int
	Email    string
	Nickname string
	Posts    int
	Marks    int
	Messages int
	Comments int
}

func (user NewUser) Create(conn *sql.DB) (bool, error) {
	columns := []string{"email", "password", "nickname"}
	values := Reflect(user, 0)
	_, err := db.CreateEntry(conn, "customer", columns, values)
	if err != nil {
		log.Error("Error when inserting new user.")
		return false, err
	}
	return true, nil
}

func ReadUserById(conn *sql.DB, id int) (User, error) {
	// Password field has been excluded.
	//columns := []string{"id", "email", "nickname", "posts", "marks", "messages", "comments"}
	var (
		u       User
		columns []string
	)

	fields := Reflect(u, 1)
	for i := 0; i < len(fields); i++ {
		columns = append(columns, fields[i].(string))
	}
	log.Debug("columns is: ", columns)
	row, err := db.ReadEntryById(conn, id, "customer", columns)
	if err != nil {
		log.Error("Error when reading user.")
		return u, err
	}

	err = row.Scan(&u.Id, &u.Email, &u.Nickname, &u.Posts, &u.Marks, &u.Messages, &u.Comments)
	if err != nil {
		log.Error("Error when scanning row to user: ", err)
		return u, err
	}
	return u, nil
}
