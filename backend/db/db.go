package db

import (
	"database/sql"
	"fmt"
	"square/lib"
	"strconv"
	"time"

	log "github.com/sirupsen/logrus"
)

func OpenDb(config lib.Config) (*sql.DB, error) {
	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s password=%s "+
		"dbname=%s sslmode=disable", config.Host, config.Port, config.User,
		config.Password, config.Dbname)

	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		log.Fatal("Error when opening Db: ", err)
		return db, err
	}

	db.SetMaxOpenConns(10)
	db.SetMaxIdleConns(3)
	db.SetConnMaxLifetime(30 * time.Minute)

	return db, nil
}

func CreateEntry(conn *sql.DB, table string, columns []string, values []interface{}) (bool, error) {
	sqlString := "INSERT INTO " + table + "("
	for i := 0; i < len(columns); i++ {
		sqlString += columns[i]
		if i != len(columns)-1 {
			sqlString += ", "
		} else {
			sqlString += ") VALUES("
		}
	}
	for i := 0; i < len(columns); i++ {
		sqlString += "$" + strconv.Itoa(i+1)
		if i != len(columns)-1 {
			sqlString += ", "
		} else {
			sqlString += ")"
		}
	}
	log.Debug(sqlString)

	stmt, err := conn.Prepare(sqlString)
	if err != nil {
		log.Error("Error when preparing stmt: ", err)
		return false, err
	}

	_, err = stmt.Exec(values...)
	if err != nil {
		log.Error("Error when executing sql: ", err)
		return false, err
	}
	return true, nil
}

func DeleteEntryById(conn *sql.DB, id int, table string) (bool, error) {
	sqlString := "DELETE FROM " + table + " WHERE id=$1"
	stmt, err := conn.Prepare(sqlString)
	if err != nil {
		log.Error("Error when deleting entry: ", err)
		return false, err
	}

	_, err = stmt.Exec(id)
	if err != nil {
		log.Error("Error when executing sql: ", err)
		return false, err
	}

	return true, nil
}

func ReadEntryById(conn *sql.DB, id int, table string, columns []string) (*sql.Row, error) {
	sqlString := "SELECT "
	for i := 0; i < len(columns); i++ {
		sqlString += columns[i]
		if i != len(columns)-1 {
			sqlString += ", "
		}
	}
	sqlString += " FROM " + table + " WHERE ID=$1"
	log.Debug(sqlString)

	var row *sql.Row
	stmt, err := conn.Prepare(sqlString)
	if err != nil {
		log.Error("Error when reading entry: ", err)
		return row, err
	}
	row = stmt.QueryRow(id)
	return row, nil
}

func CloseDb(conn *sql.DB) {
	conn.Close()
}
