import React, {useEffect, useState} from 'react';
import axios from 'axios';
import styles from './Home.module.css';
import TagSearch, {Tag} from "../tagSearch/TagSearch";
import Gallery from "../gallery/Gallery";
import {Redirect} from "react-router-dom";

type Media = {
    id: number,
    hash: string,
    mediaType: string,
    width: number,
    height: number,
    duration: number,
    size: number,
    createdAt: string,
    updatedAt: string
}

export default function Home() {

    const [media, setMedia] = useState<Media[]>([])
    const [hasNext, setNext] = useState(false);
    const [afterId, setAfterId] = useState(0);
    const [tags, setTags] = useState<Tag[]>([]);
    const [redirectToUpload, setRedirectToUpload] = useState(false);

    async function fetchNewImages() {
        const result = await axios.post('/api/media/search', {
            tags: tags.map(tag => tag.id),
            after: afterId
        });

        setNext(result.data.hasNext);
        if(result.data.media.length) {
            setMedia([...media, ...result.data.media]);
            setAfterId(result.data.media[result.data.media.length - 1].id);
        }
    }

    useEffect(() => {
        setAfterId(0);
        setMedia([]);
        fetchNewImages();
    }, [tags])

    if(redirectToUpload) {
        return <Redirect to="/upload"/>
    }
    return <div>
        <div className={styles.topBar}>
            <TagSearch onTagsUpdated={setTags}/>
            <button onClick={() => {setRedirectToUpload(true)}}>Up</button>
        </div>
        <Gallery urls={media.map(m => `/api/static/${m.hash}.thumbnail.png`)} hasNext={hasNext} fetchNewImages={fetchNewImages}/>
    </div>

}