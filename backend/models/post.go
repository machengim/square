package models

import (
	"database/sql"
	"square/lib"

	log "github.com/sirupsen/logrus"
)

type Post struct {
	Id             int    `json:"id"`
	Ts             string `json:"ts"`
	Uid            int    `json:"uid"`
	Nickname       string `json:"nickname"`
	IsPrivate      bool   `json:"isPrivate"`
	Comments       int    `json:"comments"`
	Content        string `json:"content"`
	HasNewComments bool   `json:"hasNewComments"`
}

func (post Post) Create(conn *sql.DB) (bool, error) {
	columns := []string{"uid", "nickname", "isPrivate", "content"}
	values := []interface{}{post.Uid, post.Nickname, post.IsPrivate, post.Content}
	_, err := lib.CreateEntry(conn, "post", columns, values)
	if err != nil {
		log.Error("Error when inserting new post.")
		return false, err
	}

	return true, nil
}

func RetrievePublicPosts(op int, offset int, limit int) ([]Post, error) {
	var (
		condition string
		values    []interface{}
	)

	private := false
	switch op {
	case 1:
		condition = "WHERE id>$1 AND isPrivate=$2 ORDER BY id DESC LIMIT $3"
		values = append(values, offset, private, limit)
		break
	case -1:
		condition = "WHERE id<$1 AND isPrivate=$2 ORDER BY id DESC LIMIT $3"
		values = append(values, offset, private, limit)
		break
	default:
		condition = "WHERE isPrivate=$1 ORDER BY id DESC LIMIT $2"
		values = append(values, private, limit)
		break
	}

	// All errors has been caught by sub function.
	posts, err := readPosts(lib.Conn, condition, values)
	return posts, err
}

func RetrievePrivatePosts(op int, offset int, limit int, uid int) ([]Post, error) {
	var (
		condition string
		values    []interface{}
	)

	switch op {
	case 1:
		condition = "WHERE id>$1 AND uid=$2 ORDER BY id DESC LIMIT $3"
		values = append(values, offset, uid, limit)
		break
	case -1:
		condition = "WHERE id<$1 AND uid=$2 ORDER BY id DESC LIMIT $3"
		values = append(values, offset, uid, limit)
		break
	default:
		condition = "WHERE uid=$1 ORDER BY id DESC LIMIT $2"
		values = append(values, uid, limit)
		break
	}

	// All errors has been caught by sub function.
	posts, err := readPosts(lib.Conn, condition, values)
	return posts, err
}

func readPosts(conn *sql.DB, condition string, values []interface{}) ([]Post, error) {
	var posts []Post
	rows, err := lib.QueryMultiple(conn, "post", condition, values)
	if err != nil {
		log.Error("Cannot retrieve posts.")
		return posts, err
	}
	defer rows.Close()

	for rows.Next() {
		var p Post
		err = rows.Scan(&p.Id, &p.Ts, &p.Uid, &p.Nickname, &p.IsPrivate, &p.Comments,
			&p.Content, &p.HasNewComments)
		if err != nil {
			log.Error("Error when reading post results: ", err)
			return posts, err
		}
		p.Ts = lib.TimeFromNow(p.Ts)
		posts = append(posts, p)
	}

	return posts, nil
}

// Used to increment comments number by 1 when user sends a comment to this post.
func (post Post) IncrementCommentsById() (bool, error) {
	columns := []string{"comments"}
	values := []interface{}{post.Comments + 1}

	_, err := lib.UpdateEntryById(lib.Conn, "post", post.Id, columns, values)
	if err != nil {
		log.Error("Cannot update post.")
	}
	return true, err
}

func GetPostById(pid int) (Post, error) {
	columns := []string{"id"}
	values := []interface{}{pid}
	row, err := lib.QuerySingle(lib.Conn, "post", columns, values)
	var p Post
	if err != nil {
		return p, err
	}
	err = row.Scan(&p.Id, &p.Ts, &p.Uid, &p.Nickname, &p.IsPrivate, &p.Comments,
		&p.Content, &p.HasNewComments)
	return p, err
}
