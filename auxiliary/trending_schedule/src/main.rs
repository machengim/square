use sqlx::postgres::PgPoolOptions;
use chrono::NaiveDateTime;
extern crate redis;
use redis::Commands;
use std::env;
use dotenv::dotenv;

#[derive(sqlx::FromRow)]
struct Post{
    pid: i32,
    uid: i32,
    uname: String,
    content: String,
    status: i32,
    comments: i32,
    hasattachments: i32,
    ctime: NaiveDateTime,
}

#[async_std::main] // or #[tokio::main]
async fn main() -> Result<(), sqlx::Error> {
    dotenv().ok();
    println!("Check env.");

    let url = &env::var("DB_URL").unwrap();

    // Create a connection pool
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(url).await?;

    // Make a simple query to return the given parameter
    let row: Post = sqlx::query_as("SELECT * FROM post WHERE status = $1")
        .bind(1).fetch_one(&pool).await?;

    //println!("{}: {}", row.0, row.1);
    println!("{} at {}", row.content, row.ctime);
    try_redis().unwrap_or_else(|e|{
        panic!("Get error in redis: {:?}", e);
    });

    Ok(())
}

fn try_redis() -> redis::RedisResult<()> {
    let client = redis::Client::open("redis://:qwer1234@127.0.0.1/")?;
    let mut conn = client.get_connection()?;
    let _ : () = conn.set("my_key", 42)?;
    let result: i32 = conn.get("my_key")?;

    println!("{}", result);
    
    Ok(())
}