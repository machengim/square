import React, {useState, createContext} from 'react';
import {BaseUrl, fakeUser, fakeUserCtx, request} from '../lib/utils';
import {UserInfo} from '../lib/interfaces';

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
    const [user, setUser] = useState(fake);
    useState(() => {
        request(BaseUrl + 'summary', handleUserInfoResponse, handleError);
    });

    function handleUserInfoResponse(res: globalThis.Response) {
        res.json()
        .then((result: UserInfo) => {
            setUser(result);
        }).catch(() => {
            console.error('Json parse error!\n' + res);
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