// This interface is used for user info and its response.
// The reason why 'posts', 'marks' and 'messages' are put here is to
// avoid request when switching to another page.
export interface UserInfo {
    uid: number;
    uname: string;
    posts: number;
    marks: number;
    messages: number;
    email?: string;
    password?: string;
}

// Pass user info and its set methods to the children components.
export interface UserInfoForContext {
    user: UserInfo
    setUser: Function;
}

export interface Post {
    pid?: number;   // not required in request.
    uid?: number;   // hidden in response for user's privacy.
    uname: string;
    content: string;
    ctime: string;
    comments: number;
    isPrivate: number;    // 0 means public, 1 means private, maybe more options later.
    marked?: boolean;   // whether it's marked by current user. Not required in request.
    owner?: boolean;    // whether it's owned by current user. Not required in request.
    attachments?: ImageList;    // not required in request.
}

// Response from the API server.
export interface PostsResponse {
    hasMore: boolean;
    maxPid: number;
    minPid: number;
    posts: Array<Post>;
}

// This interface needs more consideration.
export interface Image {
    aid?: number;   // not required in request.
    pid: number;
    url?: string;    // not required in request.
    thumbnail?: string;     // not required in request.
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

// used to wrap the option that represents which page to display.
export interface PageOptionProps {
    op: number;
}

// used to pass props to alert box.
export interface AlertBoxProps {
    text: string;
    onConfirm: Function;
    onClose: Function;
}
