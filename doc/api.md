API Rules
===

Use `withCredential` with requests, so jwt token can be sent with all methods for authentication. 

 Admin, message and search functionalities are waiting in the roadmap.

GET method
---
| Address | Argument | Description | Token | Return |
| ----  | ---- | ----| ---- | ---- |
| /user | ?email={email} | Check if the email existed in the system | No | bool |
| /user | /{user_id} | Get user info | Yes |  User info except password|
| /posts | None | Retrieve public posts from all users order by time | Yes | multiple posts |
| /posts | ?min={post_id} | Retrieve public posts with id smaller than {post_id} | Yes | multiple posts |
| /posts | ?max={post_id} | Retrieve public posts with id greater than {post_id} | Yes | multiple posts |
| /comments | ?pid={post_id} | Retrieve all comments of the post | Yes | multiple comments |
| /posts/user| /{user_id} | Retrive all posts of the user | Yes | multiple posts|
| /posts/user| /{user_id}?newcomment=1 | Retrieve posts of the user with unread comments | Yes | multiple posts |
| /marks/user | /{user_id} | Retrieve posts marked by the user | Yes | multiple posts |
 

POST method
---

| Address | Json format  | Description | Token | Return |
| ----  | ---- | ----| ---- | ---- |
| /login | "email", "password" | User logins | No | Jwt token if success | 
| /register | "email", "password", "nickname" |  User registers | No | bool |
| /posts | "content", "isAnonymous", "isPrivate" | User sends a post | Yes | Referesh post list after success |
| /comments | "pid", "content"| User sends a comment | Yes | Refresh comment list after success |

PUT method
---

| Address | Argument | Json format  | Description | Token | Return |
| ----  | ---- | ----| ---- | ----| ---- |
| /user | /{user_id} | "nickname", "password"| User updates info | Yes | bool |