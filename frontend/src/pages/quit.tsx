import React from 'react';
import {clearStorage, request, BaseUrl} from '../lib/utils';

export default function Quit() {

    function logOut() {
        let confirm = window.confirm('Confirm to log out?');
        if (confirm) {
            request(BaseUrl + 'user/logout', logoutDone, logoutError);
        } 
    }

    function logoutDone(res: globalThis.Response) {
        res.text().then((text: string) => {
            if (text.includes('Success')) {
                clearStorage();
                window.location.href = '/';
            } else {
                alert('Logout failed, please try again.');
            }
        }).catch(() => {
            alert('Logout failed, please try again.');
        })
    }

    function logoutError() {
        alert('Logout failed, please try again.');
    }

    return (
        <div>{() => logOut()}</div>
    )

}