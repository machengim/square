import React, {useState, useEffect, createContext} from 'react';
import {fakeUser} from './utils';

/**
 * This file is the ACTUAL entry point of the whole app.
 * Only user id and user nickname should be kept as context.
 * TODO: read user info from cookie if it exists. This should be done immediately after constructor.
 */

// Must have a default context value, so a fake user is made up in 'utils.tsx'.
export const UserContext = createContext(fakeUser());

export function UserProvider(props: any) {
    // Default user info.
    const [uid, setUid] = useState(1);  // TODO: Guest uid should be set to 0.
    const [uname, setUname] = useState('Guest');

    useEffect(() => {
        console.log(uid + uname);
    }, [uid, uname]);

    return (
        <UserContext.Provider value={{uid, uname, setUid, setUname}}>
            {props.children}
        </UserContext.Provider>
    );
}