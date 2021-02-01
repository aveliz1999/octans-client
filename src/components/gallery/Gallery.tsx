import React, {useEffect, useState} from 'react';
import axios from 'axios';
import styles from './Gallery.module.css';

type GalleryProps = {
    urls: string[],
    hasNext: boolean,
    fetchNewImages: () => void
}

export default function Gallery(props: GalleryProps) {
    return <div>
        <div className={styles.gallery}>
            {
                props.urls.map(url => <img className={styles.image} key={url} src={url}/>)
            }
        </div>
        {
            props.hasNext && <button className={styles.moreButton} onClick={props.fetchNewImages}>More...</button>
        }
    </div>
}