import React from 'react';
import {Link, useParams} from 'react-router-dom';

export default function About() {
    const {type} = useParams();
    console.log('type is ' + type);

    return (
        <main>
            <div id='wrapper'>
                <article>
                    {type === 'cookie' && <CookiePolicy />}
                    {type === 'why-masq' && <WhyMasq />}
                </article>

            </div>
        </main>
    )
}

function CookiePolicy() {
    return (
        <div>
            <div className='title'>Cookie Policy</div>
            <div className='subtitle'>About Cookie</div> 
            <p>A cookie is a small piece of text stored in your computer which helps the website to remember information about your visit.
            It could help to improve the experience of using the web.</p>
            
            <div className='subtitle'>How Masq uses cookies </div>
            <p>Three cookies are used in Masq.xyz: </p>
            <li><span className='code'>first</span>: used to display the cookie-policy for the fist-time visitors.   </li>
            <li><span className='code'>JSESSIONID</span>: used to remember the current session between your computer and our server. This cookie expires after 20 minutes of the last activity between you and the website. </li>
            <li><span className='code'>u</span>: used to remember whether you have logged in. It lives for 7 days so you don't need to re-login within that period as long as you use the same browser on the same device. </li>
            <p>Masq.xyz doen's not use any of its cookies to track your information across sites.</p>
            <div className='subtitle'>What if I turn of cookies</div>
            <p>Everything still works fine except you cannot log in or use features that required login, such as changing setting and search.</p>
        </div>
    );
}

function WhyMasq() {
    return (
        <div>
            <div className='title'>Why Masq</div>
            <div className='subtitle'>Privacy</div> 
            <p> As an anonymous social platform, you do not need to give us any real information, eg. your email, name, etc. and you can change your nickname anytime you want. No user can read your posts unless you make them public, nor can another user track your posting history.</p>
            <div className='subtitle'>Security</div>
            <p>The cookie usage is limited at a very minimal level, <Link to='/about/cookie'>as described here</Link>. The whole project is open sourced on <a href='https://github.com/machengim/square'>github</a>.</p>
        </div>
    );
}