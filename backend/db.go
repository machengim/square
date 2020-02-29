package main

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"strconv"
	"time"

	log "github.com/sirupsen/logrus"
)


func ReadConfig(path string) (Config, error) {
	var config Config

	data, err := ioutil.ReadFile(path)
	if err != nil {
		log.Fatal("Cannot read config file. ", err)
		return config, err
	}

	err = json.Unmarshal(data, &config)
	if err != nil {
		fmt.Println(err)
		return config, err
	}

	return config, nil
}



func OpenDb(config Config) (*sql.DB, error) {
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
	if len(columns) != len(values) {
		log.Error("Columns and values lengthes not match.")
		return false, errors.New("Invalid input")
	}
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

func QuerySingle(conn *sql.DB, table string, columns []string, values []interface{}) (*sql.Row, error) {
	sqlString := "SELECT * FROM " + table + " WHERE "
	for i := 0; i < len(columns); i++ {
		sqlString += columns[i] + "=$" + strconv.Itoa(i+1)
		if i != len(columns)-1 {
			sqlString += " AND "
		}
	}
	log.Debug(sqlString)

	var row *sql.Row
	stmt, err := conn.Prepare(sqlString)
	if err != nil {
		log.Error("Error when querying entry: ", err)
		return row, err
	}
	row = stmt.QueryRow(values...)
	return row, nil
}

func QueryMultiple(conn *sql.DB, table string, condition string, values []interface{}) (*sql.Rows, error) {
	sqlString := "SELECT * FROM " + table + " " + condition
	var rows *sql.Rows
	stmt, err := conn.Prepare(sqlString)
	if err != nil {
		log.Error("Error when preparing statement: ", err)
		return rows, err
	}

	rows, err = stmt.Query(values...)
	if err != nil {
		log.Error("Error when querying entries: ", err)
	}

	return rows, err
}

func UpdateEntryById(conn *sql.DB, table string, id int, columns []string, values []interface{}) (bool, error) {
	if len(columns) != len(values) {
		log.Error("Columns and values lengthes not match.")
		return false, errors.New("Invalid input")
	}
	sqlString := "UPDATE " + table + " SET "
	for i := 0; i < len(columns); i++ {
		sqlString += columns[i] + "=$" + strconv.Itoa(i+1)
		if i != len(columns)-1 {
			sqlString += ", "
		} else {
			sqlString += " WHERE id=$" + strconv.Itoa(i+2)
		}
	}

	stmt, err := conn.Prepare(sqlString)
	if err != nil {
		log.Error("Error when preparing statement: ", err)
		return false, err
	}
	// The id needs to be appended to the end of the values array as the last $X.
	values = append(values, id)
	_, err = stmt.Exec(values...)
	if err != nil {
		log.Error("Error when executing sql: ", err)
		return false, err
	}

	return true, nil
}

func CloseDb(conn *sql.DB) {
	conn.Close()
}
