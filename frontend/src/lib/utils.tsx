import {UserInfoForContext, UserInfo} from './interfaces';


export const BaseUrl = 'http://localhost:8080/';

// Helper function to start a request. Don't forget the error handler.
export function request(url: string, callback: Function, errorHandler: Function) {
    console.log('request to ' + url);

    fetch(url)
        .then(res => {
            if (res.status === 200) {
                callback(res);
            } else {
                errorHandler(res);
            }
        }).catch((res) => {
            errorHandler(res);
        });
}

export function postRequest(url: string, json: string,
     callback: Function, errorHandler: Function) {

        console.log('post request to ' + url);
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: json,
            credentials: "include"
        }).then(res => {
            if (res.status === 200) {
                callback(res);
            } else {
                errorHandler(res);
            }
        }).catch(res => {
            errorHandler(res);
        });
}

// Generate a fake user to init the context in 'context.tsx'.
export function fakeUser(): UserInfo {
    let user: UserInfo = {
        uid: -1,
        uname: 'Guest',
        posts: 0,
        marks: 0,
        messages: 0,
    }

    return user;
}

export function fakeUserCtx(): UserInfoForContext {
    let user = fakeUser();
    
    let userCtx: UserInfoForContext = {
        user: user,
        setUser: nan,
    };

    return userCtx;

    function nan() {
        return;
    }
}