import React, {useState, useEffect} from 'react';
import {PageOptionProps} from '../lib/interfaces';
import Draft from '../components/draft';
import PostList from '../components/postlist';
import Panel from '../components/panel';


/**
 * @param props: contains a number 'op' that represents which page to show.
 * op === 0 means '/', 1 means '/posts', 2 means '/marks', and maybe more later.
 */
export default function Home(props: PageOptionProps) {
    const [op, setOp] = useState(props.op);

    useEffect(() => {
        setOp(props.op);
    }, [props]);

    return (
        <main>
        <div id="wrapper">
            <article>
                <Draft />
                <PostList op={op}/>
            </article>
            <Panel/>
        </div>
    </main>
    );
}
