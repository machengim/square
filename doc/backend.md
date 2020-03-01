Backend Interface
===

    app.go
     |- apis
         |- posts.go
         |- user.go
         |- comments.go
         |- marks.go
         |- login.go
         |- register.go
     |- lib
         |- db.go
         |- utils.go
     |- models
         |- user.go
         |- post.go
         |- comment.go
         |- mark.go


app.go
---

| Function | Return | Description |
|----|----|----| 
|init() | None | Revoke InitSystem() function in lib/utils.go to initialize system configurations. |
| main() | None | Run server, set up CORS and router policies.|
| shutdownHandler() | None | Clean up when receiving shutdown signal from user.|

apis/comment.go
---

| Function | Return | Description |
|----|----|----| 
| GetComments(*gin.Context) | None | Handle the get request for "/comments". |
| PostComments(*gin.Context) | None | Handle the post request for "/comments". |


apis/posts.go
---

>Struct: `PostList`
>
>Fields: Min, Max, HasNew, HasMore, Posts.
>
>Description: response body to the GetPost request.

| Function | Return | Description |
|----|----|----| 
| GetPublicPosts(*gin.Context) | None | Handle requests like "/posts?min=4". Only public posts will be returned. |
| GetPrivatePosts(*gin.Context) | None | Handle requests like "/posts/user/2?min=4". Only this user's posts will be returned. |
| PostPosts(*gin.Context) | None | Handle request of sending a new post. |

apis/user.go
---

| Function | Return | Description |
|----|----|----| 
| GetUserSummary(*gin.Context) | None | Handle requests like "/user/3" and return the user's summary. |



lib/db.go
---

| Function | Return | Description |
|----|----|----| 
|OpenDb(Config)| (*sql.DB, error) |Open the database and return the connection.|
|CloseDb(Config)| (bool, error) |Close the database.|
| CreateEntry(*sql.DB, string, []string, []interface{})| (bool, error) | Insert a new entry into Db. Need to specify the table name, column names and values.|
|DeleteEntryById(*sql.DB, int, string)| (bool, error) |Delete an entry by its id. Need to specify table name and id.|
|QuerySingle(*sql.DB, string, []string, []interface{}) |(*sql.Row, error) | Read an entry by condition. Need to specify table name, condition columns and corresponding values.|
|QueryMultiple(*sql.DB, string, []string, []interface{}) |(*sql.Rows, error) | Read entries by condition. Need to specify table name, condition columns and corresponding values.|
|UpdateEntryById(*sql.DB, string, int, []string, []interface{})| (bool, error) | Update an entry by id. Need to specify table name, id, columns to change and their new values.|

lib/utils
---

>Struct: `Config`
>
>Fields: Host, Port, User, Password, Dbname, Limit.
>
>Description: configuration of the system. Should be kept safe.

| Function | Return | Description |
|----|----|----| 
|InitSystem() | None | Initialize the system, and save the configurations in global variables. |
|Reflect(interface{}, int)| []interface{} | Use reflect to retrieve the fields or values of a struct. Need to specify the struct name and an option value.|

models/comment.go
---

>Struct: `Comment`
>
>Fields: Id, Ts, Uid, Nickname, Pid, Content.
>
>Description: common use.

| Function | Return | Description |
|----|----|----| 
| Comment Create(*sql.DB) | (bool, error) | Insert a new comment into db. Revoke CreateEntry() function in lib/db.go. |
| RetrieveCommentsByPid(*sql.DB, int) | ([]Comment, error) | Read a Comment array from db by post id. Revoke QueryMultiple() function of lib/db.go.|

models/post.go
---

>Struct: `Post`
>
>Fields: Id, Ts, Uid, Nickname, IsPrivate, Comments, Content, HasNewComments.
>
>Description: common use.

| Function | Return | Description |
|----|----|----| 
| Post Create(*sql.DB) | (bool, error) | Insert a new post into db. Revoke CreateEntry() function in lib/db.go. |
| RetrievePublicPosts(int, int, int) | ([]Post, error) | Read array of public posts from db by id. Revoke QueryMultiple() function of lib/db.go.|
| RetrievePrivatePosts(int, int, int) | ([]Post, error) | Read array of private posts from db by id. Revoke QueryMultiple() function of lib/db.go.|
| Post IncrementCommentsById() | (bool, error) | Increment comments number by 1 when user sends a comment to the post. Revoke UpdateEntryById() function of lib/db.go.|

models/user.go
---

>Struct: `User`
>
>Fields: Id, Password, Email, Nickname, Posts, Marks, Messages, Comments.
>
>Description: common use.

| Function | Return | Description |
|----|----|----| 
| User Create(*sql.DB) | (bool, error) | Insert a new user into db. Revoke CreateEntry() function in lib/db.go. |
| RetrieveUserById(*sql.DB, int) | (User, error) | Read a user from db by id. Revoke QuerySingle() function of lib/db.go.|
| RetrieveUserByLogin(*sql.DB, int) | (User, error) | Read a user from db by email and password. Revoke QuerySingle() function of lib/db.go.|
| DeleteById(*sql.DB, int) | (bool, error) | Delete a user by id. Revoke DeleteEntryById() function of lib/db.go.| 
| User UpdateById(*sql.DB) | (bool, error) | Update a user by id. Columns id, email and password will not be changed by it. Revoke UpdateEntryById() function in lib/db.go.|
| User UpdatePassword(*sql.DB) | (bool, error) | Update user's password. Nickname may be changed together. Revoke UpdateEntryById() function in lib/db.go.|