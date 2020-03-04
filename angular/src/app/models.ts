export interface Post {
    id: number,
    ts: string,
    uid: number,
    nickname: string,
    isPrivate: boolean,
    comments: number,
    content: string,
    hasNewComments: boolean
}

export interface Comment {
    id: number,
	ts: string,
	uid: number,
	nickname: string,
	pid: number,
	content: string,
}

export interface Draft {
    uid: number,
    nickname: string,
    content: string,
    isAnonymous: boolean,
    isPrivate: boolean,
}

export interface PostList {
    min: number,
    max: number,
    hasNew: boolean,
    hasMore: boolean,
    posts: Post[]
}

export interface PagedList {
    total: number,
    posts: Post[]
}

export interface User {
    id: number;
    email: string;
    password: string;
    nickname: string;
    posts: number;
    marks: number;
    messages: number;
    comments: number;
}

