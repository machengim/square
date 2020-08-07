import React, {useState, useEffect, useRef, useContext, ChangeEvent} from 'react';
import {Post, Comment, PostsResponse, PagedPostsResponse, CommentsResponse, PostProps, 
    PageOptionProps, CommentProps, PageInfo, PageInfoProps} from '../lib/interfaces';
import {AppContext, UserContext} from './context';
import Lightbox from './lightbox';
import {BaseUrl, request, deleteRequest, checkInstruction, fakeUser, postRequest, getTimeElapse} from '../lib/utils';
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
    const appCtx = useContext(AppContext);
    const userCtx = useContext(UserContext);
    const firstRun = useRef(true);
    const [op, setOp] = useState(props.op);
    //TODO: wait for websocket implementation.
    const [newPost, setNewPost] = useState(0);  
    const [hasMore, setHasMore] = useState(false);
    const [posts, setPosts] = useState(new Array<Post>());
    const [minPid, setMinPid] = useState(-1);
    const [maxPid, setMaxPid] = useState(-1);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [destUrl, setDestUrl] = useState<string>();
    const [loading, setLoading] = useState(false);
    const [pageInfo, setPageInfo] = useState<PageInfo>(defaultPageInfo());

    useEffect(() => {
        if (appCtx.updatePosts) {
            setDestUrl(BaseUrl + 'posts?max=' + maxPid);
        }
    },[appCtx.updatePosts]);

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
        let url = getDefaultUrlByOption(op);
        setDestUrl(url);
    }, [op]);

    useEffect(() => {
        if (destUrl) setLoading(true);
    }, [destUrl]);

    // 'loading' value triggers the request.
    useEffect(() => {
        // If user has no permission on current page, stop requesting.
        if (!validateUser()) {
            setLoading(false);
            return;
        }
        // Typescript will complain if `destUrl` is not checked.
        if (loading && destUrl) {
            request(destUrl, handleResponse, handleError); 
        } 
    }, [loading]);

    useEffect(() => {
        let pageInfo: PageInfo = {
            uid: userCtx.user.uid,
            current: currentPage,
            total: totalPage,
            op: op,
            setDestUrl: setDestUrl,
        };

        setPageInfo(pageInfo);
    }, [op, currentPage, totalPage, userCtx])

    function defaultPageInfo(): PageInfo {
        let pageInfo: PageInfo = {
            uid: -1,
            current: 0,
            total: 0,
            op: 0,
            setDestUrl: setDestUrl,
        }

        return pageInfo;
    }

    
    function getDefaultUrlByOption(op: number): string {
        let url = '';
        let uid = userCtx.user.uid;
        switch (op) {
            case 1:
                // get posts from the current user.
                url = BaseUrl + 'posts/user/' + uid;
                break;
            case 2:
                // get marks from the current user.
                url = BaseUrl + 'marks/user/' + uid;
                break;
            case 3:
                // search for a keyword.
                url = BaseUrl + 'posts/search/' + getSearchKeyword();
                break;
            default:
                url = BaseUrl + 'posts';
        }

        return url;
    } 

    function getSearchKeyword() {
        let keyword = window.location.pathname.split('/').pop();
        return keyword;
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
        let newUrl = getDefaultUrlByOption(op);
        if (newUrl === destUrl) {
            setLoading(true);
        } else { 
            setDestUrl(newUrl);
        }  
    }

    function validateUser() {
        let uid = userCtx.user.uid;
        // Unlogged users are not allowed to see '/posts' or '/marks' or others later.
        if (uid <= 0 && (op === 1 || op === 2)) return false;
        return true;
    }

    // Don't forget to handle the error of 'json()'.
    function handleResponse(res: globalThis.Response): void {
        if (!res) return;   // get null response.
        if (checkInstruction(res.headers.get('instruction'))) {
            userCtx.setUser(fakeUser());
        }

        if (props.op === 0) parsePostResponse(res);
        else parsePagedPostResponse(res);
    }

    function parsePagedPostResponse(res: globalThis.Response) {
        res.json().then(
            (result: PagedPostsResponse) => {
                if (!result) return;

                setCurrentPage(result.currentPage);
                setTotalPage(result.totalPage);
                setPosts(result.posts);
                setLoading(false);
            }
        ).catch( e => {
            console.log('Cannot parse paged post from: ' + res);
            setLoading(false);
        });
    }

    function parsePostResponse(res: globalThis.Response) {
        res.json().then(
            (result: PostsResponse) => {
                if (!result) return;

                if (appCtx.updatePosts && appCtx.setUpdatePosts) {
                    if (result.posts.length > 0) {
                        let temp = result.posts.concat(posts.slice()); 
                        setPosts(temp);
                    } else {
                    // if the notification to update posts is received, but the response result is empty,
                    // it's because the user send a private post. In this case, the maxPid still needs to
                    // update to avoid the React fails in checking data change in future request.
                        setMaxPid(maxPid + 1);
                    }
                    appCtx.setUpdatePosts(false); 
                } else {
                    setPosts(posts.concat(result.posts));
                }

                if (result.hasMore !== null) setHasMore(result.hasMore);
                if (result.maxPid > maxPid) setMaxPid(result.maxPid);
                if (result.minPid > 0 && (minPid > result.minPid || minPid <= 0)) setMinPid(result.minPid);
                setLoading(false);
                // No matter what response got, loading is finished. Same in catch block.
            }
        ).catch(() => {
            setDestUrl('');
            console.error('json parse error!\n' + res.body);
            setLoading(false);
        });
    }

    function handleError(res: globalThis.Response): void {
        setLoading(false);
        console.error(res);
    }

    function loadMore(): void {
        setDestUrl(BaseUrl + 'posts?min=' + minPid);
    }

    function deletePost(pid: number): void {  // TODO: ask user to confirm and send request to server.
        let confirmDelete = window.confirm('Confirm to delete it?');

        if (confirmDelete) {
            deleteRequest(BaseUrl + 'posts/' + pid, (d: any) => deleteDone(pid), deleteError);
        }
    }

    function deleteDone(pid: number) {
        let newPostList = posts.filter(post => post.pid !== pid);
        setPosts(newPostList);
        appCtx.setUpdateUser && appCtx.setUpdateUser(true);

    }

    function deleteError(res: globalThis.Response) {
        alert('Delete post error: ' + res);
    }

    // Note loading.svg should be put under the postlist to prevent re-render when requesting for more posts.
    return (
        <div id="post_list">
            {op === 0 && newPost > 0 && <button id="btn_loadnew">Load {newPost} new posts</button>}
            {posts.map((p) => <div className='post' key={p.pid}><PostEntry value={p} onDelete={deletePost} key={p.pid}/><hr/></div>)}   
            {loading && op === 0 && <div className='loading-img'><img src='/images/loading.svg' alt='loading' width='100px'/></div>}
            {!loading && posts.length === 0 && <div className='center'><h3>No posts found.</h3></div>}
            {hasMore && maxPid > 0 && !loading && <button id="btn_loadmore" onClick={() => loadMore()}>Load More</button>}
            {op > 0 && !loading && <Pagination value={pageInfo} />}
        </div>
    );

}

