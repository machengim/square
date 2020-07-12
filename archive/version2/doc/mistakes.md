Delete post function should give post record a mark instead of removing it from the database, since other users may have marked this post.

Should use transaction when inserting or deleting posts and comments.

Keep an eye on unused docker containers. They are not listed by `docker container ls` command and may cause some mysterious problems.

The function `onloadend()` of FileReader is asyncronous, so the result of it should be consumed in the callback function of it.

Some ORM tools may be helpful, like `sqlx`, to organizing the code.