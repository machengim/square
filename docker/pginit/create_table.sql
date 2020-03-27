CREATE TABLE customer (
    id serial primary key,
    email varchar(30) not null,
    password varchar(64) not null,
    nickname varchar(16) default 'Anonymous',
    posts integer not null default 0,
    marks integer not null default 0,
    messages integer not null default 0,
    comments integer not null default 0
);

CREATE TABLE post (
    id serial primary key,
    ts timestamp without time zone default(timezone('utc', now())) not null,
    uid integer not null,
    nickname varchar(16) default 'Anonymous' not null,
    isPrivate boolean default false not null,
    comments integer default 0 not null,
    content varchar(300) not null,
    hasNewComments boolean default false not null
);

CREATE TABLE comment (
    id serial primary key,
    ts timestamp without time zone default(timezone('utc', now())) not null,
    uid integer not null,
    nickname varchar(16) default 'Anonymous' not null,
    pid integer not null,
    content varchar(100) not null
);

CREATE TABLE mark (
    id serial primary key,
    uid integer not null,
    pid integer not null
);
