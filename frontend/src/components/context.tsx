import React, {useState, useEffect, createContext} from 'react';
import {BaseUrl, fakeUser, fakeUserCtx, request, clearStorage, setupStorage} from '../lib/utils';
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
    const [loading, setLoading] = useState(false);
    // to provide user panel consistency, the local storage will be used to init user
    // if it's valid, other wise user will be set as guest.
    const [user, setUser] = useState(initUser());
    useState(() => initRequestCheck());

    useEffect(() => {
        if (loading && user.uid > 0)   
            request(BaseUrl + 'user/summary/' + user.uid, handleUserInfoResponse, handleError);
        else
            setLoading(false);
    }, [loading]);

    function initUser(): UserInfo{
        let summary = fakeUser();
        let cookieUid = Cookies.get('u');
        if (cookieUid) {
            let summaryStored = window.localStorage.getItem('summary');
            if (summaryStored) {
                try {
                    let temp: UserInfo = JSON.parse(summaryStored);
                    if (temp.uid === +cookieUid)
                        summary = temp;
                    else
                        window.localStorage.removeItem('summary');
                } catch (e) {
                    console.log('Cannot parse local stored content to user summary: ' + e);
                }
            } else {
                summary.uid = +cookieUid;
            }
        }
        
        return summary;
    }

    function initRequestCheck() {
        if (user.uid <= 0) {
            clearStorage();
            return;
        }
        // if the info in local storage expired, start a request.
        if (!checkLastUpdate())
            setLoading(true);
        // if has cookie but no summary in local storage, start a request.
        if (Cookies.get('u') && !window.localStorage.getItem('summary'))
            setLoading(true);
    }

    function checkLastUpdate(): boolean {
        let lastUpdateStored = window.localStorage.getItem('lastUpdate');
        if (!lastUpdateStored) return false;

        let lastUpdate = new Date(JSON.parse(lastUpdateStored));
        if (!lastUpdate) return false;

        let current = new Date();
        let diff = current.getTime() - lastUpdate.getTime();
        if (!diff || diff > 60 * 60 * 1000) {
            return false;
        }

        return true;
    }

    function handleUserInfoResponse(res: globalThis.Response) {
        res.json()
        .then((summary: UserInfo) => {
            setupStorage(summary)
            setUser(summary);
            setLoading(false);
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