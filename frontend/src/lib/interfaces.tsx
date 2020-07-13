export interface Post {
    pid?: number;   // not required in request.
    uid?: number;   // not required in response for user's privacy.
    uname: string;
    content: string;
    ctime: string;
    comments: number;
    marked?: boolean;   // not required in request.
}

export interface Comment {
    cid?: number;   // not required in request.
    pid: number;
    uid?: number; // not required in response for user's privacy.
    uname: string;
    content: string;
    ctime: string;
}

// Response from the API server.
export interface PostsResponse {
    hasMore: boolean;
    maxPid: number;
    minPid: number;
    posts: Array<Post>;
}

export interface CommentsResponse {
    hasMore: boolean;
    minCid: number;
    comments: Array<Comment>;
}

export interface PostProps {
    value: Post;
    show?: boolean;
}