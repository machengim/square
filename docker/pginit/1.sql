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
