// This interface is used for user info and its response.
// The reason why 'posts', 'marks' and 'messages' are put here is to
// avoid request when switching to another page.
export interface UserInfo {
    uid: number;
    uname: string;
    posts: number;
    marks: number;
    type: number;
    messages: number;
    email?: string;
    password?: string;
}

// Pass user info and its set methods to the children components.
export interface UserInfoForContext {
    user: UserInfo;
    setUser: Function;
}

export interface AppInfoForContext {
    updateUser: boolean;
    updatePosts: boolean;
    setUpdateUser: Function | null;
    setUpdatePosts: Function | null;
}

export interface Post {
    pid?: number;   // not required in request.
    uid?: number;   // hidden in response for user's privacy.
    uname: string;
    content: string;
    ctime: Date;
    comments: number;
    status: number;    // 0 means public, 1 means private, maybe more options later.
    marked?: boolean;   // whether it's marked by current user. Not required in request.
    owner?: boolean;    // whether it's owned by current user. Not required in request.
    attachments?: Array<Image>; 
}

// only one image allowed in request temporarily. Some inconsistency with the Post interface.
export interface PostRequest {
    uid: number;
    uname: string;
    content: string;
    ctime: Date;
    anonymous: boolean;
    status: number;
    image: string | null;
}

// Response from the API server.
export interface PostsResponse {
    hasMore: boolean;
    maxPid: number;
    minPid: number;
    posts: Array<Post>;
}

export interface PagedPostsResponse {
    currentPage: number;
    totalPage: number;
    posts: Array<Post>;
}

// Keep it for future use.
export interface Image {
    aid?: number;   // not required in request.
    pid?: number;   // not required in post.
    url?: string;    // not required in request.
    thumbnail?: string;     // not required in request.
    content?: string;       // not required in response.
}

// Keep it for future use.
export interface ImageList {
    value: Array<Image>;
}

export interface Comment {
    cid?: number;   // not required in request.
    pid: number;
    uid?: number; // hidden in response for user's privacy.
    uname: string;
    content: string;
    ctime: Date;
}

export interface CommentsResponse {
    //hasMore: boolean;
    //minCid: number;
    comments: Array<Comment>;
}

export interface PostProps {
    value: Post;
    onDelete: Function; // function to delete current post.
    onReport: Function;
    show?: boolean;     // whether the comments are shown.
}

export interface CommentProps {
    value: Post;
    onComment: Function; // function to delete current post.
    show: boolean;     // whether the comments are shown.
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

export interface PageInfo {
    uid: number;
    current: number;
    total: number;
    op: number;
    setDestUrl: Function;
}

export interface PageInfoProps{
    value: PageInfo;
}