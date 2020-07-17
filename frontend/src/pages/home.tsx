import React, {useState} from 'react';
import Draft from '../components/draft';
import PostList from '../components/postlist';
import Panel from '../components/panel';


export default function Home() {
    // control which post list to display.
    // op === 0 means default public posts, 1 for user's own posts, 2 for user's marks.
    const [op, setOp] = useState(0);

    // Note setOp() is not a function so it cannot pass to the child component.
    function changeOption(i: number) {
        setOp(i);
    }

    return (
        <main>
            <div id="wrapper">
                <article>
                    {op === 0 && <Draft />}
                    <PostList op={op} />
                </article>
                <Panel setOp={changeOption}/>
            </div>
        </main>
    );
}