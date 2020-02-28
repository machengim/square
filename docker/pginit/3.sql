CREATE TABLE comment (
    id serial primary key,
    ts timestamp without time zone default(timezone('utc', now())) not null,
    uid integer not null,
    nickname varchar(16) not null,
    pid integer not null,
    content text not null
);
