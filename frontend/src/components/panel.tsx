import React, {useState, useEffect, useContext, ChangeEvent} from 'react';
import {Link} from 'react-router-dom';
import {UserSummary} from '../lib/interfaces';
import {UserContext} from '../lib/context';
import {BaseUrl, request} from '../lib/utils';
import './panel.css';


export default function Panel() {
    const user = useContext(UserContext);
    const [changing, setChanging] = useState(false);
    const [btnText, setBtnText] = useState('Change');
    const [username, setUsername] = useState(user.uname);   //used to monitor the username change.
    const [summary, setSummary] = useState<UserSummary>({posts: 0, marks: 0, messages: 0});
    const [dialogOption, setDialogOption] = useState(0);    // control login or sign up dialog to show. 0 means hide.

    useEffect(() => {
        if (user.uid <= 0) {    // User logs out, or hasn't logged in.
            setSummary({posts: 0, marks: 0, messages: 0});
            return;
        };

        request(BaseUrl + 'summary', handleSummaryResponse, handleError);
    }, [user.uid]);

    useEffect(() => {
        let dialog = document.getElementById('login-dialog');
        if (!dialog) return;

        dialog.style.display = (dialogOption > 0)? 'block': 'none';
    }, [dialogOption]);

    function handleSummaryResponse(res: globalThis.Response) {
        res.json().then(
            (result: UserSummary) => {
            if (!result) return;

            setSummary({
                posts: result.posts,
                marks: result.marks,
                messages: result.messages,
            });
        });
    }

    function handleError(res: globalThis.Response) {
        console.log(res);
    }

    function clickChangeButton() {
        if (changing) {
            setBtnText('Change');   
            if (username !== user.uname) {
                user.setUname(username);    // TODO: validate input and send new username to server.
            }
        } else {
            setBtnText('Submit');
        }

        setChanging(!changing);
    }

    function handleUnameChange(event: ChangeEvent<HTMLInputElement>) {
        setUsername(event.target.value);
    }

    return (
        <div className='aside'>
            <div className='panel'>
                <p />
                {!changing && <div id='nickname'>{username}</div>}
                {changing && <input value={username} onChange={(e) => handleUnameChange(e)} />}
                {user.uid > 0 && <button id='btn_change_name' onClick={() => clickChangeButton()}>{btnText}</button>}
                <hr />
                <ul>
                    <li>Posts: {(summary.posts > 0)? <Link to='/posts'>{summary.posts}</Link> : 0}</li>
                    <li>Marks: {(summary.marks > 0)? <Link to='/marks'>{summary.marks}</Link> : 0}</li>
                    <li>Messages: {(summary.messages > 0)? <a>{summary.messages}</a> : 0}</li>
                </ul>
                <hr />
                <div className='center'>
                    {user.uid > 0 && <button id='button_logout'>Logout</button>}
                    {user.uid <= 0 && 
                        <><button className='btn_login' onClick={() => setDialogOption(1)}>Log in</button>
                        <button className='btn_login' onClick={() => setDialogOption(2)}>Sign up</button></>}
                </div>
            </div>
            <LoginDialog />
        </div>
    );

    // Children components.
    function LoginDialog() {
        return (
            <div id='login-dialog' className='login-dialog'>
            <div className='dialog-content'>
                {(dialogOption === 2)? <RegisterForm />: <LoginForm />}
            </div>
        </div>
        );
    }
    
    function LoginForm() {
        return (
            <div className="box">
                <a className='close' onClick={() => setDialogOption(0)}>&times;</a>
                <h2>Login</h2>
                <input type="email" name="email" placeholder="Email" autoComplete="off" required />
                <input type="password" name="passwd" placeholder="Password" required />
                <div className="btns">
                    <button>Submit</button>
                    <button onClick={() => setDialogOption(2)}>Sign up</button>
                </div>
                <div className="other"><a href="#">Forget your password?</a></div>
            </div>
        );
    }
    
    function RegisterForm() {
        return (
            <div className="box">
                <a className='close' onClick={() => setDialogOption(0)}>&times;</a>
                <h2>Sign up</h2>
                <input type="email" name="email" placeholder="Email" autoComplete="off" required />
                <input type="password" name="password" placeholder="Password" required />
                <input type="password" name="repeat_passwd" placeholder="Repeat password" required />
                <input type="text" name="nickname" autoComplete="off" placeholder="Nickname (optional)" />
                <div className="btns">
                    <button>Submit</button>
                    <button onClick={() => setDialogOption(1)}>Login</button>
                </div>
            </div>
        )
    }
}
