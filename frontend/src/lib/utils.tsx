import {UserForContext} from './interfaces';


export const BaseUrl = 'https://5f0bdaca9d1e150016b377f6.mockapi.io/api/';

// Helper function to start a request.
export function request(url: string, callback: Function, errorHandler: Function) {
        fetch(url)
        .then(res => {
            if (res.status === 200) {
                callback(res);
            } else {
                errorHandler(res);
            }
        })
}

// Generate a fake user to init the context in 'context.tsx'.
export function fakeUser(): UserForContext {
    let u: UserForContext = {uid: -1, uname: '', setUid: nan, setUname: nan};
    return u;

    function nan() {
        return;
    }
}