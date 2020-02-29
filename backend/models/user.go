package models

import (
	"database/sql"
	"square/db"

	log "github.com/sirupsen/logrus"
)

// Notice the field Password should never be transfered back.
type User struct {
	Id       int
	Email    string
	Password string
	Nickname string
	Posts    int
	Marks    int
	Messages int
	Comments int
}

// Create function is used for registeration.
func (user User) Create(conn *sql.DB) (bool, error) {
	columns := []string{"email", "password", "nickname"}
	values := []interface{}{&user.Email, &user.Password, &user.Nickname}
	_, err := db.CreateEntry(conn, "customer", columns, values)
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

	row, err := db.QuerySingle(conn, "customer", columns, values)
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

func DeleteUserById(conn *sql.DB, id int) (bool, error) {
	_, err := db.DeleteEntryById(conn, id, "customer")
	if err != nil {
		log.Error("Error when deleting user.")
		return false, err
	}
	return true, nil
}

// Notice this method cannot change id, email and password.
func (user User) UpdateById(conn *sql.DB) (bool, error) {
	columns := []string{"nickname", "posts", "marks", "messages", "comments"}
	values := Reflect(user, 0)

	_, err := db.UpdateEntryById(conn, "customer", user.Id, columns, values[3:])
	if err != nil {
		log.Error("Cannot update user.")
	}

	return true, err
}

func (user User) UpdatePassword(conn *sql.DB) (bool, error) {
	columns := []string{"password"}
	values := []interface{}{user.Password}

	_, err := db.UpdateEntryById(conn, "customer", user.Id, columns, values)
	if err != nil {
		log.Error("Cannot update user.")
	}

	return true, err
}