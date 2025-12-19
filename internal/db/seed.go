package db

import (
	"context"
	"database/sql"
	"fmt"
	"log"

	"math/rand"

	"github.com/OlesNikon/social/internal/store"
)

var usernames = []string{
	"alice", "bob", "charlie", "dave", "eve",
	"frank", "grace", "heidi", "ivan", "judy",
	"mallory", "niaj", "oscar", "peggy", "quinn",
	"rupert", "sybil", "trent", "ursula", "victor",
	"wendy", "xander", "yvonne", "zach", "olivia",
	"liam", "sophia", "noah", "isabella", "mason",
	"mia", "logan", "charlotte", "lucas", "amelia",
}

var titles = []string{
	"Exploring the Go Programming Language", "Understanding Concurrency in Go",
	"Building Web Applications with Go", "An Introduction to Go Modules",
	"Error Handling Best Practices in Go", "Working with Databases in Go",
	"Testing in Go: A Comprehensive Guide", "Go Routines and Channels Explained",
	"Building RESTful APIs with Go", "Go Standard Library: A Deep Dive",
	"Effective Go: Writing Clean Code", "Go for DevOps: Automation and Scripting",
	"Microservices Architecture with Go", "Performance Optimization in Go",
	"Go and Cloud Computing", "Security Best Practices in Go",
}

var contents = []string{
	"Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
	"Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
	"Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
	"Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
	"Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
	"Curabitur pretium tincidunt lacus. Nulla gravida orci a odio.",
	"Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris.",
	"Integer in mauris eu nibh euismod gravida.",
	"Duis ac tellus et risus vulputate vehicula.",
	"Donec lobortis risus a elit. Etiam tempor.",
	"Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt sapien risus a quam.",
	"Maecenas fermentum consequat mi. Donec fermentum.",
	"Pellentesque malesuada nulla a mi. Duis sapien sem, aliquet nec, commodo eget, consequat quis, neque.",
	"Aliquam faucibus, elit ut dictum aliquet, felis nisl adipiscing sapien, sed malesuada diam lacus eget erat.",
}

var tags = []string{
	"golang", "programming", "webdev", "database", "concurrency",
	"api", "testing", "performance", "cloud", "security",
	"microservices", "devops", "automation", "clean code", "error handling",
}

var comments = []string{
	"Great post! Very informative.",
	"I learned a lot from this article.",
	"Thanks for sharing your insights.",
	"This was really helpful, looking forward to more content like this.",
	"Can you provide more examples on this topic?",
	"I disagree with some points made here.",
	"Well written and easy to understand.",
	"Could you elaborate on the concurrency section?",
	"This is exactly what I was looking for, thanks!",
	"Interesting perspective, I hadn't considered that before.",
}

func Seed(store store.Storage, db *sql.DB) {
	ctx := context.Background()

	users := generateUsers(100)
	tx, _ := db.BeginTx(ctx, nil)

	for _, user := range users {
		if err := store.Users.Create(ctx, tx, user); err != nil {
			_ = tx.Rollback()
			log.Println("Error creating user:", err)
			return
		}
	}

	tx.Commit()

	posts := generatePosts(200, users)
	for _, p := range posts {
		if err := store.Posts.Create(ctx, p); err != nil {
			log.Println("Error creating post:", err)
			return
		}
	}

	comments := generateComments(500, users, posts)
	for _, c := range comments {
		if err := store.Comments.Create(ctx, c); err != nil {
			log.Println("Error creating comment:", err)
			return
		}
	}

	log.Println("Database seeding completed successfully.")
}

func generateUsers(num int) []*store.User {
	users := make([]*store.User, num)

	for i := 0; i < num; i++ {
		users[i] = &store.User{
			Username: usernames[i%len(usernames)] + fmt.Sprintf("%d", i),
			Email:    usernames[i%len(usernames)] + fmt.Sprintf("%d", i) + "@example.com",
		}
	}
	return users
}

func generatePosts(num int, users []*store.User) []*store.Post {
	posts := make([]*store.Post, num)
	for i := 0; i < num; i++ {
		user := users[rand.Intn(len(users))]

		posts[i] = &store.Post{
			UserID:  user.ID,
			Title:   titles[rand.Intn(len(titles))],
			Content: contents[rand.Intn(len(contents))],
			Tags: []string{
				tags[rand.Intn(len(tags))],
				tags[rand.Intn(len(tags))],
			},
		}
	}
	return posts
}

func generateComments(num int, users []*store.User, posts []*store.Post) []*store.Comment {
	commentsList := make([]*store.Comment, num)
	for i := 0; i < num; i++ {
		user := users[rand.Intn(len(users))]
		post := posts[rand.Intn(len(posts))]

		commentsList[i] = &store.Comment{
			PostID:  post.ID,
			UserID:  user.ID,
			Content: comments[rand.Intn(len(comments))],
		}
	}
	return commentsList
}
