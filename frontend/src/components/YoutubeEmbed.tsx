type Props = {
    videoId: string;
    title: string;
};

export default function YoutubeEmbed({videoId, title}: Props) {
    return(
        <>
        <div className="ratio ratio-16x9 shadow-sm rounded overflow-hidden">
            <iframe
                src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                title={title}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"                
            />
        </div>
        </>
    )
}