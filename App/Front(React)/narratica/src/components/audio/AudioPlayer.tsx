import React from 'react'
type AudioPlayerProps = {
    src: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src }) => {
    return (
        <section className="p-5 bg-gray-300 rounded">
            <audio controls>
                <source src={src}/>
                Test audio
            </audio>
        </section>
    )
}

export default AudioPlayer