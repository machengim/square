import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import Cookie from 'js-cookie';

// css in '../index.css'.
export default function Footer() {
    const start = 2020;
    const current = new Date().getFullYear();
    const text = (current > start)? start + '-' + current: start;
    const site = 'Masq.xyz';
    const [showNote, setShowNote] = useState(Cookie.get('first') === undefined && Cookie.get('u') === undefined);

    Cookie.set('first', 'f', { expires: 7 });

    return (
        <>        
            <footer>
                Copyright {site} {text} test version.
            </footer>
            {showNote && <FootNote onClose={() => setShowNote(false)} />}
        </>
    );
}

function FootNote(props: any) {

    let handleClose = props.onClose;

    return (
        <div id='foot-note'>
            <span className="close" onClick={() => handleClose()}>&times;</span><br/>
            This website is in test version. All data and inputs may be cleared.<br />
            We use cookie. Check our <Link to='/about/cookie' onClick={() => handleClose()}>cookie policy</Link> for more information.
        </div>
    )
}
