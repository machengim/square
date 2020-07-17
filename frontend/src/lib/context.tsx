import React, {useState, useEffect, createContext} from 'react';
import {UserForContext} from './interfaces';
import {empty} from './utils';

// see experiment in home.tsx
let u: UserForContext = {uid: -1, uname: '', setUid: empty, setUname: empty};
export const UserContext = createContext(u);

export function UserProvider(props: any) {
    const [uid, setUid] = useState(-1);
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