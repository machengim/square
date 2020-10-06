import React, {useState, useEffect} from 'react';
import { ImageList } from '../lib/interfaces';
import { BaseUrl } from '../lib/utils';
import './lightbox.css';


/**
 ** Currently only one image is used in lightbox.
 */
export default function Lightbox(props: ImageList) {
    const [images] = useState(props.value);
    const [length] = useState(props.value.length);
    const [showModal, setShowModal] = useState(false);
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        // note this line should put before modal check to 
        // prevent the scrollbar from missing after closing a modal.
        document.body.style.overflow = (showModal)? 'hidden': 'auto';

        let modal = document.getElementById('lightbox');
        if (!modal) return;
        modal.style.display = (showModal)? 'block': 'none';
    }, [showModal]);

    if (!images || length === 0) return null;

    function moveIndex(index: number) {
        let temp = current + index;
        if (temp < 0) temp += length;
        if (temp >= length) temp -= length;
        setCurrent(temp);
    }

    return (
        <>
            <div className="attachments">
                {images.map((i, id) => <img key={id} src={BaseUrl + i.thumbnail} alt=''
                 onClick={() => {setCurrent(id); setShowModal(true)}}/>
                )}
            </div>
            
            {showModal && (
                <div id='lightbox' className='lightbox'>
                    <span className="close cursor" onClick={() => setShowModal(false)}>&times;</span>
                    <img src={BaseUrl + images[current].url} alt='' onClick={() => moveIndex(1)} />
                </div>
            )}
        </>
    )

}