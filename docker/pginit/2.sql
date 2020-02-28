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
