import React from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import { AiOutlineFastBackward, AiOutlineFastForward } from "react-icons/ai";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { useAudio } from "./AudioContext";

/**
 * Barre de contrôle du lecteur audio.
 * Affiche les infos du chapitre courant, les contrôles de lecture,
 * la barre de progression et le volume.
 */
const AudioPlayerBar: React.FC = () => {
    // #region Hooks et extraction du contexte
    const {
        audioState,
        togglePlayPause,
        handleVolume,
        formatTime,
        seekTo,
        skipBackward,
        skipForward,
        nextChapter,
        previousChapter
    } = useAudio();

    const {
        isPlaying,
        currentChapterTitle,
        coverImage,
        bookTitle,
        currentTime,
        duration,
        volume
    } = audioState;
    // #endregion

    // #region Rendu JSX
    return (
        <section className="fixed bottom-0 left-0 right-0 w-full bg-black text-white px-4 py-2 flex items-center justify-between h-[80px]">
            {/* #region Partie gauche : couverture et titre */}
            <section className="w-1/4 flex items-center gap-4">
                {coverImage && (
                    <img
                        src={coverImage}
                        alt={currentChapterTitle}
                        className="w-12 h-12 object-cover rounded"
                    />
                )}
                <section>
                    <h3 className="text-sm font-semibold">{bookTitle}</h3>
                    <p className="text-xs text-gray-400">{currentChapterTitle}</p>
                </section>
            </section>
            {/* #endregion */}

            {/* #region Partie centrale : boutons de lecture et barre de progression */}
            <section className="flex-1 flex flex-col items-center justify-center gap-1 max-w-2xl mx-auto px-4">
                {/* Contrôles de lecture */}
                <section className="flex items-center justify-center gap-4 w-full">
                    <button className="p-2 rounded-md hover:bg-white/10" onClick={previousChapter}>
                        <AiOutlineFastBackward />
                    </button>
                    <button className="p-2 rounded-md hover:bg-white/10" onClick={() => skipBackward(10)}>
                        <FaAngleDoubleLeft />
                    </button>
                    <button onClick={togglePlayPause} className="p-2 rounded-full hover:bg-white/10">
                        {isPlaying ? <FaPause /> : <FaPlay />}
                    </button>
                    <button className="p-2 rounded-md hover:bg-white/10" onClick={() => skipForward(10)}>
                        <FaAngleDoubleRight />
                    </button>
                    <button className="p-2 rounded-md hover:bg-white/10" onClick={nextChapter}>
                        <AiOutlineFastForward />
                    </button>
                </section>

                {/* Barre de progression */}
                <section className="flex items-center gap-2 w-full">
                    <span className="text-xs">
                        {!isNaN(currentTime) && currentTime ? formatTime(currentTime) : "0:00"}
                    </span>

                    <input
                        type="range"
                        min="0"
                        max={!isNaN(duration) && duration ? duration : 0}
                        value={!isNaN(currentTime) && currentTime ? currentTime : 0}
                        onChange={(e) => seekTo(Number(e.target.value) / (!isNaN(duration) && duration ? duration : 1))}
                        className="flex-1 h-1 accent-green-500 cursor-pointer"
                    />

                    <span className="text-xs">
                        {!isNaN(duration) && duration ? formatTime(duration) : "0:00"}
                    </span>
                </section>
            </section>
            {/* #endregion */}

            {/* #region Partie droite : contrôle du volume */}
            <section className="w-1/4 flex items-center justify-end gap-2">
                {volume === 0 ? (
                    <HiSpeakerXMark className="w-5 h-5" />
                ) : (
                    <HiSpeakerWave className="w-5 h-5" />
                )}
                <input
                    type="range"
                    min="0"
                    max="100"
                    className="w-32 accent-green-400"
                    onChange={(e) => handleVolume(Number(e.target.value) / 100)}
                />
            </section>
            {/* #endregion */}
        </section>
    );
    // #endregion
};

export default AudioPlayerBar;
