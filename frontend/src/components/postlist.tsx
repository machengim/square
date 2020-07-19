import React, {useState, useEffect, useRef} from 'react';
import {Post, Comment, PostsResponse, CommentsResponse, PostProps, PageOptionProps, Image} from '../lib/interfaces';
import Lightbox from './lightbox';
import {BaseUrl, request} from '../lib/utils';
import './postlist.css';

/**
 * TODO: comments, update state from child components..
 * TODO: when user clicks mark or delete a post in the list, it should reflect on the panel component.
 * TODO: display different elements according to the 'op' value passed from 'home.tsx'.
 * The full work flow looks as below:
 *  User clicks a page -> props changes -> reset() except firstRun -> op change triggers setDestUrl() -> triggers setLoading();
 *  User clicks a link -> setDestUrl() -> triggers setLoading();
 *  Finally, setLoading() triggers request().
 */
export default function PostList(props: PageOptionProps) {
    const firstRun = useRef(true);
    const [op, setOp] = useState(props.op);
    //TODO: wait for websocket implementation.
    const [newPost, setNewPost] = useState(0);  
    const [hasMore, setHasMore] = useState(false);
    const [posts, setPosts] = useState(new Array<Post>());
    const [minPid, setMinPid] = useState(-1);
    const [maxPid, setMaxPid] = useState(-1);
    const [destUrl, setDestUrl] = useState<string>();
    const [loading, setLoading] = useState<boolean>();

    // monitor the page change by the 'props' value.
    // Use 'useRef()' to skip the update following the first render.
    useEffect(() => {
        if (firstRun.current) {
            firstRun.current = false;
            return;
        }
        
        reset();
    }, [props]);

    // op change always means a new page, so construct default url here.
    useEffect(() => {
        let url = getDefaultUrlByOption();
        setDestUrl(url);
    }, [op]);

    useEffect(() => {
        if (destUrl) setLoading(true);
    }, [destUrl]);

    // 'loading' value triggers the request.
    useEffect(() => {
        // without the validation of 'destUrl', typescript will complain about 'string | undefined'.
        if (loading && destUrl) {
            setHasMore(false);  // Hide hasMore button when requesting.
            request(destUrl, handleResponse, handleError); 
        }
    }, [loading]);

    function getDefaultUrlByOption(): string {
        let url = '';
        switch (op) {
            case 1:
                // fake URL to test error handling.
                url = 'https://run.mocky.io/v3/5a17e854-64a7-4398-a416-88ec6b6f8d72';
                break;
            case 2:
                break;
            default:
                url = BaseUrl + 'posts';
        }

        return url;
    }

    function reset(): void {
        setPosts(new Array<Post>());
        setHasMore(false);
        setMinPid(-1);
        setMaxPid(-1);
        // If user click 'Home' in home page, the 'op' value will not change nor does it trigger the request.
        if (props.op !== op) {
            setOp(props.op); 
            return;
        } 

        //if the current url === default url, the trigger will not work as well.
        let newUrl = getDefaultUrlByOption();
        if (newUrl === destUrl) {
            setLoading(true);
        } else { 
            setDestUrl(newUrl);
        }  
    }

    // Don't forget to handle the error of 'json()'.
    function handleResponse(res: globalThis.Response): void {
        res.json().then(
            (result: PostsResponse) => {
                if (!result) return;

                setPosts(posts.concat(result.posts));
                setHasMore(result.hasMore);
                if (result.maxPid > maxPid) setMaxPid(result.maxPid);
                if (minPid > result.minPid || minPid <= 0) setMinPid(result.minPid);

                // No matter what response got, loading is finished. Same in catch block.
                setLoading(false);
            }
        ).catch(() => {
            setLoading(false);
            console.error('json parse error!\n' + res.body);
        })
    }

    function handleError(res: globalThis.Response): void {
        setLoading(false);
        console.error(res);
    }

    function loadMore(): void {
        setDestUrl(BaseUrl + 'nextposts');
    }

    function deletePost(pid: number): void {  // TODO: ask user to confirm and send request to server.
        let newPostList = posts.filter(post => post.pid !== pid);
        setPosts(newPostList);
    }

    // Note loading image should be put under the postlist to prevent re-render when requesting for more posts.
    return (
        <div id="post_list">
            {op === 0 && newPost > 0 && <button id="btn_loadnew">Load {newPost} new posts</button>}
            {posts.map((p) => <div className='post' key={p.pid}><PostEntry value={p} onDelete={deletePost} key={p.pid}/><hr/></div>)}   
            {loading && <div className='loading-img'><img src='/images/loading.svg' alt='loading' width='100px'/></div>}
            {!loading && posts.length === 0 && <div className='center'><h3>No posts found.</h3></div>}
            {hasMore && <button id="btn_loadmore" onClick={() => loadMore()}>Load More</button>}
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

    if (post === null || post === undefined) return null;

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
        if (!show || post.comments <= 0) return;
        request(BaseUrl + 'comments', handleResponse, handleError);
    }, [show]);

    if (!show || !post) return null;

    function handleResponse(res: globalThis.Response): void {
        res.json().then(
            (result: CommentsResponse) => {
                if (result === null) return;

                setComments(result.comments.slice());
                setHasMore(result.hasMore);
                if (minCid > result.minCid || minCid <= 0) setMinCid(result.minCid);
            }
        )
    }

    function handleError(res: globalThis.Response): void {
        console.error(res);
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