import React from 'react';
import Draft from '../components/draft';
import PostList from '../components/postlist';

export default function Home() {

    return (
        <main>
            <div id="wrapper">
                <article>
                    <Draft />
                    <PostList />
                </article>
            </div>
        </main>
    );
}