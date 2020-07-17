export interface UserForContext {
    uid: number;
    uname: string;
    setUid: Function;
    setUname: Function;
}

export interface Post {
    pid?: number;   // not required in request.
    uid?: number;   // hidden in response for user's privacy.
    uname: string;
    content: string;
    ctime: string;
    comments: number;
    marked?: boolean;   // whether it's marked by current user. Not required in request.
    owner?: boolean;    // whether it's owned by current user. Not required in request.
    attachments?: number;    // not required in request
}

// This interface needs more consideration.
export interface Image {
    aid?: number;   // not required in request
    pid: number;
    url?: string;    // not required in request
    thumbnail?: string;     // not required in request
}

export interface ImageList {
    value: Array<Image>;
}

export interface Comment {
    cid?: number;   // not required in request.
    pid: number;
    uid?: number; // hidden in response for user's privacy.
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
    onDelete: Function; // function to delete current post.
    show?: boolean;     // whether the comments are shown.
}

export interface UserSummary {
    posts: number;
    marks: number;
    messages: number;
}