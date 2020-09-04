import React, {useState, useContext, ChangeEvent} from 'react';
import {postRequest, BaseUrl, setupStorage} from '../lib/utils';
import {UserInfo} from '../lib/interfaces';
import { UserContext } from './context';
import './settings.css';

export default function Settings() {
    const userCtx = useContext(UserContext);
    const [user] = useState(userCtx.user);
    const [nickname, setNickname] = useState(user.uname);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [loading, setLoading] = useState(false);

    function handleInputChange(event: ChangeEvent<HTMLInputElement>, func: Function) {
        func(event.target.value);
    }

    function submitNewNickname() {
        if (nickname === user.uname) {
            alert('Same with old nickname.');
            return;
        }
        let body = {"uname": nickname};
        setLoading(true);
        postRequest(BaseUrl + 'user/' + user.uid + '/uname', JSON.stringify(body),
            handleRequestDone, handleRequestFail);
    }

    function submitNewPassword() {
        if (!checkPassword(oldPassword) || !checkPassword(newPassword) || !checkPassword(repeatPassword)) {
            alert('Password format error, please check your input.');
            return;
        }
        if (newPassword !== repeatPassword) {
            alert('New passwords not match.');
            return;
        }

        let body = {"oldPassword": oldPassword, "newPassword": newPassword};
        setLoading(true);
        postRequest(BaseUrl + 'user/' + user.uid + '/password', JSON.stringify(body),
            changePasswordDone, changePasswordDone);
    }

    function checkPassword(password: string): boolean {
        if (!password) return false;
        if (!/^\S{8,64}$/.test(password)) return false;
        if (!/\d+/.test(password) || !/[a-zA-Z]+/.test(password)) return false;

        return true;
    }

    function changePasswordDone(res: globalThis.Response) {
        res.text()
            .then((result: string) => {
                setLoading(false);
                alert(result);
            })
    }

    function handleRequestDone(res: globalThis.Response) {
        res.json()
            .then((summary: UserInfo )=> {
                userCtx.setUser(summary);
                setupStorage(summary);
                setLoading(false);
                alert('Done');
            })
    }

    function handleRequestFail(res: globalThis.Response) {
        setLoading(false);
        setNickname(user.uname);
        alert('Error happened.');
    }

    return (
        <div id="setting">
            <h3>{user.email}</h3>
            <label>Nickname:</label> 
            <input value={nickname} onChange={(e) => handleInputChange(e, setNickname)}/>
            <div>
                {!loading && <button onClick={() => submitNewNickname()}>Submit</button>}
                {loading && <button disabled>Submit</button>}
                <div className='tooltip'>Nickname rules?
                    <span className='tooltiptext'>
                        1. No longer than 32 characters;<br/>
                        2. Only alphanumeric, underscore and blank space allowed.
                    </span>
                </div>
            </div>
            <hr/>
            <label>Old password:</label>
            <input type='password' value={oldPassword} onChange={(e) => handleInputChange(e, setOldPassword)}/>
            <label>New password:</label>
            <input type='password' value={newPassword} onChange={(e) => handleInputChange(e, setNewPassword)} />            
            <label>Repeat new password:</label>
            <input type='password' value={repeatPassword} onChange={(e) => handleInputChange(e, setRepeatPassword)} />
            <div>
                {!loading && <button onClick={() => submitNewPassword()}>Submit</button>}
                {loading && <button disabled>Submit</button>}
                <div className='tooltip'>Password rule?
                    <span className='tooltiptext'>
                        1. Must be longer than 8; <br/>
                        2. Has at least one character and one digit.
                        3. Whitespace is not allowed.
                    </span>
                </div>
            </div>
            <hr />
            <label>Account setting:</label><p/>
            <div>
                <button disabled>Export posts</button>
                <button className='right' disabled>Validate Email</button>
            </div>
        </div>
    );

}