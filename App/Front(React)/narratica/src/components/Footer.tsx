'use client'
import React from 'react'
// import { useAudio } from './audio/AudioContext'
import AudioPlayerBar from './audio/AudioPlayerBar';

const Footer = () => {
    // const { audioSource, isPlaying, togglePlayPause, currentChapterTitle, coverImage } = useAudio();

    // if (!audioSource) {
    //     return null
    // }

    return (
        <section>
            {/* <AudioPlayerBar isPlaying={isPlaying} togglePlayPause={togglePlayPause} /> */}
            {/* <AudioPlayerBar
                isPlaying={isPlaying}
                togglePlayPause={togglePlayPause}
                currentChapterTitle={currentChapterTitle}
                coverImage={coverImage}
            /> */}
            <AudioPlayerBar />
        </section>
    )
}

export default Footer