insert into customer (email, password) values('a@b.c', '1');
insert into customer (email, password) values('a@b.d', '1');
insert into customer (email, password) values('a@b.e', '1');

insert into post (uid, content) values(1, 'Hello world');
insert into post (uid, content) values(2, 'Nice to meet you, guys!');
insert into post (uid, content) values(3, 'Good afternoon');
insert into post (uid, content) values(1, 'Fantastic job');

insert into comment (uid, pid, content) values(2, 1, 'Hi yo');
insert into comment (uid, pid, content) values(3, 1, 'Welcome to square!');
