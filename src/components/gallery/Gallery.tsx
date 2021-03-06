import React, {useEffect, useState} from 'react';
import styles from './Gallery.module.css';
import Media, {MediaType} from "../media/Media";

type GalleryProps = {
    media: MediaType[],
    hasNext: boolean,
    fetchNewImages: () => void
}

export default function Gallery(props: GalleryProps) {
    const [currentMedia, setCurrentMedia] = useState<MediaType | undefined>();
    const [currentScroll, setCurrentScroll] = useState(0);

    useEffect(() => {
        if(!currentMedia) {
            window.scroll(0, currentScroll);
        }
    }, [currentMedia]);

    return <div>
        <Media media={currentMedia} onExit={() => {
            setCurrentMedia(undefined);
        }}/>
        {
            !currentMedia && <>
                <div className={styles.gallery}>
                    {
                        props.media.map(media => <img className={styles.image} key={media.id} src={`/api/media/${media.hash}/true.png`} onClick={() => {
                            setCurrentScroll(window.scrollY);
                            setCurrentMedia(media);
                        }}/>)
                    }
                </div>
                {
                    props.hasNext && <button className={styles.moreButton} onClick={props.fetchNewImages}>More...</button>
                }
            </>
        }
    </div>
}