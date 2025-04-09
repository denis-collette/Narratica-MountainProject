import React from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import { AiOutlineFastBackward, AiOutlineFastForward } from "react-icons/ai";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";

interface AudioPlayerBarProps {
    isPlaying: boolean;
    togglePlayPause: () => void;
}

const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({ isPlaying, togglePlayPause }) => {
    return (
        <section className="w-full bg-black text-white px-4 py-2 flex items-center justify-between">
            {/* Partie gauche : Cover + titre */}
            <section className="flex items-center gap-4">
                <img
                    src="/"
                    alt=""
                    className="w-12 h-12 object-cover rounded"
                />
                <section>
                    <h3 className="text-sm font-semibold">Test</h3>
                    <p className="text-xs text-gray-400">Titre</p>
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
                <input type="range" min="0" max="100" className="w-full accent-green-400" />
            </section>
        </section>
    );
};

export default AudioPlayerBar;