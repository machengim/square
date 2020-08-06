import React, {useState, useEffect, ChangeEvent, useContext, useRef} from 'react';
import { PostRequest} from '../lib/interfaces';
import { AppContext, UserContext } from './context';
import { postRequest, BaseUrl } from '../lib/utils';
import './draft.css';

/**
 * TODO: form submit validation;
 *       file size limit.
 */
export default function Draft() {
    const appCtx = useContext(AppContext);
    const userCtx = useContext(UserContext);
    const [user, setUser] = useState(userCtx.user);
    const [writing, setWriting] = useState(false);
    const [content, setContent] = useState('');
    const [anonymous, setAnonymous] = useState(false);
    const [isPrivate, setPrivate] = useState(false);
    const [btnText, setBtnText] = useState('Choose image');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [sending, setSending] = useState(false);
    const fileSelector = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setUser(userCtx.user);
    }, [userCtx]);

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
        if (fileSelector && fileSelector.current) {
            fileSelector.current.click();
        }
    }

    function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
        if (event.target.files) {
            let file = event.target.files[0];
            if (checkChosenFile(file)) {
                setSelectedFile(file);
            }
        }
    }

    function checkChosenFile(file: File): boolean {
        if (!file) {
            alert('No file found.');
            return false;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert('Max file size is 5MB.');
            return false;
        } else if (!file.type.includes('image')) {
            alert('Only image file allowed.');
            return false;
        }

        return true;
    }


    function handleTextChange(event: ChangeEvent<HTMLTextAreaElement>, func: Function) {
        func(event.target.value);
    }

    function toBase64(file: File) {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                if (reader && reader.result)
                    resolve(reader.result.toString());
            }

            reader.onerror = reject;
        });
    }

    async function uploadPost() {
        let imageStr = '';
        if (selectedFile) {
            imageStr = await toBase64(selectedFile);
        } else if (content.trim().length === 0) {
            alert('No content found.');
            return;
        }

        let username = (anonymous)? 'Anonymous': user.uname;
        const post: PostRequest = {
            uid: (user.uid)? user.uid: -1,
            uname: username,
            anonymous: anonymous,
            content: content,
            ctime: new Date(),
            status: (isPrivate)? 0: 1,
            image: (imageStr)? imageStr: null,
        };

        setSending(true);
        postRequest(BaseUrl + 'posts', JSON.stringify(post), postDone, postFail);
    }

    // TODO: refresh postlist.
    function postDone(res: globalThis.Response) {
        setContent('');
        setSelectedFile(null);
        setSending(false);
        if (appCtx.setUpdatePosts) {
            appCtx.setUpdatePosts(true);
        }
        if (appCtx.setUpdateUser) {
            appCtx.setUpdateUser(true);
        }
    }

    function postFail(res: globalThis.Response) {
        setSending(false);
        alert(res);
    }

    return (
        <div id='draft_area'>
            <span>Write a post:<br/></span>
            <textarea name='draft' value={content} className={writing? 'selected': ''}
                placeholder='Share your thought' onFocus={() =>setWriting(true)}
                onChange={(e) => handleTextChange(e, setContent)} />
            <button className={writing? '': 'hidden'} onClick={() => setWriting(false)}>Collapse</button>
            <div id='draft_toolbar' className={writing? '': 'hidden'}>
                <input type='file' id='file' name='file' ref={fileSelector} accept='.jpg,.jpeg,.png,.bmp,.gif' onChange={(e) => handleFileChange(e)} />
                <button id='select_file' onClick={() => triggerSelectFile()}>{btnText}</button>
                <input type='checkbox' name='is_anonymous' checked={anonymous} onChange={() => setAnonymous(!anonymous)}/>
                <label>Anonymous</label>
                <input type='checkbox' name='is_private' checked={isPrivate} onChange={() => setPrivate(!isPrivate)} />
                <label>Private</label>
                {!sending && <button onClick={() => uploadPost()}>Send</button>}
                {sending && <button disabled>Send</button>}
            </div>
        </div>
    );
}