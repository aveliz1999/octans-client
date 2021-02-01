import React, {useEffect, useState} from 'react';
import axios from 'axios';
import styles from './Home.module.css';
import TagSearch, {Tag} from "../tagSearch/TagSearch";
import Gallery from "../gallery/Gallery";

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

    async function fetchNewImages() {
        const a = await axios.post('/api/media/search', {
            tags: tags.map(tag => tag.id),
            after: afterId
        });
        if(a.data.length) {
            setMedia(a.data);
            setAfterId(a.data[a.data.length - 1].id);
        }
        // TODO replace with actual check for there being more media
        setNext(true)
    }

    useEffect(() => {
        fetchNewImages();
    }, [tags])

    // TODO replace gallery urls with correct media url
    return <div>
        <div className={styles.topBar}>
            <TagSearch onTagsUpdated={setTags}/>
            <button>Up</button>
        </div>
        <Gallery urls={media.map(m => m.hash)} hasNext={hasNext} fetchNewImages={fetchNewImages}/>
    </div>

}