function Pagination(props: PageInfoProps) {
    const [pageInfo, setPageInfo] = useState(props.value);
    const [pages, setPages] = useState<number[]>([]);

    useEffect(() => {
        setPageInfo(props.value);
    }, [props]);

    useEffect(() => {
        if (pageInfo.total <= 0) {
            setPages([]);
        } else {
            setPages(getPageNumbers(pageInfo.current, pageInfo.total));
        }

    }, [pageInfo]);

    function getPageNumbers(current: number, total: number): number[] {
        let pages: number[] = [];
        let min = current;
        let max = current;

        for (let i = 0; i < 2; i++) {
            if (min - 1 > 0) min--;
            else if (max + 1 <= total) max++;
            if (max + 1 <= total) max++;
            else if(min - 1 > 0) min--;
        }

        for (let i = min; i <= max; i++){
            pages.push(i);
        }

        return pages;
    }

    function getSinglePageLink(p: number) {
        if (p !== pageInfo.current) {
            return (
                <a key={p} onClick={() => changePage(p)}>&nbsp;{p}&nbsp;</a>
            );
        } else {
            return (
                <span key={p}>&nbsp;{p}&nbsp;</span>
            )
        }
    }

    function changePage(page: number) {
        if (page < 0 || page > pageInfo.total) return;

        let url = '';
        switch (pageInfo.op) {
            case 1:
                url = BaseUrl + 'posts/user/' + pageInfo.uid + '?page=' + page;
                break;
            case 2:
                url = BaseUrl + 'marks/user/' + pageInfo.uid + '?page=' + page;
                break;
            default:
                break;
        }

        pageInfo.setDestUrl(url);
    }

    return (
        <div id='page_no'>
            {pages.map(p => getSinglePageLink(p))}
        </div>
    )
}

