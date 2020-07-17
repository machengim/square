import React, {useState} from 'react';
import './panel.css';

export default function Panel() {
    const [changing, setChanging] = useState(false);
    const [btnText, setBtnText] = useState('Change');

    function clickChangeButton() {
        if (changing) {
            //TODO: submit changed nickname.
        }
        else
            setBtnText('Submit');
    }

    return (
        <div className="aside">
            <div className="panel">
                <p> </p>
                <div id="nickname">Harry</div>
                <button id="btn_change_name" onClick={() => clickChangeButton()}>{btnText}</button>
                <hr />
                <ul>
                    <li>Posts: <a>0</a></li>
                    <li>Marked: <a>0</a></li>
                    <li>Comments: <a>0</a></li>
                </ul>
                <hr />
                <div className="center">
                    <button id="button_logout">Logout</button>
                </div>
            </div>
        </div>
    );
}