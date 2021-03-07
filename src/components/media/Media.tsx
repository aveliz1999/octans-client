import styles from './Media.module.css';

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
    </div>

}