//TODO: init lightbox images.
function PostEntry(props: PostProps) {
    const post = props.value;
    const appCtx = useContext(AppContext);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState(post.comments);
    const [marked, setMarked] = useState(post.marked);
    const [images] = useState(post.attachments);   //TODO: needs to init.

    function markOperation() {
        let action = (marked)? "unmark": "mark";
        request(BaseUrl + 'marks?pid=' + post.pid + '&action=' + action, MarkDone, MarkError);
    }

    function MarkDone(res: globalThis.Response) {
        appCtx.setUpdateUser && appCtx.setUpdateUser(true);
        setMarked(!marked);
    }

    function MarkError(res: globalThis.Response) {
        res.text().then(e => alert(e));
    }

    function toggleShowComments() {
        setShowComments(!showComments);
    }

    function deleteCurrent() {
        props.onDelete(post.pid);
    }

    function addComment() {
        setComments(comments + 1);
    }

    if (post === null || post === undefined) return null;

    return (
        <>
            <div className="author">{post.uname} said:</div>
            <div className="content">{post.content}</div>
            {images && <Lightbox value={images} />}
            <div className="foot">
                <span>{getTimeElapse(post.ctime)}</span>
                <span className="toolbar">
                    {post.owner? <a onClick={() => deleteCurrent()}>Delete</a>: null}
                    &nbsp;<a onClick={() => toggleShowComments()}>Comments({comments})</a>
                    &nbsp;<a onClick={() => markOperation()}>{marked? 'Marked': 'Mark'}</a>
                </span>
            </div>
            <CommentList value={post} show={showComments} onComment={()=> addComment()}/>
        </>
    );
}

function CommentList(props: CommentProps) {
    const post = props.value;
    const show = props.show;
    const userCtx = useContext(UserContext);
    const [comments, setComments] = useState(new Array<Comment>());
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);
    //const [hasMore, setHasMore] = useState(false);
    //const [minCid, setMinCid] = useState(-1);
    
    useEffect(() => {
        if (!show || post.comments <= 0) return;
        request(BaseUrl + 'comments/' + post.pid, handleResponse, handleError);
    }, [show]);

    useEffect(() => {
        if (sending) sendComment();
        else setInput('');
    }, [sending]);

    if (!show || !post) return null;

    function handleResponse(res: globalThis.Response): void {
        res.json().then(
            (result: CommentsResponse) => {
                if (result === null) return;

                setComments(result.comments.slice());
                //props.onComment();
                //setHasMore(result.hasMore);
                //if (minCid > result.minCid || minCid <= 0) setMinCid(result.minCid);
            }
        ).catch((e) => {
            console.log('Cannot parse comments response.');
        })
    }

    function handleError(res: globalThis.Response): void {
        console.error(res);
    }

    function onCommentChange(event: ChangeEvent<HTMLTextAreaElement>) {
        setInput(event.target.value);
    }

    function sendComment() {
        if (input.trim().length === 0) {
            alert('No content in comment area to send.');
            setSending(false);
            return;
        }

        let comment: Comment = {
            pid: (post.pid)? post.pid: -1,
            uid: userCtx.user.uid,
            uname: userCtx.user.uname,
            content: input,
            ctime: new Date(),
        };

        postRequest(BaseUrl + 'comments/' + post.pid, JSON.stringify(comment), commentDone, commentFail);
    }

    function commentDone(res: globalThis.Response) {
        res.json()
            .then((comment: Comment) => {
                let temp = comments.slice().concat(comment);
                setComments(temp);
                setSending(false);
                props.onComment();
            });
    }

    function commentFail(res: globalThis.Response) {
        setSending(false);
        alert(res);
    }

    return (
        <div className='comment'>
            {comments.map((c) => <p key={c.cid}>{c.content} --by {c.uname}</p>)}
            <textarea name="comment" onChange={(e) => onCommentChange(e)} value={input} />
            {!sending && <button onClick={() => setSending(true)}>Send</button>}
            {sending && <button disabled>Send</button>}
        </div>
    )
}

