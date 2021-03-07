import React, {useEffect, useState} from 'react';
import axios from 'axios';
import styles from './TagSearch.module.css';

export type Tag = {
    id: number,
    namespace: string,
    tagName: string,
    createdAt: string,
    updatedAt: string
}

type TagSearchProps = {
    onTagAdded: (tag: Tag) => void,
    onTagRemoved: (tag: Tag) => void,
    tags: Tag[],
    displayTags: boolean
}

export default function TagSearch({onTagAdded, onTagRemoved, tags, displayTags}: TagSearchProps) {
    const [typedTag, setTypedTag] = useState('');
    const [tagSuggestions, setTagSuggestions] = useState<Tag[]>([]);

    useEffect(() => {
        if(typedTag) {
            const data: {tagName: string, exclude?: number[]} = {
                tagName: typedTag
            }
            if(tags.length) {
                data.exclude = tags.map(t => t.id)
            }
            axios.post('/api/tags/search', data)
                .then(({data}) => {
                    setTagSuggestions(data)
                }).catch(err => {
                    console.error(err);
                })
        }
        else {
            setTagSuggestions([])
        }

    }, [typedTag]);

    function addTag(tag: Tag) {
        if(tags.some(t => t.id === tag.id)) {
            return;
        }
        onTagAdded(tag);
        setTypedTag('');
    }

    function removeTag(tag: Tag) {
        onTagRemoved(tag);
    }

    return <div className={styles.container}>
        <div className={styles.searchContainer}>
            {
                tags.map(tag => {
                    return <div className={styles.tag}>
                        {
                            tag.namespace ? `${tag.namespace}:` : ''
                        }
                        {
                            tag.tagName
                        }
                        <button className={styles.removeTag} onClick={e => removeTag(tag)}>
                            x
                        </button>
                    </div>
                })
            }
            <input className={styles.input} placeholder="Tag Search" value={typedTag} onChange={e => setTypedTag(e.target.value)}/>
        </div>
        <div className={styles.suggestions}>
            {
                tagSuggestions.length ? tagSuggestions.map(tag => {
                    return <div key={tag.id} className={styles.suggestion} onClick={e => addTag(tag)}>
                        {
                            tag.namespace ? `${tag.namespace}:` : ''
                        }
                        {
                            tag.tagName
                        }
                    </div>
                }) : <></>
            }
        </div>
    </div>
}