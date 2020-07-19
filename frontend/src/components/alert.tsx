import React from 'react';
import {AlertBoxProps} from "../lib/interfaces";
import './alert.css';

/**
 * This component hasn't been used but is left here for future consideration.
 */
export default function Alert(props: AlertBoxProps) {
    const text = props.text;

    function closeAlert() {
        let alertDiv = document.getElementById('alert');
        if (alertDiv) {
            alertDiv.style.display = 'none';
        }
        props.onClose();
    }

    return (
        <div id='alert' className='alert'>
            <span className='closebtn' onClick={() => closeAlert()}>&times;</span>
            {text}
            <button onClick={() => props.onConfirm()}>Confirm</button>
        </div>
    )
}