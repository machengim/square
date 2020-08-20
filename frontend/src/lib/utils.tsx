import {UserInfoForContext, UserInfo} from './interfaces';


export const BaseUrl = 'http://localhost:8080/';
//export const BaseUrl = 'https://masq.xyz/api/';

// Helper function to start a request. Don't forget the error handler.
export function request(url: string, callback: Function, errorHandler: Function) {
    //console.log('get request to ' + url);

    fetch(url, {
        credentials: 'include',
    }).then(res => {            
            if (res.ok) {
                callback(res);
            } else {
                errorHandler(res);
            }
        }).catch((res) => {
            errorHandler(res);
        });
}

export function deleteRequest(url: string, callback: Function, errorHandler: Function) {
    //console.log('delete request to ' + url);

    fetch(url, {
        credentials: 'include',
        method: 'DELETE'
    }).then(res => {        
            if (res.ok) {
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

        //console.log('post request to ' + url);
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: json,
            credentials: "include"
        }).then(res => {
            checkInstruction(res.headers.get('instruction'));
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

export function checkInstruction(instruction: string | null): boolean {
    if (!instruction || instruction !== 'clear') return false;

    clearStorage();
    return true;
}

export function clearStorage() {
    window.localStorage.removeItem('summary');
    window.localStorage.removeItem('lastUpdate');
}

export function setupStorage(summary: UserInfo) {
    localStorage.setItem('summary', JSON.stringify(summary));
    localStorage.setItem('lastUpdate', JSON.stringify(new Date()));
}

// ctime must be any type here. Using `Date` or `number` will cause react crash.
export function getTimeElapse(ctime: any) {
    let current = new Date();
    let seconds = current.getTime()/1000 - ctime;
    let text = '';
    if (seconds < 60) text = 'just now';
    else if (seconds < 60 * 60) text = Math.floor(seconds / 60) + ' mins ago';
    else if (seconds < 24 * 60 * 60) text = Math.floor(seconds / 60 / 60) + ' hours ago';
    else if (seconds < 7 * 24 * 60 * 60) text = Math.floor(seconds / 24 / 60 / 60) + 'days ago';
    else text = new Date(ctime).toLocaleString();

    return text;
}