package main

import (
	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
	"strconv"
)

type PostList struct {
	Min		int 	`json:"min"`
	Max		int 	`json:"max"`
	HasMore	bool	`json:"hasMore"`
	HasNew	bool	`json:"hasNew"`
	Posts	[]Post	`json:"posts"`
}

// Handle /posts, /posts?min={pid}, /posts?max={pid}
func GetPublicPosts(c *gin.Context) {
	op, offset := getOpAndOffset(c)
	posts, _ := RetrievePublicPosts(op, offset, conf.Limit)
	list := PostList {posts[len(posts) - 1].Id, posts[0].Id,
		true, false, posts}
	// This method to check hasMore is really primitive. Need refinement later.
	if len(posts) < conf.Limit {
		list.HasMore = false
	}

	c.JSON(200, list)
}

// Handle /posts/user/:uid, or with ?min/max option.
func GetPrivatePosts(c *gin.Context)  {
	uid := GetUidFromParam(c)
	op, offset := getOpAndOffset(c)
	posts, err := RetrievePrivatePosts(conn, op, offset, conf.Limit, uid)
	if err != nil {
		c.Abort()
	}
	list := PostList{
		Min:     0,
		Max:     0,
		HasMore: true,
		HasNew:  false,
		Posts:   posts,
	}

	if len(posts) > 0 {
		list.Min = posts[len(posts) - 1].Id
		list.Max = posts[0].Id
	}

	c.JSON(200, list)
}

func PostPosts(c *gin.Context) {
	var p Post
	c.BindJSON(&p)
	if p.Uid <= 0 {
		log.Error("Cannot get user id of post.")
		c.Abort()
		return
	}
	if p.Content == "" {
		log.Error("No content in the post.")
		c.Abort()
		return
	}
	if p.Nickname == "" {
		p.Nickname = "Anonymous"
	}
	p.Create(conn)
}

func getOpAndOffset(c *gin.Context) (op int, offset int) {
	op, offset = 0, 0
	result := c.Query("min")
	if result != "" {
		op = -1
		offset, _ = strconv.Atoi(result)
	} else if result = c.Query("max"); result != "" {
		op = 1
		offset, _ = strconv.Atoi(result)
	}
	if offset < 0 {
		offset = 0
	}

	log.Debug("option is ", op, " and offset is ", offset)
	return
}

// TODO: need another function to retrieve unread comments in here and post.go