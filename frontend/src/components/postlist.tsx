import React, {useState, useEffect} from 'react';
import {Post, Response, NumberProps, PostProps} from '../lib/interfaces';
import {request} from '../lib/utils';
import './postlist.css';

/**
 * TODO: comments, update state from child components..
 */
interface LoadMoreProps {
    minPid: number;
    hasMore: boolean;
}

export default function PostList() {
    const apiUrl = 'https://5f0bdaca9d1e150016b377f6.mockapi.io/api/posts';
    const [newPost, setNewPost] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [posts, setPosts] = useState(new Array<Post>());
    const [minPid, setMinPid] = useState(-1);
    const [maxPid, setMaxPid] = useState(-1);
    const [_] = useState(() => request(apiUrl, handleResponse, handleError));    // used to init data.

    function handleResponse(res: globalThis.Response) {
        res.json().then(
            (result: Response) => {
                if (result === null) return;

                setPosts(result.posts.slice());
                setHasMore(result.hasMore);
                if (result.maxPid > maxPid) setMaxPid(result.maxPid);
                if (minPid > result.minPid || minPid <= 0) setMinPid(result.minPid);
            }
        )
    }

    function handleError(res: globalThis.Response) {
        console.log(res);
    }

    useEffect(() => {
        console.log('min pid is ' + minPid);
    }, [minPid]);

    return (
        <div id="post_list">
            <LoadNewButton value={newPost} />
            <div className="post">
                {posts.map((p) => <div key={p.pid}><PostEntry value={p}  /><hr/></div>)}   
                <LoadMoreButton hasMore={hasMore} minPid={minPid}/>
            </div>
        </div>
    );

}

function PostEntry(props: PostProps) {
    const post = props.value;
    if (post === null || post === undefined)    return null;

    let marked = post.marked? 'Marked': 'Mark';

    return (
        <>
            <div className="author">{post.uname} said:</div>
            <div className="content">{post.content}</div>
            <div className="foot">
                <span>5 minutes ago</span>
                <span className="toolbar">Comments({post.comments}) {marked}</span>
            </div>
        </>
    );
}

function LoadNewButton(props: NumberProps) {
    const number = props.value;
    if (number <= 0) return null;

    return (
        <button id="btn_loadnew">Load {number} new posts</button>
    )
}

function LoadMoreButton(props: LoadMoreProps) {
    if (!props.hasMore) return null;

    return (
        <button id="btn_loadmore">Load More</button>
    )
}