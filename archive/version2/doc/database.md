Database Design
===

Table customer
---

|Column | Type | Constraints|  Description |
| ---- | ---- | ---- | ---- |
| id | serial | primary key | ID Starts from 1. |
| email | varchar(24) | not null | Email must be unique. |
| password | varchar(16) | not null | Password needs to be hashed. Other Constraints may apply.|
| nickname | varchar(16) | not null | Default 'Anonymous'. |
| posts | integer | not null | Total number of posts, default 0. |
| marks | integer | not null | Total number of marked posts, default 0. |
| comments | integer | not null | Total number of unread comments, default 0. |


**SQL schema:**

    CREATE TABLE customer (
        id serial primary key,
        email varchar(24) not null,
        password varchar(16) not null,
        nickname varchar(16) default 'Anonymous',
        posts integer not null default 0,
        marks integer not null default 0,
        messages integer not null default 0,
        comments integer not null default 0
    );

Table post
---
|Column | Type | Constraints|  Description |
| ---- | ---- | ---- | ---- |
| id | serial | primary key | ID Starts from 1. |
| ts | timestamp | not null | Default current time in UTC. |
| uid | integer | not null | ID of the author. |
| nickname | varchar(16) | not null | Nickname of the author. |
| isPrivate | boolean | not null | Default FALSE. |
| comments | integer | not null | Number of commens of this post. Default 0. |
| content | text | not null | Content of the post. |
| hasNewComments | boolean | not null | If it has unread commens for the author. |


**SQL schema:**

    CREATE TABLE post (
        id serial primary key,
        ts timestamp without time zone default(timezone('utc', now())) not null,
        uid integer not null,
        nickname varchar(16) not null,
        isPrivate boolean default false not null,
        comments integer default 0 not null,
        content text not null,
        hasNewComments boolean default false not null
    );

Table comment
---

Note that the timestamp value of a comment is not used in current system.

|Column | Type | Constraints|  Description |
| ---- | ---- | ---- | ---- |
| id | serial | primary key | ID starts from 1. |
| ts | timestamp | not null | Default current time in UTC. |
| uid | integer | not null | ID of the commenter. |
| nickname | varchar(16) | not null | Nickname of the commenter. |
| pid | integer | not null | The post which this comment belongs to. |
| content | text | not null | Content of the comment. |

**SQL schema:**

    CREATE TABLE comment (
        id serial primary key,
        ts timestamp without time zone default(timezone('utc', now())) not null,
        uid integer not null,
        nickname varchar(16) not null,
        pid integer not null,
        content text not null
    );

Table mark
---

|Column | Type | Constraints|  Description |
| ---- | ---- | ---- | ---- |
| id | serial | primary key | ID starts from 1. |
| pid | integer | not null | The id of the post being marked. |
| uid | integer | not null | The id of the marker. |

**SQL schema:**

    CREATE TABLE mark (
        id serial primary key,
        uid integer not null,
        pid integer not null
    );