import React, { useContext } from 'react';
import { UserContext } from '../components/context';
import Settings from '../components/settings';

export default function Setting() {
    const userCtx = useContext(UserContext);

    return (
        <main>
            <div id='wrapper'>
                {userCtx.user.uid > 0 && <Settings />}
                {userCtx.user.uid <= 0 && <div>Sorry, you haven't logged in.</div>}
            </div>
        </main>
    );
}