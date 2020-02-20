package lib

import (
	"fmt"
	"log"
	"regexp"
	"strconv"
	"time"
)

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
func timeSplit(ts string) [6]int64 {
	s := regexp.MustCompile("[-:T. ]").Split(ts, 7)
	var splitTime [6]int64
	for i := 0; i < 6; i++ {
		fig, err := strconv.ParseInt(s[i], 10, 16) // this method always return int64
		ErrLog(err)
		if fig < 0 || fig > 2020 {
			panic(fmt.Sprintf("Time %v out of range ", fig))
		}
		splitTime[i] = fig
	}

	return splitTime
}

// It's inconvenient to convert int16 to string, so I change to int64
func TimeFromNow(ts string) string {
	current := time.Now().UTC().String()
	currentTime := timeSplit(current)
	postTime := timeSplit(ts)

	var differ int64 = 0
	i := 0
	for ; i < 6; i++ {
		if currentTime[i]-postTime[i] > 0 {
			differ = currentTime[i] - postTime[i]
			break
		}
	}

	if i >= 5 {
		return "just now"
	}

	// Use an array to replace switch cases.
	gap := []string{"year", "month", "day", "hour", "minute"}
	elapse := strconv.FormatInt(differ, 10) + " " + gap[i]
	if i > 1 {
		elapse += "s"
	}
	elapse += " ago"

	return elapse
}
