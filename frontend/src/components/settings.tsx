import React, {useState, useContext, ChangeEvent} from 'react';
import {postRequest, BaseUrl, setupStorage} from '../lib/utils';
import {UserInfo} from '../lib/interfaces';
import { UserContext } from './context';
import './settings.css';

export default function Settings() {
    const userCtx = useContext(UserContext);
    const [user] = useState(userCtx.user);
    const [nickname, setNickname] = useState(user.uname);
    const [oldPassword] = useState('');
    const [newPassword] = useState('');
    const [repeatPassword] = useState('');
    const [loading, setLoading] = useState(false);

    function handleNicknameChange(event: ChangeEvent<HTMLInputElement>) {
        setNickname(event.target.value);
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
            <input value={nickname} onChange={(e) => handleNicknameChange(e)}/>
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
            <input/>
            <label>New password:</label>
            <input />            
            <label>Repeat new password:</label>
            <input />
            <div>
                <button>Submit</button>
                <div className='tooltip'>Password rule?
                    <span className='tooltiptext'>
                        1. Must be longer than 8; <br/>
                        2. Has at least one character and one digit.
                    </span>
                </div>
            </div>
            <hr />
            <label>Account setting:</label><p/>
            <div>
                <button>Export posts</button>
                <button className='right'>Delete account</button>
            </div>
        </div>
    );

}