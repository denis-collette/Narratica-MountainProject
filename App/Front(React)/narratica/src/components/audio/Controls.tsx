import React from "react";
import {
    BsFillPlayFill,
    BsFillPauseFill,
    BsSkipStartFill,
    BsSkipEndFill
} from 'react-icons/bs';

interface AudioControlsProps {
    isPlaying: boolean;
    onPlayPauseClick: (isPlaying: boolean) => void;
    onPrevClick: () => void;
    onNextClick: () => void;
}

const AudioControls: React.FC<AudioControlsProps> = ({
    isPlaying,
    onPlayPauseClick,
    onPrevClick,
    onNextClick
}) => (
    <div className="audio-controls">
        <button
            type="button"
            className="prev"
            aria-label="Previous"
            onClick={onPrevClick}
        >
            <BsSkipStartFill />
        </button>
        {isPlaying ? (
            <button
                type="button"
                className="pause"
                onClick={() => onPlayPauseClick(false)}
                aria-label="Pause"
            >
                <BsFillPauseFill />
            </button>
        ) : (
            <button
                type="button"
                className="play"
                onClick={() => onPlayPauseClick(true)}
                aria-label="Play"
            >
                <BsFillPlayFill />
            </button>
        )}
        <button
            type="button"
            className="next"
            aria-label="Next"
            onClick={onNextClick}
        >
            <BsSkipEndFill />
        </button>
    </div>
);

export default AudioControls;