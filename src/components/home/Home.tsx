import React, {useEffect, useState} from 'react';
import axios from 'axios';
import styles from './Home.module.css';
import TagSearch, {Tag} from "../tagSearch/TagSearch";
import Gallery from "../gallery/Gallery";
import {Redirect} from "react-router-dom";
import {MediaType} from "../media/Media";

export default function Home() {

    const [media, setMedia] = useState<MediaType[]>([])
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

    function addTag(tag: Tag) {
        setTags([...tags, tag]);
    }

    function removeTag(tag: Tag) {
        setTags(tags.filter(t => t.id !== tag.id));
    }

    useEffect(() => {
        setAfterId(0);
        setMedia([]);
    }, [tags])

    useEffect(() => {
        fetchNewImages();
    }, [media]);

    if(redirectToUpload) {
        return <Redirect to="/upload"/>
    }
    return <div>
        <div className={styles.topBar}>
            <TagSearch onTagAdded={addTag} onTagRemoved={removeTag} tags={tags} displayTags={true}/>
            <button onClick={() => {setRedirectToUpload(true)}}>Up</button>
        </div>
        <Gallery media={media} hasNext={hasNext} fetchNewImages={fetchNewImages}/>
    </div>

}