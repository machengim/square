package lib

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"regexp"
	"strconv"
	"time"
)

const configFile = "assets/config.json"

type Config struct {
	Host     string `json:"host"`
	Port     int    `json:"port"`
	User     string `json:"user"`
	Password string `json:"password"`
	Dbname   string `json:"dbname"`
}

type NewUser struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Nickname string `json:"nickname"`
}

type LoginInfo struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// Field name should start in uppercase to export
// Ts is short for Timestamp, UTC is used.
type Post struct {
	Id       int    `json:"id"`
	Ts       string `json:"ts"`
	Uid      int    `json:"uid"`
	Nickname string `json:"nickname"`
	Status   int    `json:"status"`
	Comments int    `json:"comments"`
	Content  string `json:"content"`
}

// Used when user tries to send a new post.
type Draft struct {
	Uid      int
	Nickname string
	Status   int
	Content  string
}

func ErrLog(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

// Convert a time string to an array of int.
// User regex to split the timestamp from postgres.
// s[] : 0 year, 1 month, 2 day, 3 hour, 4 min, 5 sec, 6 millsec.
func timeSplit(ts string) [6]int16 {
	s := regexp.MustCompile("[-:T. ]").Split(ts, 7)
	var splitTime [6]int16
	for i := 0; i < 6; i++ {
		fig, err := strconv.ParseInt(s[i], 10, 16) // this method always return int64
		ErrLog(err)
		if fig < 0 || fig > 2020 {
			panic(fmt.Sprintf("Time %v out of range ", fig))
		}
		splitTime[i] = int16(fig)
	}

	return splitTime
}

// Calculate the time diffence between post time and current time
func TimeFromNow(ts string) string {
	current := time.Now().UTC().String()
	ct := timeSplit(current) // Current time
	pt := timeSplit(ts)      // Post time

	mins := []int32{525600, 43800, 1440, 60, 1}
	units := []string{"year", "month", "day", "hour", "min"}
	var gap int32 = 0
	i := 0
	for ; i < 5; i++ {
		gap += int32(ct[i]-pt[i]) * mins[i]
	}

	if gap < 1 {
		return "just now"
	}

	for i = 0; i < 5; i++ {
		if gap/mins[i] > 0 {
			break
		}
	}

	if gap/mins[i] > 1 {
		return fmt.Sprint(gap/mins[i]) + " " + units[i] + "s ago"
	} else {
		return fmt.Sprint(gap/mins[i]) + " " + units[i] + " ago"
	}
}

func ReadJsonConfig() Config {
	jsonFile, err := os.Open(configFile)
	ErrLog(err)
	defer jsonFile.Close()

	byteValue, _ := ioutil.ReadAll(jsonFile)
	var config Config
	json.Unmarshal(byteValue, &config)

	return config
}
