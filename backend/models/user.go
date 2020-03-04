package models

import (
	"database/sql"
	"square/lib"

	log "github.com/sirupsen/logrus"
)

// Notice the field Password should never be transfered back.
type User struct {
	Id       int    `json:"id"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Nickname string `json:"nickname"`
	Posts    int    `json:"posts"`
	Marks    int    `json:"marks"`
	Messages int    `json:"messages"`
	Comments int    `json:"comments"`
}

// Create function is used for registeration.
func (user User) Create(conn *sql.DB) (bool, error) {
	columns := []string{"email", "password", "nickname"}
	values := []interface{}{&user.Email, &user.Password, &user.Nickname}
	_, err := lib.CreateEntry(conn, "customer", columns, values)
	if err != nil {
		log.Error("Error when inserting new user.")
		return false, err
	}
	return true, nil
}

// Retrieve a user by id.
func RetrieveUserById(conn *sql.DB, id int) (User, error) {
	columns := []string{"id"}
	values := []interface{}{id}
	user, err := readSingleUser(conn, columns, values)
	if err != nil {
		log.Error(err)
	}

	return user, err
}

// Retrieve a user by email and password. Used in login section.
func RetrieveUserByLogin(conn *sql.DB, email string, password string) (User, error) {
	columns := []string{"email", "password"}
	values := []interface{}{email, password}
	user, err := readSingleUser(conn, columns, values)
	if err != nil {
		log.Error(err)
	}

	return user, err
}

func readSingleUser(conn *sql.DB, columns []string, values []interface{}) (User, error) {
	var u User

	row, err := lib.QuerySingle(conn, "customer", columns, values)
	if err != nil {
		log.Error("Error when reading user.")
		return u, err
	}

	err = row.Scan(&u.Id, &u.Password, &u.Email, &u.Nickname, &u.Posts, &u.Marks, &u.Messages, &u.Comments)
	if err != nil {
		log.Error("Error when scanning row to user: ", err)
		return u, err
	}
	return u, nil
}

// Notice this method cannot change id, email and password.
func (user User) UpdateById(conn *sql.DB) (bool, error) {
	columns := []string{"nickname", "posts", "marks", "messages", "comments"}
	values := lib.Reflect(user, 0)

	_, err := lib.UpdateEntryById("customer", user.Id, columns, values[3:])
	if err != nil {
		log.Error("Cannot update user.")
	}

	return true, err
}

func (user User) UpdatePassword(conn *sql.DB) (bool, error) {
	columns := []string{"password"}
	values := []interface{}{user.Password}

	_, err := lib.UpdateEntryById("customer", user.Id, columns, values)
	if err != nil {
		log.Error("Cannot update user.")
	}

	return true, err
}
