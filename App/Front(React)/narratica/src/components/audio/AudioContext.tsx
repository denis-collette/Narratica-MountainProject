'use client';

import { Chapter } from '@/app/api/audio/getAllChaptersFromAudioBookId';
import React, { createContext, useState, useContext, useRef, useEffect } from 'react';

interface AudioContextType {
    audioRef: React.RefObject<HTMLAudioElement | null>;
    audioApiContext: AudioContext | null;
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

export const AudioContext = createContext<AudioContextType | undefined>(undefined);

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

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const audioApiContext = useRef<AudioContext | null>(null);

    useEffect(() => {
        if (!audioApiContext.current) {
            audioApiContext.current = new window.AudioContext();
        }
    }, []);

    const togglePlayPause = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (audioState.isPlaying) {
            audio.pause();
        } else {
            const resume = async () => {
                try {
                    if (audioApiContext.current?.state === 'suspended') {
                        await audioApiContext.current.resume();
                    }
                    await audio.play();
                } catch (error) {
                    console.error('Playback error:', error);
                }
            };
            resume();
        }
        setAudioState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
    };

    const handleVolume = (newVolume: number) => {
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
            setAudioState(prev => ({ ...prev, volume: newVolume }));
        }
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeChange = () => {
            setAudioState(prev => ({
                ...prev,
                currentTime: audio.currentTime,
                progress: (audio.currentTime / audio.duration) * 100,
                duration: audio.duration
            }));
        };

        audio.addEventListener('timeupdate', handleTimeChange);
        return () => audio.removeEventListener('timeupdate', handleTimeChange);
    }, []);

    useEffect(() => {
        const play = () => setAudioState(prev => ({ ...prev, isPlaying: true }));
        const pause = () => setAudioState(prev => ({ ...prev, isPlaying: false }));

        const audio = audioRef.current;
        if (!audio) return;

        audio.addEventListener('play', play);
        audio.addEventListener('pause', pause);
        return () => {
            audio.removeEventListener('play', play);
            audio.removeEventListener('pause', pause);
        };
    }, [audioRef]);

    const formatTime = (time: number): string => {
        if (!time || isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    const seekTo = (progress: number) => {
        const audio = audioRef.current;
        if (audio && audio.duration) {
            audio.currentTime = progress * audio.duration;
        }
    };

    const skipBackward = (seconds: number) => {
        const audio = audioRef.current;
        if (audio) audio.currentTime = Math.max(audio.currentTime - seconds, 0);
    };

    const skipForward = (seconds: number) => {
        const audio = audioRef.current;
        if (audio) audio.currentTime = Math.min(audio.currentTime + seconds, audio.duration);
    };

    const loadChapter = (chapter: Chapter, bookTitle: string, coverImage: string) => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.src = chapter.audio_data;
        audio.load();
        setAudioState(prev => ({
            ...prev,
            audioSource: chapter.audio_data,
            currentChapterTitle: `Chapitre ${chapter.chapter_number}`,
            coverImage,
            bookTitle,
            allChapters: prev.allChapters,
            currentChapterIndex: prev.allChapters.findIndex(ch => ch.chapter_number === chapter.chapter_number)
        }));
        audio.onloadedmetadata = () => setAudioState(prev => ({ ...prev, duration: audio.duration || 0 }));
    };

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
        } else if (audioRef.current) {
            audioRef.current.currentTime = 0;
        }
    };

    const value: AudioContextType = {
        audioRef,
        audioApiContext: audioApiContext.current,
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
            <audio
                id="global-audio"
                ref={audioRef}
                crossOrigin="anonymous"
                style={{ display: 'none' }}
            />
            {children}
        </AudioContext.Provider>
    );
};

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (!context) throw new Error('Erreur avec le contexte audio');
    return context;
};