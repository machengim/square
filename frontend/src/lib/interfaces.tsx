export interface Post {
    pid: number;
    uid?: number;   // not required in response for user's privacy.
    uname: string;
    content: string;
    ctime: string;
    comments: number;
    marked?: boolean;   // not required in request.
    showComments?: boolean;     //not required in response.
}

// Response from the API server.
export interface Response {
    hasMore: boolean;
    maxPid: number;
    minPid: number;
    posts: Array<Post>;
}

export interface PostProps {
    value: Post;
}

export interface NumberProps {
    value: number;
}

export interface BooleanProps {
    value: boolean;
}