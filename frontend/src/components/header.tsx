import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import './header.css';

export default function Header() {

    const [keyword, setKeyword] = useState('');
    const [path, setPath] = useState('');

    useEffect(() => {
        if (keyword) setPath('/search/' + keyword);
    }, [keyword]);

    function changeInput(e: React.ChangeEvent<HTMLInputElement>) {
        let keyword = e.target.value;
        setKeyword(keyword);
    }

    function monitorKeyPress(e: React.KeyboardEvent) {
        let code = e.keyCode || e.which;
        if (code === 13) {
            let search = document.getElementById('search');
            if (search) search.click();
            setKeyword('');
        }
    }

    return (
        <header>
            <nav>
                <div id="nav_logo">Masq</div>
                <div id="nav_items">
                    <ul>
                        <li><Link to='/'>Home</Link></li>
                        <li><Link to='/trending'>Trending</Link></li>
                        <li><Link to='/setting'>Setting</Link></li>
                        <li><Link to='/about'>About</Link></li>
                        <li><Link id='search' to={path} /></li>
                    </ul>
                </div>
                <div id="nav_search">
                    <input placeholder="Search" value={keyword} onChange={(e) => changeInput(e)} onKeyPress={(e) => monitorKeyPress(e)} />
                </div>
            </nav> 
        </header>
    );

}