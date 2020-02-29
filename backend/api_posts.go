package main

import (
	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
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
		Min:     posts[len(posts) - 1].Id,
		Max:     posts[0].Id,
		HasMore: true,
		HasNew:  false,
		Posts:   posts,
	}

	c.JSON(200, list)
}

func PostPosts(c *gin.Context) {
	var p Post
	c.BindJSON(&p)
	if p.Uid <= 0 {
		log.Error("Cannot get user id of post.")
		c.Abort()
	}
	if p.Content == "" {
		log.Error("No content in the post.")
		c.Abort()
	}
	if p.Nickname == "" {
		p.Nickname = "Anonymous"
	}
	p.Create(conn)
}

func getOpAndOffset(c *gin.Context) (int, int) {
	op, offset := 0, 0
	result, exist := c.Get("min")
	if exist {
		op = -1
		offset = result.(int)
	} else if result, exist = c.Get("max"); exist {
		op = 1
		offset = result.(int)
	}

	return op, offset
}

// TODO: need another function to retrieve unread comments in here and post.go