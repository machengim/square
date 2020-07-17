import React from 'react';
import Draft from '../components/draft';
import PostList from '../components/postlist';
import Panel from '../components/panel';
import {UserContext} from '../lib/context';

export default function Home() {
    const user = React.useContext(UserContext);
    user.setUname('Harry Potter');  // Test setState. TODO: needs to remove later.

    return (
        <main>
            <div id="wrapper">
                <article>
                    <Draft />
                    <PostList />
                </article>
                <Panel />
            </div>
        </main>
    );
}