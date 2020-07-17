import React, {useState, useEffect} from 'react';
import {Post, Comment, PostsResponse, CommentsResponse, PostProps, Image} from '../lib/interfaces';
import Lightbox from './lightbox';
import {BaseUrl, request} from '../lib/utils';
import './postlist.css';

/**
 * TODO: comments, update state from child components..
 * TODO: when user clicks mark or delete a post in the list, it should reflect on the panel component.
 */
export default function PostList(props: any) {
    // control which post list to display.
    // 0 for default public posts, 1 for user's own posts, 2 for user's marks.
    const [op, setOp] = useState(props.op);     
    //TODO: wait for websocket implementation.
    const [newPost, setNewPost] = useState(0);  
    const [hasMore, setHasMore] = useState(true);
    const [posts, setPosts] = useState(new Array<Post>());
    const [minPid, setMinPid] = useState(-1);
    const [maxPid, setMaxPid] = useState(-1);

    // Used to monitor the parent component change.
    useEffect(() => {
        setOp(props.op);
    }, [props]);

    // Request for different posts when 'op' changes.
    // TODO: set different api urls.
    useEffect(() => {
        // Whenever 'op' is changed, the post list needs to be cleared before request.
        // But this approach has some flaw, since both setPost() and request() are async operations,
        // theoretically there are slight chances the request() finishes first which would cause a mistake.
        setPosts(new Array<Post>());

        let url: string;
        switch (op) {
            case 1:
                url = BaseUrl; break;
            case 2:
                url = BaseUrl; break;   
            default:
                url = BaseUrl + 'posts'; 
        }

        request(url, handleResponse, handleError);
    }, [op]);

    function handleResponse(res: globalThis.Response) {
        res.json().then(
            (result: PostsResponse) => {
                console.log('request in postlist');
                if (!result) return;

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
        request(BaseUrl + 'endposts', handleResponse, handleError);
    }

    function deletePost(pid: number) {  // TODO: ask user to confirm and send request to server.
        let newPostList = posts.filter(post => post.pid !== pid);
        setPosts(newPostList);
    }

    // LoadNewButton and LoadMoreButton only display in default option (op === 0).
    return (
        <div id="post_list">
            {op === 0 && newPost > 0 && <button id="btn_loadnew">Load {newPost} new posts</button>}
            {posts.map((p) => <div className='post' key={p.pid}><PostEntry value={p} onDelete={deletePost} /><hr/></div>)}   
            {op === 0 && hasMore && <button id="btn_loadmore" onClick={() => loadMore()}>Load More</button>}
        </div>
    );

}

//TODO: init lightbox images.
function PostEntry(props: PostProps) {
    const post = props.value;
    const [showComments, setShowComments] = useState(false);
    const [marked, setMarked] = useState(post.marked);
    const [images, setImages] = useState(new Array<Image>());   //TODO: needs to init.

    function toggleShowComments() {
        setShowComments(!showComments);
    }

    function toggleMarked() {
        setMarked(!marked);
    }

    function deleteCurrent() {
        props.onDelete(post.pid);
    }

    if (post === null || post === undefined)    return null;

    return (
        <>
            <div className="author">{post.uname} said:</div>
            <div className="content">{post.content}</div>
            <Lightbox value={images} />
            <div className="foot">
                <span>5 minutes ago</span>
                <span className="toolbar">
                    {post.owner? <a onClick={() => deleteCurrent()}>Delete</a>: null}
                    &nbsp;<a onClick={() => toggleShowComments()}>Comments({post.comments})</a>
                    &nbsp;<a onClick={() => toggleMarked()}>{marked? 'Marked': 'Mark'}</a>
                </span>
            </div>
            <CommentList value={post} show={showComments} onDelete={props.onDelete}/>
        </>
    );
}


function CommentList(props: PostProps) {
    const post = props.value;
    const show = props.show;
    const [comments, setComments] = useState(new Array<Comment>());
    const [hasMore, setHasMore] = useState(false);
    const [minCid, setMinCid] = useState(-1);
    
    useEffect(() => {
        console.log(show);
        if (!show || post.comments <= 0) return;
        request(BaseUrl + 'comments', handleResponse, handleError);
    }, [show]);

    if (!show || !post) return null;

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


//TODO: used to test Lightbox, needs to remove later.
function test(): Image[] {
    let i1: Image = {
        pid: 4,
        thumbnail: 'https://pbs.twimg.com/media/Ec8VfxDXYAM53Hj?format=jpg&name=900x900',
        url: 'https://pbs.twimg.com/media/Ec8VfxDXYAM53Hj?format=jpg&name=large'};
    let i2: Image = {
        pid: 4,
        thumbnail: 'https://pbs.twimg.com/media/Ec_uexnXkAAA_Cl?format=jpg&name=small',
        url: 'https://pbs.twimg.com/media/Ec_uexnXkAAA_Cl?format=jpg&name=medium'};
    
    return [i1, i2];
}