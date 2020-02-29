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
     |- db
        |- db.go
     |- lib
        |- utils.go
     |- models
           |- common.go
           |- user.go
           |- post.go
           |- comment.go
           |- mark.go


app.go
---

| Function | Return | Description |
|----|----|----| 
|init() | None | Initilization, including launching logger, reading config file and start database connection. |
| main() | None | Run server, set up CORS and router policies.|
| shutdownHandler() | None | Clean up when receiving shutdown signal from user.|

apis/
---


db/db.go
---

TODO: QueryMultiple()

| Function | Return | Description |
|----|----|----| 
|OpenDb(Config)| (*sql.DB, error) |Open the database and return the connection.|
|CloseDb(Config)| (bool, error) |Close the database.|
| CreateEntry(*sql.DB, string, []string, []interface{})| (bool, error) | Insert a new entry into Db. Need to specify the table name, column names and values.|
|DeleteEntryById(*sql.DB, int, string)| (bool, error) |Delete an entry by its id. Need to specify table name and id.|
|QuerySingle(*sql.DB, string, []string, []interface{}) |(*sql.Row, error) | Read an entry by condition. Need to specify table name, condition columns and corresponding values.|
|UpdateEntryById(*sql.DB, string, int, []string, []interface{})| (bool, error) | Update an entry by id. Need to specify table name, id, columns to change and their new values.|

models/common.go
---

| Function | Return | Description |
|----|----|----| 
|Reflect(interface{}, int)| []interface{} | Use reflect to retrieve the fields or values of a struct. Need to specify the struct name and an option value.|

models/user.go
---

>Struct: `User`
>
>Fields: Id, Password, Email, Nickname, Posts, Marks, Messages, Comments.
>
>Description: common use.

| Function | Return | Description |
|----|----|----| 
| User Create(*sql.DB) | (bool, error) | Insert a new user into db. Revoke CreateEntry() function in db/db.go. |
| RetrieveUserById(*sql.DB, int) | (User, error) | Read a user from db by id. Revoke QuerySingle() function of db/db.go.|
| RetrieveUserByLogin(*sql.DB, int) | (User, error) | Read a user from db by email and password. Revoke QuerySingle() function of db/db.go.|
| DeleteById(*sql.DB, int) | (bool, error) | Delete a user by id. Revoke DeleteEntryById() function of db/db.go.| 
| User UpdateById(*sql.DB) | (bool, error) | Update a user by id. Columns id, email and password will not be changed by it. Revoke UpdateEntryById() function in db/db.go.|
| User UpdatePassword(*sql.DB) | (bool, error) | Update user's password. Nickname may be changed together. Revoke UpdateEntryById() function in db/db.go.|