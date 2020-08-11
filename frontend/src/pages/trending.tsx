import React from 'react';
import PostList from '../components/postlist';

export default function Trending() {
    return (
        <main>
            <div id='wrapper'>
                <PostList op={4}/>
            </div>
        </main>
    );
}