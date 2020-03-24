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
	Mid			   int	  `json:"mid"`
}

func (post Post) Create(conn *sql.DB) (bool, error) {
	columns := []string{"uid", "nickname", "isPrivate", "content"}
	values := []interface{}{post.Uid, post.Nickname, post.IsPrivate, post.Content}
	_, err := lib.CreateEntry(conn, "post", columns, values)
	if err != nil {
		log.Error("Error when inserting new post.")
		return false, err
	}

	user, _ := RetrieveUserById(lib.Conn, post.Uid)
	user.Posts += 1
	user.UpdateById(lib.Conn)

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
	posts, err := readPosts(condition, values)
	return posts, err
}

func RetrievePrivatePosts(op int, page int, uid int) ([]Post, error) {
	if op == 1 {
		return RetrievePrivateMarks(page, uid)
	}
	var (
		condition string
		values    []interface{}
	)

	limit := lib.Conf.Limit
	offset := (page - 1) * lib.Conf.Limit
	//op: 1 marks, 0 posts, -1 comments; wait further action
	switch op {
	case -1:
		condition = "WHERE uid=$1 AND hasNewComments=$2 ORDER BY id desc OFFSET $3 LIMIT $4"
		values = append(values, uid, true, offset, limit)
	default:
		condition = "WHERE uid=$1 ORDER BY id desc OFFSET $2 LIMIT $3"
		values = append(values, uid, offset, limit)
		break
	}
	// All errors has been caught by sub function.
	posts, err := readPosts(condition, values)
	return posts, err
}

func RetrievePrivateMarks(page int, uid int) ([]Post, error) {
	limit := lib.Conf.Limit
	offset := (page - 1) * lib.Conf.Limit
	sqlString := "SELECT post.* FROM post, mark WHERE post.id=mark.pid AND mark.uid=$1 OFFSET $2 LIMIT $3"
	values := []interface{} {uid, offset, limit}
	rows, err := lib.ComplexQueryMultiple(sqlString, values)
	var posts []Post
	if err != nil {
		return posts, err
	}
	defer rows.Close()

	posts, err = readRows(rows)
	if err != nil {
		log.Error("Error when scanning posts:", err)
	}

	return posts, err
}

func readPosts(condition string, values []interface{}) ([]Post, error) {
	var posts []Post
	rows, err := lib.QueryMultiple(lib.Conn, "post", condition, values)
	if err != nil {
		log.Error("Cannot retrieve posts.")
		return posts, err
	}
	defer rows.Close()

	posts, err = readRows(rows)
	if err != nil {
		log.Error("Error when scanning posts:", err)
	}

	return posts, err
}

func readRows(rows *sql.Rows) ([]Post, error) {
	var posts []Post
	for rows.Next() {
		var p Post
		err := rows.Scan(&p.Id, &p.Ts, &p.Uid, &p.Nickname, &p.IsPrivate, &p.Comments,
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
	columns := []string{"comments", "hasNewComments"}
	values := []interface{}{post.Comments + 1, true}

	_, err := lib.UpdateEntryById("post", post.Id, columns, values)
	if err != nil {
		log.Error("Cannot update post.")
	}

	user, err := RetrieveUserById(lib.Conn, post.Uid)
	if err != nil {
		log.Error("Cannot retrieve user by id: ", err)
		return false, err
	}
	user.Comments += 1
	_, err = user.UpdateById(lib.Conn)
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

func CheckNewPost(pid int) (int, error) {
	condition := "WHERE id > $1"
	values := []interface{} {pid}
	count, err := lib.QueryCount("post", condition, values)
	if err != nil {
		log.Error("Error when checking new post")
		return -1, err
	}

	return count, nil
}