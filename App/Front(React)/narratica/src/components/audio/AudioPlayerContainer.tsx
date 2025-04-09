import React, { useRef, useState } from 'react'

interface PlayerProps {
    audioSource: string;
}

const AudioPlayerContainer: React.FC<PlayerProps> = ({ audioSource }) => {

    const audioReference = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlayPause = () => {
        if (!audioReference.current) {
            return;
        }

        if (isPlaying) {
            audioReference.current.pause()
        } else {
            audioReference.current.play()
        }

        setIsPlaying(!isPlaying);
    }


    return (
        <section className="p-4 bg-gray-900 text-white">
            <audio
                ref={audioReference}
                src={audioSource}
                hidden
            />
            <button
                onClick={togglePlayPause}
                className="px-4 py-2 bg-green-600 rounded"
            >
                {isPlaying ? "Pause" : "Play"}
            </button>
        </section>
    )
}

export default AudioPlayerContainer