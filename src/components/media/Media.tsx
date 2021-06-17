import styles from './Media.module.css';
import React, {useEffect, useState} from "react";
import TagSearch, {Tag} from "../tagSearch/TagSearch";
import axios from "axios";

export type MediaType = {
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

type MediaProps = {
    media: MediaType | undefined,
    onExit: () => void
}

export default function Media(props: MediaProps) {

    const [tags, setTags] = useState<Tag[]>([]);

    async function addTag(tag: Tag) {
        setTags([...tags, tag]);
        try {
            await axios.post(`/api/media/${props.media?.id}/tag`, {
                tagId: tag.id
            });
        }
        catch(err) {
            // TODO handle post error
            console.error(err);
            setTags(tags.filter(t => t.id !== tag.id));
        }
    }

    useEffect(() => {
        if(!props.media) {
            return;
        }

        axios.get(`/api/media/${props.media.id}/tags`)
            .then(result => {
                setTags(result.data);
            });
    }, [props.media])

    if(!props.media) {
        return <></>
    }
    return <div className={styles.container}>
        {
            props.media.duration ?
                <video className={styles.media} controls autoPlay>
                    <source src={`/api/media/download/${props.media.hash}.mp4`} type="video/mp4"/>
                </video> :
                <img className={styles.media} src={`/api/media/download/${props.media.hash}.png`}/>
        }
        <div className={styles.exitButton} onClick={props.onExit}>
            Close
        </div>
        <TagSearch onTagAdded={addTag} onTagRemoved={()=>{}} tags={tags} displayTags={false}/>

    </div>

}