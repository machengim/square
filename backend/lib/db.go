package lib

import (
	"database/sql"
	"fmt"
	"math"
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

func InsertDraft(d Draft, config Config) bool {
	db := connect(config)

	stmt, err := db.Prepare("INSERT INTO post(uid, nickname, status, content, rid) VALUES($1, $2, $3, $4, $5)")
	if err != nil {
		log.Error(err)
		return false
	}

	_, err = stmt.Exec(d.Uid, d.Nickname, d.Status, d.Content, d.Rid)
	if err != nil {
		log.Error(err)
		return false
	}

	if !updatePostsByOne(d.Uid, config) {
		return false
	}

	return true
}

// Return the public posts and the last row in the result set.
func RetrievePublicPosts(op int, current int, config Config) (PostBriefResult, error) {
	db := connect(config)

	var (
		result PostBriefResult
		stmt   *sql.Stmt
		rows   *sql.Rows
		err    error
	)

	sqlString := "SELECT id, nickname, content, ts, comments FROM post "
	switch op {
	case 0:
		sqlString += "ORDER BY ts DESC LIMIT $1"
	case 1:
		sqlString += "WHERE id > $1 ORDER BY ts DESC"
		break
	case -1:
		sqlString += "WHERE id < $1 ORDER BY ts DESC LIMIT $2"
		break
	default:
		break
	}
	log.Debug("Construct sql: ", sqlString)

	stmt, err = db.Prepare(sqlString)
	if err != nil {
		log.Error(err)
		return result, err
	}

	switch op {
	case 0:
		rows, err = stmt.Query(config.PostsPerPage)
		break
	case 1:
		rows, err = stmt.Query(current)
		break
	case -1:
		rows, err = stmt.Query(current, config.PostsPerPage)
		break
	default:
		break
	}

	if err != nil {
		log.Error(err)
		return result, err
	}

	result.HasOld = true
	result.Max = -1
	result.Min = math.MaxInt32
	for rows.Next() {
		var p PostBrief
		err = rows.Scan(&p.Id, &p.Nickname, &p.Content, &p.Ts, &p.Comments)
		if err != nil {
			log.Error(err)
			return result, err
		}
		p.Ts = TimeFromNow(p.Ts)
		result.Posts = append(result.Posts, p)
		if p.Id > result.Max {
			result.Max = p.Id
		}
		if p.Id < result.Min {
			result.Min = p.Id
		}
	}

	log.Debug("post per page: ", config.PostsPerPage)
	log.Debug("Posts result: ", result)
	if len(result.Posts) < config.PostsPerPage {
		result.HasOld = false
	}
	return result, nil
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

func RetrieveNicknameById(id int, config Config) (string, error) {
	db := connect(config)

	stmt, err := db.Prepare("SELECT nickname FROM customer WHERE id=$1")
	if err != nil {
		log.Error(err)
		return "", err
	}

	rows, err := stmt.Query(id)
	if err != nil {
		log.Error(err)
		return "", err
	}
	defer rows.Close()

	var nickname string
	for rows.Next() {
		err := rows.Scan(&nickname)
		if err != nil {
			log.Error(err)
			return "", err
		}
	}

	return nickname, nil
}

func updatePostsByOne(id int, config Config) bool {
	db := connect(config)

	stmt, err := db.Prepare("UPDATE customer SET posts=posts+1 WHERE ID=$1")
	if err != nil {
		log.Error(err)
		return false
	}

	_, err = stmt.Exec(id)
	if err != nil {
		log.Error(err)
		return false
	}

	return true
}

func UpdateNickname(id int, name string, config Config) bool {
	db := connect(config)

	stmt, err := db.Prepare("UPDATE customer SET nickname=$1 WHERE id=$2")
	if err != nil {
		log.Error(err)
		return false
	}

	_, err = stmt.Exec(name, id)
	if err != nil {
		log.Error(err)
		return false
	}

	return true
}

func CheckNewPost(max int, config Config) (int, error) {
	db := connect(config)

	// TODO: Notice the ">=" should be changed to ">" later.
	stmt, err := db.Prepare("SELECT COUNT(*) FROM post WHERE id>$1 AND status=0")
	if err != nil {
		log.Error(err)
		return -1, err
	}

	var count int
	row := stmt.QueryRow(max)
	err = row.Scan(&count)
	if err != nil {
		log.Error(err)
		return -1, err
	}

	return count, nil
}

func GetCommentsByPid(pid int, config Config) ([]Post, error) {
	db := connect(config)

	var comments []Post
	stmt, err := db.Prepare("SELECT id, ts, uid, nickname, status, comments, content " +
		"FROM post WHERE status=2 AND rid=$1")
	if err != nil {
		log.Error(err)
		return comments, err
	}

	rows, err := stmt.Query(pid)
	if err != nil {
		log.Error(err)
		return comments, err
	}
	defer rows.Close()

	for rows.Next() {
		var p Post
		err = rows.Scan(&p.Id, &p.Ts, &p.Uid, &p.Nickname, &p.Status, &p.Comments, &p.Content)
		if err != nil {
			log.Error(err)
			return comments, err
		}
		p.Ts = TimeFromNow(p.Ts)
		comments = append(comments, p)
	}

	return comments, nil
}
