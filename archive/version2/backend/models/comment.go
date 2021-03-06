package models

import (
	"database/sql"
	"square/lib"

	log "github.com/sirupsen/logrus"
)

type Comment struct {
	Id       int
	Ts       string
	Uid      int
	Nickname string
	Pid      int
	Content  string
}

func (c Comment) Create(conn *sql.DB) (bool, error) {
	columns := []string{"uid", "pid", "nickname", "content"}
	values := []interface{}{c.Uid, c.Pid, c.Nickname, c.Content}
	_, err := lib.CreateEntry(conn, "comment", columns, values)
	if err != nil {
		log.Error("Error when inserting new comment.")
		return false, err
	}

	return true, nil
}

func RetrieveCommentsByPid(pid int) ([]Comment, error) {
	condition := "WHERE pid=$1 ORDER BY id DESC"

	values := []interface{}{pid}

	comments, err := readComments(lib.Conn, condition, values)
	return comments, err
}

func readComments(conn *sql.DB, condition string, values []interface{}) ([]Comment, error) {
	var comments []Comment
	rows, err := lib.QueryMultiple(conn, "comment", condition, values)
	if err != nil {
		log.Error("Cannot retrieve comment.")
		return comments, err
	}
	defer rows.Close()

	for rows.Next() {
		var c Comment
		err = rows.Scan(&c.Id, &c.Ts, &c.Uid, &c.Nickname, &c.Pid, &c.Content)
		if err != nil {
			log.Error("Error when reading post results: ", err)
			return comments, err
		}
		c.Ts = lib.TimeFromNow(c.Ts)
		comments = append(comments, c)
	}

	return comments, nil
}
