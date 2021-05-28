CREATE TABLE users (
    uid serial primary key,
    uname varchar(32) default 'Anonymous' not null,
    email varchar(32) not null unique,
    password varchar(256) not null,
    type integer default 0 not null,
    posts integer default 0 not null,
    marks integer default 0 not null,
    messages integer default 0 not null,
    ctime timestamp without time zone default(timezone('utc', now())) not null
);

CREATE TABLE post (
    pid serial primary key,
    uid integer not null,
    uname varchar(32) not null,
    content varchar(320),
    status integer default 1 not null,
    comments integer default 0 not null,
    hasAttachments integer default 0 not null,
    ctime timestamp without time zone default(timezone('utc', now())) not null
);

CREATE TABLE comment (
    cid serial primary key,    
    pid integer not null,
    uid integer not null,
    uname varchar(32) not null,
    content varchar(160) not null,
    ctime timestamp without time zone default(timezone('utc', now())) not null
);

CREATE TABLE mark (
    mid serial primary key,
    uid integer not null,
    pid integer not null,
    ctime timestamp without time zone default(timezone('utc', now())) not null
);

CREATE TABLE attachment (
	aid serial primary key,
	pid integer not null,
	url varchar(96) not null,
	thumbnail varchar(96) not null
);

CREATE TABLE login (
    lid serial primary key,
    uid integer not null,
    ip varchar(16) not null,
    device varchar(32) not null,
    ctime timestamp without time zone default(timezone('utc', now())) not null
)
