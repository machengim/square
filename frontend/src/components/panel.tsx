import React, {useState, useEffect, useContext, ChangeEvent} from 'react';
import {Link} from 'react-router-dom';
import {UserContext} from './context';
import './panel.css';

/**
 * TODO: disable the buttons after user clicks.
 */
export default function Panel() {
    const userCtx = useContext(UserContext);        // Note the 'userCtx' is a context while 'user' is a local variable.
    const [user, setUser] = useState(userCtx.user);
    const [username, setUsername] = useState(user.uname);   //used to monitor the username change.
    const [dialogOption, setDialogOption] = useState(0);    // control login or sign up dialog to show. 0 means hide.
    const [changing, setChanging] = useState(false);

    useEffect(() => {
        let dialog = document.getElementById('login-dialog');
        if (!dialog) return;

        dialog.style.display = (dialogOption > 0)? 'block': 'none';
    }, [dialogOption]);

    useEffect(() => {
        setUser(userCtx.user);
    }, [userCtx]);

    useEffect(() => {
        setUsername(user.uname);
    }, [user]);

    function clickChangeButton() {
        if (changing) {
            if (username !== user.uname) {
                // TODO: validate input and send new username to server.
            }
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
                {user.uid > 0 && <button id='btn_change_name' onClick={() => clickChangeButton()}>{changing? 'Submit': 'Change'}</button>}
                <hr />
                <ul>
                    <li>Posts: {(user.posts > 0)? <Link to='/posts'>{user.posts}</Link> : 0}</li>
                    <li>Marks: {(user.marks > 0)? <Link to='/marks'>{user.marks}</Link> : 0}</li>
                    <li>Messages: {(user.messages > 0)? <a>{user.messages}</a> : 0}</li>
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
