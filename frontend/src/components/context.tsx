import React, {useState, useEffect, createContext} from 'react';
import {BaseUrl, fakeUser, fakeUserCtx, request} from '../lib/utils';
import {UserInfo} from '../lib/interfaces';
import Cookies from 'js-cookie';

/**
 * This file is the ACTUAL entry point of the whole app.
 * Only user id and user nickname should be kept as context.
 * TODO: read user info from cookie if it exists. This should be done immediately after constructor.
 */

// Must have a default context value, so a fake user is made up in 'utils.tsx'.
export const UserContext = createContext(fakeUserCtx());

export function UserProvider(props: any) {
    // Default user info.
    let fake = fakeUser();
    let uidCookie = Cookies.get('u');
    if (uidCookie) {
        fake.uid = +uidCookie;
    }
    const [user, setUser] = useState(fake);
    useState(() => {
        if (user.uid > 0)
            request(BaseUrl + 'user/summary/' + user.uid, handleUserInfoResponse, handleError);
    });

    function handleUserInfoResponse(res: globalThis.Response) {
        res.json()
        .then((result: UserInfo) => {
            setUser(result);
        }).catch(() => {
            console.log('Cannot parse json!\n' + res);
        })
    }

    function handleError(res: globalThis.Response) {
        console.error(res);
    }

    return (
        <UserContext.Provider value={{user, setUser}}>
            {props.children}
        </UserContext.Provider>
    );
}