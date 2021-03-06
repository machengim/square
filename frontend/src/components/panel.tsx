import React, {useState, useEffect, useContext, useRef, ChangeEvent} from 'react';
import {Link} from 'react-router-dom';
import {fakeUser, BaseUrl, postRequest, request, clearStorage, setupStorage} from '../lib/utils';
import {UserContext} from './context';
import './panel.css';
import { UserInfo } from '../lib/interfaces';

/**
 * TODO: disable the buttons after user clicks.
 */
export default function Panel() {
    const userCtx = useContext(UserContext);        // Note the 'userCtx' is a context while 'user' is a local variable.
    const [user, setUser] = useState(userCtx.user);
    const [username, setUsername] = useState(user.uname);   //used to monitor the username change.
    const [dialogOption, setDialogOption] = useState(0);    // control login or sign up dialog to show. 0 means hide.
    const [changing, setChanging] = useState(false);
    // Below varibles are used for login and register form.
    // Note the type 'HTMLInputElement' is necessary to prevent 'possible null object' warnings.
    const email = useRef<HTMLInputElement>(null);
    const password = useRef<HTMLInputElement>(null);
    const repeatPassword = useRef<HTMLInputElement>(null);
    const uname = useRef<HTMLInputElement>(null);

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
        if (changing && username !== user.uname) {
            // TODO: validate input and send new username to server.
            let body = {"uname": username};
            postRequest(BaseUrl + 'user/' + user.uid + '/uname', JSON.stringify(body),
                changeUnameDone, changeUnameFail);
        } 

        setChanging(!changing);
    }

    function changeUnameDone(res: globalThis.Response) {
        res.json()
            .then((summary: UserInfo) => {
                userCtx.setUser(summary);
                setupStorage(summary);
            }).catch(() => {
                console.log('Cannot parse json!\n' + res);
            });
    }

    function changeUnameFail(res: globalThis.Response) {
        res.text()
            .then((result) => {
                alert(result);
                setUsername(user.uname);
            });
    }

    function handleUnameChange(event: ChangeEvent<HTMLInputElement>) {
        setUsername(event.target.value);
    }

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
                    <li>Messages: {(user.messages > 0)? user.messages : 0}</li>
                </ul>
                <hr />
                <div className='center'>
                    {user.uid > 0 && <button id='button_logout' onClick={() => logOut()}>Logout</button>}
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

    function getEmailInput(): string {
        if (!email || !email.current || !email.current.value) {
            alert('Empty email not allowed!');
            return '';
        }

        const emailStr = email.current.value;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr)) {
            alert('Invalid email input!')
            return '';
        }

        return emailStr;
    }

    // op === 0 means login, so no need to check passwords match.
    function getPasswordInput(op: number): string {
        if (!password || !password.current || !password.current.value) {
            alert('Empty password not allowed!');
            return '';
        }
        let passwordStr = password.current.value;

        if(op === 1 && !checkPasswordsMatch(passwordStr)) {
            return '';
        }

        if (!/^\S{8,64}$/.test(passwordStr)){
            alert('Password must be longer than 8!');
            return '';
        }

        if (!/\d+/.test(passwordStr) || !/[a-zA-Z]+/.test(passwordStr)) {
            alert('Password must have at least one digit and one character!');
            return '';
        }

        return passwordStr;
    }

    function checkPasswordsMatch(password: string): boolean {
        if (!repeatPassword || !repeatPassword.current || !repeatPassword.current.value) {
            alert('Empty repeat password not allowed!');
            return false;
        }
        let repeatStr = repeatPassword.current.value;

        if(password !== repeatStr) {
            alert('Password and repeat password not match!');
            return false;
        }

        return true;
    }
    
    function LoginForm() {
        const [logging, setLogging] = useState(false);

        function login() {
            const newUser = getLoginInfo();
            if (!newUser.email || !newUser.password) return;
            setLogging(true);
            postRequest(BaseUrl + 'user/login', JSON.stringify(newUser),
                    loginDone, loginFailed);
        }

        function loginDone(res: globalThis.Response) {
            setLogging(false);
            res.json()
                .then((summary: UserInfo) => {
                    userCtx.setUser(summary);
                    setupStorage(summary);
                    setDialogOption(0);
                }).catch(() => {
                    console.log('Cannot parse json!\n' + res);
                });
        }

        function loginFailed(res: globalThis.Response) {
            setLogging(false);
            alert('login failed');
        }

        function getLoginInfo(): UserInfo {
            let newUser = fakeUser();

            const emailInput = getEmailInput();
            if (!emailInput) return newUser;

            const passwordInput = getPasswordInput(0);
            if (!passwordInput) return newUser;

            newUser.email = emailInput;
            newUser.password = passwordInput;

            return newUser;
        }

        return (
            <div className='box'>
                <a className='close' onClick={() => setDialogOption(0)}>&times;</a>
                <h2>Login</h2>
                <input type='email' ref={email} name='email' placeholder='Email' autoComplete='off' required />
                <input type='password' ref={password} name='passwd' placeholder='Password' required />
                <div className='btns'>
                    {!logging && <button onClick={() => login()}>Submit</button>}
                    {logging && <button disabled className='disabled'>Submit</button>}
                    <button onClick={() => setDialogOption(2)}>Sign up</button>
                </div>
                <div className='other'><a href='#'>Forget your password?</a></div>
            </div>
        );
    }
    
    function RegisterForm() {
        const [submitting, setSubmitting] = useState(false);

        function submit() {
            const newUser = getRegisterInfo();
            if (!newUser.email || !newUser.password) return;
            setSubmitting(true);
            postRequest(BaseUrl + 'user/register', JSON.stringify(newUser),
                    registerDone, registerFailed);
        }

        function registerDone() {
            setSubmitting(false);
            alert('Register successfully!');
            setDialogOption(1);
        }

        function registerFailed() {
            setSubmitting(false);
            alert('Register failed!');
        }

        function getRegisterInfo(): UserInfo {
            let newUser = fakeUser();

            const emailInput = getEmailInput();
            if (!emailInput) return newUser;

            const passwordInput = getPasswordInput(1);
            if (! passwordInput) return newUser;

            newUser.email = emailInput;
            newUser.password = passwordInput;

            if (uname && uname.current && uname.current.value){
                newUser.uname = uname.current.value;
            } else {
                newUser.uname = 'Anonymous';
            }

            return newUser;
        }

        return (    
            <div className='box'>
                <a className='close' onClick={() => setDialogOption(0)}>&times;</a>
                <h2>Sign up</h2>
                <input title='Fake email is allowed if you do not need advanced features.' type='email' ref={email} name='email' placeholder='Email' autoComplete='off' required />
                <input title='No less than 8 and has at least one digit and one character.' type='password' ref={password} name='password' placeholder='Password' required />
                <input title='Same with password.' type='password' ref={repeatPassword} name='repeat_passwd' placeholder='Repeat password' required />
                <input type='text' ref={uname} name='nickname' autoComplete='off' placeholder='Nickname (optional)' />
                <div className='btns'>
                    {submitting && <button disabled className='disabled'>Submit</button>}
                    {!submitting && <button onClick={() => submit()} >Submit</button>}
                    <button onClick={() => setDialogOption(1)}>Login</button>
                </div>
            </div>
        )
    }
}
