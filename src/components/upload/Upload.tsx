import styles from './Upload.module.css';
import {ChangeEvent, Dispatch, useEffect, useState} from "react";
import axios from "axios";
import {Redirect} from "react-router-dom";

export default function Upload() {

    const [uploadedFiles, setUploadedFiles] = useState<[File, string][]>([]);
    const [progress, setProgress] = useState<{
        [key: string]: number
    }>({});
    const [finished, setFinished] = useState(false);

    async function updateFiles(event: ChangeEvent) {
        const files = (event.currentTarget as HTMLInputElement).files;
        if(files) {
            const mapped: Promise<[File, string]>[] = [...files].map(file => {
                return new Promise(((resolve, reject) => {
                    if(file.type.startsWith('image/')) {
                        let fileReader = new FileReader();
                        fileReader.onload = function() {
                            resolve([file, fileReader.result as string]);
                        }
                        fileReader.onerror = reject;
                        fileReader.readAsDataURL(file);
                    }
                    else if(file.type.startsWith('video/')) {
                        resolve([file, URL.createObjectURL(file)])
                    }
                }))
            });
            const resolved = await Promise.all(mapped);
            setUploadedFiles([...uploadedFiles, ...resolved]);
        }
    }

    async function upload() {
        for(let [file] of uploadedFiles) {
            const form = new FormData();
            form.append('file', file);
            await axios.post('/api/media/upload', form, {
                onUploadProgress: (progressEvent: {loaded: number, total: number}) => {
                    setProgress(oldProgress => ({...oldProgress, [`${file.name}${file.type}${file.size}${file.lastModified}`]: Math.round((progressEvent.loaded / (progressEvent.total + (progressEvent.total * 0.03))) * 100)}))
                },
                headers: {
                    'content-type': 'multipart/form-data'
                }
            });
            setProgress(oldProgress => ({...oldProgress, [`${file.name}${file.type}${file.size}${file.lastModified}`]: 100}))
        }
        setFinished(true);
    }

    if(finished) {
        return <Redirect to="/home"/>
    }
    return <div className={styles.container}>
        <div className={styles.topBar}>
            <div>
                Upload files:
                <input onChange={updateFiles} type="file" multiple/>
            </div>
            <button onClick={upload} disabled={!uploadedFiles.length}>Upload</button>
        </div>
        <div className={styles.fileList}>
            {
                uploadedFiles.map(([file, url]) => {
                    return <div className={styles.file} key={`${file.name}${file.type}${file.size}${file.lastModified}`}>
                        <div className={styles.title}>
                            <div>
                                {file.name}
                            </div>
                            <div>
                                {
                                    progress[`${file.name}${file.type}${file.size}${file.lastModified}`] || 0
                                }%
                            </div>
                        </div>
                        {
                            <progress className={styles.loader} value={progress[`${file.name}${file.type}${file.size}${file.lastModified}`] || 0} max={100}/>
                        }
                        {
                            file.type.startsWith('image/') ? <img className={styles.media} src={url}/>
                                : (file.type.startsWith('video/') ? <video className={styles.media}>
                                <source src={url} type="video/mp4"/>
                                </video>
                                : <div>
                                    No display for file {file.name}
                                </div>)
                        }
                    </div>
                })
            }
        </div>
    </div>
}