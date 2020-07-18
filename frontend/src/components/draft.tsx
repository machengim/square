import React, {useState, useEffect, ChangeEvent } from 'react';
import './draft.css';

/**
 * TODO: form submit validation;
 *       file size limit.
 */
export default function Draft() {
    const [writing, setWriting] = useState(false);
    const [anonymous, setAnonymous] = useState(false);
    const [isPrivate, setPrivate] = useState(false);
    const [btnText, setBtnText] = useState("Choose image");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        let limit = 15;     // max length of the text shown on the 'Choose image' button.

        if (selectedFile) {     // means 'selectedFile' is not null, undefined, 0, empty or false.
            let name = selectedFile.name;
            if (name.length > limit) name = '..' + name.slice(-limit, );
            setBtnText(name);
        } else {
            setBtnText('Choose image');
        }
    }, [selectedFile]);

    function triggerSelectFile(): void {
        let element = document.getElementById('file');
        if (element)
            element.click();
    }

    function handleFileChange(event: ChangeEvent<HTMLInputElement>): void {
        if (event.target.files)
            setSelectedFile(event.target.files[0]);
    }

    return (
        <div id="draft_area">
            <span>Write a post:<br/></span>
            <textarea name="draft" className={writing? 'selected': ''}
                placeholder="Share your thought" onFocus={() =>setWriting(true)} />
            <button className={writing? '': 'hidden'} onClick={() => setWriting(false)}>Collapse</button>
            <div id="draft_toolbar" className={writing? '': 'hidden'}>
                <input type="file" id="file" name="file" accept=".jpg,.jpeg,.png,.bmp,.gif" onChange={(e) => handleFileChange(e)} />
                <button id='select_file' onClick={() => triggerSelectFile()}>{btnText}</button>
                <input type="checkbox" name="is_anonymous" checked={anonymous} onChange={() => setAnonymous(!anonymous)}/>
                <label>Anonymous</label>
                <input type="checkbox" name="is_private" checked={isPrivate} onChange={() => setPrivate(!isPrivate)} />
                <label>Private</label>
                <button>Send</button>
            </div>
        </div>
    );
}