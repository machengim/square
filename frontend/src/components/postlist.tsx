import React, {useState, useEffect} from 'react';
import {Post, Comment, PostsResponse, CommentsResponse, PostProps} from '../lib/interfaces';
import {request} from '../lib/utils';
import './postlist.css';

/**
 * TODO: comments, update state from child components..
 */
export default function PostList() {
    const apiUrl = 'https://5f0bdaca9d1e150016b377f6.mockapi.io/api/posts';
    const [newPost, setNewPost] = useState(0);  //wait for websocket implementation.
    const [hasMore, setHasMore] = useState(true);
    const [posts, setPosts] = useState(new Array<Post>());
    const [minPid, setMinPid] = useState(-1);
    const [maxPid, setMaxPid] = useState(-1);
    useState(() => request(apiUrl, handleResponse, handleError));    // used to init data.

    function handleResponse(res: globalThis.Response) {
        res.json().then(
            (result: PostsResponse) => {
                console.log('request in postlist');
                if (result === null) return;

                setPosts(posts.concat(result.posts.slice()));
                setHasMore(result.hasMore);
                if (result.maxPid > maxPid) setMaxPid(result.maxPid);
                if (minPid > result.minPid || minPid <= 0) setMinPid(result.minPid);
            }
        )
    }

    function handleError(res: globalThis.Response) {
        console.log(res);
    }

    function loadMore() {
        const apiUrl2 = 'https://5f0bdaca9d1e150016b377f6.mockapi.io/api/endposts';
        request(apiUrl2, handleResponse, handleError);
    }

    useEffect(() => {
        console.log('min pid is ' + minPid);
    }, [minPid]);

    return (
        <div id="post_list">
            <LoadNewButton />
            {posts.map((p) => <div className='post' key={p.pid}><PostEntry value={p} /><hr/></div>)}   
            <LoadMoreButton />
        </div>
    );

    function LoadNewButton() {
        if (newPost <= 0) return null;
    
        return (
            <button id="btn_loadnew">Load {newPost} new posts</button>
        )
    }

    function LoadMoreButton() {
        if (!hasMore) return null;
    
        return (
            <button id="btn_loadmore" onClick={() => loadMore()}>Load More</button>
        )
    }

}

function PostEntry(props: PostProps) {
    const post = props.value;
    const [showComments, setShowComments] = useState(false);
    const [marked, setMarked] = useState(post.marked);

    function switchShowComments() {
        setShowComments(!showComments);
    }

    function switchMark() {
        setMarked(!marked);
    }

    if (post === null || post === undefined)    return null;

    return (
        <>
            <div className="author">{post.uname} said:</div>
            <div className="content">{post.content}</div>
            <div className="foot">
                <span>5 minutes ago</span>
                <span className="toolbar">
                    <a onClick={() => switchShowComments()}>Comments({post.comments})</a>
                    &nbsp;<a onClick={() => switchMark()}>{marked? 'Marked': 'Mark'}</a></span>
            </div>
            <CommentList value={post} show={showComments}/>
        </>
    );
}

function CommentList(props: PostProps) {
    const post = props.value;
    const show = props.show;

    const commentUrl = 'https://5f0bdaca9d1e150016b377f6.mockapi.io/api/comments';
    const [comments, setComments] = useState(new Array<Comment>());
    const [hasMore, setHasMore] = useState(false);
    const [minCid, setMinCid] = useState(-1);
    
    useEffect(() => {
        console.log(show);
        if (!show || post.comments <= 0) return;
        request(commentUrl, handleResponse, handleError);
    }, [show]);

    if (!show || !post || post.comments === 0) return null;

    function handleResponse(res: globalThis.Response) {
        res.json().then(
            (result: CommentsResponse) => {
                if (result === null) return;

                console.log('request in comments');
                setComments(result.comments.slice());
                setHasMore(result.hasMore);
                if (minCid > result.minCid || minCid <= 0) setMinCid(result.minCid);
            }
        )
    }

    function handleError(res: globalThis.Response) {
        console.log(res);
    }

    return (
        <div className='comment'>
            {comments.map((c) => <p key={c.cid}>{c.content} --by {c.uname}</p>)}
            <textarea name="comment"></textarea>
            <button>Send</button>
        </div>
    )
}