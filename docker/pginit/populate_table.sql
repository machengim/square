INSERT INTO users(uname, email, password) VALUES('Alice', 'alice@a.com', '123456');
INSERT INTO users(uname, email, password) VALUES('Bob', 'bob@b.com', '123456');
INSERT INTO users(uname, email, password) VALUES('Charlie', 'charlie@c.com', '123456');
INSERT INTO users(uname, email, password) VALUES('David', 'david@d.com', '123456');

INSERT INTO post(uid, uname, content) VALUES(1, 'Alice', 'Hello world');
INSERT INTO post(uid, uname, content) VALUES(2, 'Bob', 'Welcome!');
INSERT INTO post(uid, uname, content) VALUES(3, 'Charlie', 'Nice meeting u guys');
INSERT INTO post(uid, uname, content) VALUES(4, 'David', 'Great place');

INSERT INTO comment(uid, pid, uname, content) VALUES(2, 1, 'Bob', 'Hey you');
INSERT INTO comment(uid, pid, uname, content) VALUES(3, 1, 'Charlie', 'Hi');
INSERT INTO comment(uid, pid, uname, content) VALUES(2, 2, 'Bob', 'Hey you');
INSERT INTO comment(uid, pid, uname, content) VALUES(3, 2, 'Charlie', 'Hi');
INSERT INTO comment(uid, pid, uname, content) VALUES(2, 2, 'Bob', 'Hey you');
INSERT INTO comment(uid, pid, uname, content) VALUES(3, 3, 'Charlie', 'Hi');
INSERT INTO comment(uid, pid, uname, content) VALUES(2, 1, 'Bob', 'Hey you');
INSERT INTO comment(uid, pid, uname, content) VALUES(3, 4, 'Charlie', 'Hi');

INSERT INTO mark(uid, pid) VALUES(1, 4);
INSERT INTO mark(uid, pid) VALUES(2, 4);
INSERT INTO mark(uid, pid) VALUES(3, 4);
INSERT INTO mark(uid, pid) VALUES(4, 4);
