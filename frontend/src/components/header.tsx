import React, {useState, useEffect, useContext} from 'react';
import {Link} from 'react-router-dom';
import {clearStorage, request, BaseUrl} from '../lib/utils';
import './header.css';
import { UserContext } from './context';

export default function Header() {
    const userCtx = useContext(UserContext);
    const [keyword, setKeyword] = useState('');
    const [path, setPath] = useState('');
    const [readonly, setReadonly] = useState(true);

    useEffect(() => {
        if (keyword) setPath('/search/' + keyword);
    }, [keyword]);

    function changeInput(e: React.ChangeEvent<HTMLInputElement>) {
        let keyword = e.target.value;
        setKeyword(keyword);
    }

    function monitorKeyPress(e: React.KeyboardEvent) {
        let code = e.keyCode || e.which;
        if (code === 13 && userCtx.user.uid > 0) {
            let search = document.getElementById('search');
            if (search) search.click();
            setKeyword('');
        } else if (code === 13) {
            alert('Only logged user can search for posts.');
        }
    }

    function logOut() {
        if (!userCtx.user.uid || userCtx.user.uid <= 0) {
            alert('You have not logged in.');
            return;
        }

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
        <header>
            <nav>
                <div id='nav_logo'>Masq</div>
                <div id='nav_items'>
                    <ul>
                        <li><Link to='/'>Home</Link></li>
                        <li><Link to='/trending'>Trending</Link></li>
                        <li><Link to='/setting'>Setting</Link></li>
                        <li><Link to='/about/why-masq'>About</Link></li>
                        <li><a onClick={() => logOut()}>Quit</a></li>
                        <li><Link id='search' to={path} /></li>
                    </ul>
                </div>
                <div id='nav_search'>
                    <input id='search' autoComplete='off' placeholder='Search' value={keyword} onChange={(e) => changeInput(e)} onKeyPress={(e) => monitorKeyPress(e)} />
                </div>
            </nav>
        </header>
    );

}