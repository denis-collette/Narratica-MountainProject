import React from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import { AiOutlineFastBackward, AiOutlineFastForward } from "react-icons/ai";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { useAudio } from "./AudioContext";

// interface AudioPlayerBarProps {
//     isPlaying: boolean;
//     togglePlayPause: () => void;
//     currentChapterTitle?: string;
//     coverImage?: string;
// }

const AudioPlayerBar: React.FC = () => {
    const { isPlaying, togglePlayPause, currentChapterTitle, coverImage, bookTitle, handleVolume } = useAudio();
    console.log("AudioPlayerBar :", currentChapterTitle);
    console.log("AudioPlayerBar :", coverImage);
    console.log('titre - ', bookTitle);
    return (
        <section className="w-full bg-black text-white px-4 py-2 flex items-center justify-between">
            {/* Partie gauche : Cover + titre */}
            <section className="flex items-center gap-4">
                <img
                    src={coverImage}
                    alt={currentChapterTitle}
                    className="w-12 h-12 object-cover rounded"
                />
                <section>
                    <h3 className="text-sm font-semibold">{bookTitle}</h3>
                    <p className="text-xs text-gray-400">{currentChapterTitle}</p>
                </section>
            </section>

            {/* Partie centrale : boutons + barre */}
            <section className="flex flex-col items-center justify-center gap-1 flex-1 max-w-xl">
                <section className="flex items-center gap-4">
                    <button className="p-2 rounded-md hover:bg-white/10">
                        <AiOutlineFastBackward />
                    </button>
                    <button className="p-2 rounded-md hover:bg-white/10">
                        <FaAngleDoubleLeft />
                    </button>
                    <button onClick={togglePlayPause} className="p-2 rounded-full hover:bg-white/10">
                        {isPlaying ? <FaPause /> : <FaPlay />}
                    </button>
                    <button className="p-2 rounded-md hover:bg-white/10">
                        <FaAngleDoubleRight />
                    </button>
                    <button className="p-2 rounded-md hover:bg-white/10">
                        <AiOutlineFastForward />
                    </button>
                </section>
                <section className="flex items-center gap-2 w-full">
                    <span className="text-xs">ActualTime</span>
                    <section className="flex-1 h-1 bg-gray-700 rounded">
                        <section className="h-1 bg-green-500 w-1/4 rounded"></section>
                    </section>
                    <span className="text-xs">Time</span>
                </section>
            </section>

            {/* Partie droite : volume */}
            <section className="flex items-center gap-2 w-32">
                <HiSpeakerWave className="w-5 h-5" />
                <input type="range" min="0" max="100" className="w-full accent-green-400"
                    onChange={(e) => handleVolume(Number(e.target.value) / 100)} />
            </section>
        </section>
    );
};

export default AudioPlayerBar;