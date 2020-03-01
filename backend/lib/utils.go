package lib

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
	"io/ioutil"
	"os"
	"reflect"
	"strconv"
)

type Config struct {
	Host     string `json:"host"`
	Port     int    `json:"port"`
	User     string `json:"user"`
	Password string `json:"password"`
	Dbname   string `json:"dbname"`
	Limit    int    `json:"limit"`
}

var (
	Conf Config
	Conn *sql.DB
)

const configPath = "assets/config.json"

func InitSystem() {
	var err error
	Conf, err = readConfig(configPath)
	if err != nil {
		os.Exit(1)
	}

	Conn, err = OpenDb(Conf)
	if err != nil {
		os.Exit(1)
	}

	log.Info("Database connection opened.")
}

func readConfig(path string) (Config, error) {
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

// op == 0 means getting values, op==1 means getting fields name, op==2 means getting fields address
func Reflect(model interface{}, op int) []interface{} {
	log.Debug("op == ", op)
	getType := reflect.TypeOf(model)
	getValue := reflect.ValueOf(model)
	var results []interface{}
	var v interface{}
	for i := 0; i < getType.NumField(); i++ {
		if op == 0 {
			v = getValue.Field(i).Interface()
		} else if op == 1 {
			v = getType.Field(i).Name
		} else {
			// This part of code has some problems.
			t := reflect.ValueOf(model).Elem()
			v = t.Field(i).Addr().Interface()
		}
		log.Debug("v == ", v)
		results = append(results, v)
	}

	return results
}

// TODO: the functions below need for further considerations.
func DeleteById(conn *sql.DB, id int, table string) (bool, error) {
	_, err := DeleteEntryById(conn, id, table)
	if err != nil {
		log.Error("Error when deleting user.")
		return false, err
	}
	return true, nil
}

func GetUidFromParam(c *gin.Context) (int) {
	uidVal := c.Param("uid")
	if uidVal == "" {
		log.Error("User id not found")
		c.Abort()
	}
	uid, err := strconv.Atoi(uidVal)
	if err != nil {
		log.Error("Cannot retrieve user id")
		c.Abort()
	}

	return uid
}