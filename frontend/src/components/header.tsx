import React from 'react';
import {Link} from 'react-router-dom';
import './header.css';

export default function Header() {
    return (
      <header>
        <nav>
            <div id="nav_logo">Square</div>
            <div id="nav_items">
                <ul>
                    <li><Link to='/'>Home</Link></li>
                    <li><Link to='/trending'>Trending</Link></li>
                    <li><Link to='/setting'>Setting</Link></li>
                    <li><Link to='/about'>About</Link></li>
                </ul>
            </div>
            <div id="nav_search">
                <input placeholder="Search" />
            </div>
        </nav> 
    </header>
    );
}