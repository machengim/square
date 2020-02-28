package db

import (
	"database/sql"
	"fmt"
	"square/lib"
	"time"

	log "github.com/sirupsen/logrus"
)

func OpenDb(config lib.Config) (*sql.DB, error) {
	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s password=%s "+
		"dbname=%s sslmode=disable", config.Host, config.Port, config.User,
		config.Password, config.Dbname)

	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		log.Fatal("Cannot ope databanse: ", err)
		return db, err
	}

	db.SetMaxOpenConns(10)
	db.SetMaxIdleConns(3)
	db.SetConnMaxLifetime(30 * time.Minute)

	return db, nil
}

func CloseDb(conn *sql.DB) {
	conn.Close()
}
