use std::env;
use std::collections::HashMap;
use sqlx::postgres::PgPoolOptions;
use redis::Commands;
use chrono::{Utc, Duration};

#[derive(sqlx::FromRow)]
struct Record {
    pid: i32,
}

#[async_std::main]
async fn main(){
    let stage = "dev";

    dotenv::from_filename(format!("{}{}", ".env_", &stage)).ok();

    let db_url = env::var("DB_URL")
                    .expect("Database URL not found in env!");
    let redis_url = env::var("REDIS_URL")
                    .expect("Redis URL not found in env!");

    for day in vec![1, 7, 30]{
        let trending_post = read_db(&db_url, day).await
            .expect("Operation error.");

        save_redis(&trending_post, &redis_url, day)
            .expect("Failed saving pids into redis.");

        println!("Finished trending in {} days", day);
    }
}

async fn read_db(url: &str, days: i32) -> Result<Vec<i32>, sqlx::Error> {
    let pool = PgPoolOptions::new()
                .max_connections(5)
                .connect(url).await?;

    let mut comments: Vec<Record> = read_recent_comments(&pool, "comment", days).await?;
    let mut marks: Vec<Record> = read_recent_comments(&pool, "mark", days).await?;
    comments.append(&mut marks);

    let mut map = HashMap::new();
    for comment in comments {
        let count = map.entry(comment.pid)
                        .or_insert(0);
        *count += 1;
    }

    let mut counter: Vec<_> = map.iter().collect();
    counter.sort_by(|a, b| a.1.cmp(b.1).reverse());

    let trending_posts = collect_trending(&counter, &pool).await;

    Ok(trending_posts)
}

async fn read_recent_comments(pool: &sqlx::Pool<sqlx::Postgres>, table: &str, days: i32) -> Result<Vec<Record>, sqlx::Error> {
    let days = days as i64;
    let threshold = Utc::now() - Duration::days(days);
    let sql = format!("SELECT * FROM {} WHERE ctime > $1", table);
    let rows: Vec<Record> = sqlx::query_as(&sql)
                        .bind(&threshold).fetch_all(pool).await?; 

    Ok(rows)
}

async fn collect_trending(counter: &Vec<(&i32, &i32)>, pool: &sqlx::Pool<sqlx::Postgres>) -> Vec<i32> {
    let mut trending_posts = Vec::new();
    for (k, _) in counter {
        let checked: bool = check_post_status(k, pool).await
                                .expect("Cannot check post status");
        if checked {
            trending_posts.push(**k);
        }
    }

    trending_posts
}

async fn check_post_status(pid: &&i32, pool: &sqlx::Pool<sqlx::Postgres>) -> Result<bool, sqlx::Error> {
    let sql = format!("SELECT status FROM post WHERE pid=$1");
    let row: (i32, ) = sqlx::query_as(&sql)
                        .bind(pid)
                        .fetch_one(pool).await?;

    Ok(row.0 > 0)
}

fn save_redis(pids: &Vec<i32>, url: &str, day: i32) -> redis::RedisResult<()> {
    let client = redis::Client::open(url)?;
    let mut conn = client.get_connection()?;
    let mut key = String::from("trending_");

    match day {
        1 => key.push_str("day"),
        7 => key.push_str("week"),
        30 => key.push_str("month"),
        _ => panic!("Unrecognized period."),
    }
    
    conn.del(&key)?;
    for pid in pids {
        conn.rpush(&key, *pid)?;
    }

    Ok(())
}