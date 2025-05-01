"use client"
import { Chapter } from '@/app/api/audio/getAllChaptersFromAudioBookId';
import React, { createContext, useState, useContext, useRef, useEffect } from 'react';

interface AudioContextType {
    audioState: AudioState;
    setAudioState: React.Dispatch<React.SetStateAction<AudioState>>;
    togglePlayPause: () => void;
    handleVolume: (newVolume: number) => void;
    formatTime: (time: number) => string;
    seekTo: (progress: number) => void;
    skipForward: (seconds: number) => void;
    skipBackward: (seconds: number) => void;
    loadChapter: (chapter: Chapter, bookTitle: string, coverImage: string) => void;
    nextChapter: () => void;
    previousChapter: () => void;
}

interface AudioState {
    audioSource: string | null;
    isPlaying: boolean;
    currentChapterTitle: string | undefined;
    coverImage: string | undefined;
    bookTitle: string | undefined;
    volume: number;
    currentTime: number;
    duration: number;
    progress: number;
    allChapters: Chapter[];
    currentChapterIndex: number;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [audioState, setAudioState] = useState<AudioState>({
        audioSource: null,
        isPlaying: false,
        currentChapterTitle: undefined,
        coverImage: undefined,
        bookTitle: undefined,
        volume: 1,
        currentTime: 0,
        duration: 0,
        progress: 0,
        allChapters: [],
        currentChapterIndex: 0
    });

    const audioReference = useRef<HTMLAudioElement>(null);

    const togglePlayPause = () => {
        if (audioReference.current) {
            if (audioState.isPlaying) {
                audioReference.current.pause();
            } else {
                audioReference.current.play();
            }
            setAudioState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
        }
    };

    const handleVolume = (newVolume: number) => {
        if (audioReference.current) {
            audioReference.current.volume = newVolume
            setAudioState((prev) => ({ ...prev, volume: newVolume }));
        }
    }
    useEffect(() => {
        const audio = audioReference.current

        if (audio) {
            const handleTimeChange = () => {
                setAudioState((prev) => ({
                    ...prev,
                    currentTime: audio.currentTime,
                    progress: (audio.currentTime / audio.duration) * 100,
                    duration: audio.duration
                }));
            }

            audio?.addEventListener('timeupdate', handleTimeChange);

            return () => {
                audio?.removeEventListener('timeupdate', handleTimeChange);
            };
        }
    }, [])

    useEffect(() => {
        const play = () => setAudioState((prev => ({ ...prev, isPlaying: true })))
        const pause = () => setAudioState((prev => ({ ...prev, isPlaying: false })))

        const audio = audioReference.current;

        if (audio) {
            audio.addEventListener('play', play);
            audio.addEventListener('pause', pause);

            return () => {
                audio?.removeEventListener('play', play);
                audio?.removeEventListener('pause', pause);
            };
        }
    }, [audioReference]);

    const formatTime = (time: number): string => {
        if (!time || isNaN(time)) return "0:00"
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60).toString().padStart(2, "0")
        return `${minutes}:${seconds}`
    };


    const seekTo = (progress: number) => {
        if (audioReference.current && audioReference.current.duration) {
            audioReference.current.currentTime = progress * audioReference.current.duration;
        }
    };

    const skipBackward = (seconds: number) => {
        if (audioReference.current) {
            audioReference.current.currentTime = Math.max(
                audioReference.current.currentTime - seconds, 0
            )
        }
    }

    const skipForward = (seconds: number) => {
        if (audioReference.current) {
            audioReference.current.currentTime = Math.min(
                audioReference.current.currentTime + seconds,
                audioReference.current.duration
            )
        }
    }

    const loadChapter = (chapter: Chapter, bookTitle: string, coverImage: string) => {
        const audio = audioReference.current;
        if (!audio) return;

        audio.src = chapter.audio_data;
        audio.load();
        setAudioState((prev) => ({
            ...prev,
            audioSource: chapter.audio_data,
            currentChapterTitle: `Chapitre ${chapter.chapter_number}`,
            coverImage: coverImage,
            bookTitle: bookTitle,
            allChapters: prev.allChapters,
            currentChapterIndex: prev.allChapters.findIndex(
                (ch) => ch.chapter_number === chapter.chapter_number),
        }));
        audio.onloadedmetadata = () => {
            setAudioState((prev) => ({
                ...prev,
                duration: audio.duration || 0,
            }));
        }
    }

    const nextChapter = () => {
        const next = audioState.currentChapterIndex + 1;
        if (next < audioState.allChapters.length) {
            loadChapter(audioState.allChapters[next], audioState.bookTitle!, audioState.coverImage!);
        }
    };

    const previousChapter = () => {
        const prev = audioState.currentChapterIndex - 1;
        if (prev >= 0) {
            loadChapter(audioState.allChapters[prev], audioState.bookTitle!, audioState.coverImage!);
        } else if (audioReference.current) {
            audioReference.current.currentTime = 0;
        }
    }

    // useEffect(() => {
    //     if (audioReference.current) {
    //         audioReference.current.src = audioState.audioSource || '';
    //         audioReference.current.load();
    //         setAudioState((prev) => ({ ...prev, isPlaying: false }));
    //     }
    // }, [audioState.audioSource]);

    const value = {
        audioState,
        setAudioState,
        togglePlayPause,
        handleVolume,
        formatTime,
        seekTo,
        skipForward,
        skipBackward,
        nextChapter,
        previousChapter,
        loadChapter
    };

    return (
        <AudioContext.Provider value={value}>
            <audio ref={audioReference} style={{ display: "none" }} />
            {children}
        </AudioContext.Provider>
    )
}

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error("Erreur avec le contexte audio");
    }
    return context;
};