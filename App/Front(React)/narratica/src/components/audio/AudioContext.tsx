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
    // audioSource: string | null;
    // setAudioSource: React.Dispatch<React.SetStateAction<string | null>>;
    // isPlaying: boolean;
    // togglePlayPause: () => void;
    // currentChapterTitle: string | undefined;
    // setCurrentChapterTitle: React.Dispatch<React.SetStateAction<string | undefined>>;
    // coverImage: string | undefined;
    // setCoverImage: React.Dispatch<React.SetStateAction<string | undefined>>;
    // bookTitle: string | undefined;
    // setBookTitle: React.Dispatch<React.SetStateAction<string | undefined>>;
    // audioReference: React.RefObject<HTMLAudioElement | null>;
    // setVolume: React.Dispatch<React.SetStateAction<number>>;
    // handleVolume: (newVolume: number) => void;
    // // handleTime: (newTime: number) => void;
    // currentTime: number;
    // duration: number;
    // progress: number;
    // formatTime: (time: number) => string;
    // seekTo: (progress: number) => void;
    // skipBackward: (seconds: number) => void;
    // skipForward: (seconds: number) => void;
    // allChapters: Chapter[];
    // setAllChapters: React.Dispatch<React.SetStateAction<Chapter[]>>;
    // nextChapter: () => void;
    // previousChapter: () => void;
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

    // const [audioSource, setAudioSource] = useState<string | null>(null);
    // const [isPlaying, setIsPlaying] = useState<boolean>(false);
    // const [currentChapterTitle, setCurrentChapterTitle] = useState<string | undefined>(undefined);
    // const [coverImage, setCoverImage] = useState<string | undefined>(undefined);
    // const [bookTitle, setBookTitle] = useState<string | undefined>(undefined);
    // const [volume, setVolume] = useState<number>(1);
    // const [currentTime, setCurrentTime] = useState<number>(0);
    // const [duration, setDuration] = useState<number>(0);
    // const [progress, setProgress] = useState<number>(0);
    // const audioReference = useRef<HTMLAudioElement>(null);
    // const [allChapters, setAllChapters] = useState<Chapter[]>([]);
    // const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);

    const togglePlayPause = () => {
        if (audioReference.current) {
            if (audioState.isPlaying) {
                audioReference.current.pause();
            } else {
                audioReference.current.play();
            }
            // setIsPlaying(!isPlaying);
            setAudioState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
        }
    };

    const handleVolume = (newVolume: number) => {
        if (audioReference.current) {
            audioReference.current.volume = newVolume
            // setVolume(newVolume)
            setAudioState((prev) => ({ ...prev, volume: newVolume }));
        }
    }
    useEffect(() => {
        const audio = audioReference.current

        if (audio) {
            const handleTimeChange = () => {
                // setCurrentTime(audio.currentTime)
                // setProgress((audio.currentTime / audio.duration) * 100)
                // setDuration(audio.duration)
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
        setAudioState((prev) => ({
            ...prev,
            audioSource: chapter.audio_data,
            currentChapterTitle: `Chapitre ${chapter.chapter_number}`,
            coverImage: coverImage,
            bookTitle: bookTitle,
            allChapters: prev.allChapters,
            currentChapterIndex: prev.allChapters.findIndex(
                (ch) => ch.chapter_number === chapter.chapter_number),
        }))
    }
    // setAudioSource(chapter.audio_data)
    // setCurrentChapterTitle(`Chapitre ${chapter.chapter_number}`)
    // setCoverImage(chapter.cover_art_thumbnail)
    // setBookTitle(`Livre ${chapter.book}`)
    // setCurrentChapter(chapter);

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

    useEffect(() => {
        if (audioReference.current) {
            audioReference.current.src = audioState.audioSource || '';
            audioReference.current.load();
            // setIsPlaying(false);
            setAudioState((prev) => ({ ...prev, isPlaying: false }));
        }
    }, [audioState.audioSource]);

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
            <audio ref={audioReference} />
            {children}
        </AudioContext.Provider>
    )

    // audioSource,
    // setAudioSource,
    // isPlaying,
    // togglePlayPause,
    // currentChapterTitle,
    // setCurrentChapterTitle,
    // coverImage,
    // setCoverImage,
    // bookTitle,
    // setBookTitle,
    // audioReference,
    // volume,
    // setVolume,
    // handleVolume,
    // currentTime,
    // duration,
    // setCurrentTime,
    // setDuration,
    // progress,
    // setProgress,
    // formatTime,
    // seekTo,
    // skipForward,
    // skipBackward,
    // allChapters,
    // setAllChapters,
    // nextChapter,
    // previousChapter
}

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error("Erreur avec le contexte audio");
    }
    return context;
};


// "use client"
// import React, { createContext, useContext, useState, ReactNode } from "react";

// interface AudioContextType {
//     audioSource: string | null;
//     setAudioSource: (source: string) => void;
//     isPlaying: boolean;
//     togglePlayPause: () => void;
// };

// const AudioContext = createContext<AudioContextType | undefined>(undefined);

// export const AudioProvider = ({ children }: { children: ReactNode }) => {
//     const [audioSource, setAudioSource] = useState<string | null>(null);
//     const [isPlaying, setIsPlaying] = useState<boolean>(false);
//     const audioReference = React.useRef<HTMLAudioElement>(null);

//     const togglePlayPause = () => {
//         if (!audioReference.current) {
//             return;
//         }

//         if (isPlaying) {
//             audioReference.current.pause();
//         } else {
//             audioReference.current.play();
//         }
//         setIsPlaying(!isPlaying);
//     };

//     React.useEffect(() => {
//         if (audioReference.current) {
//             audioReference.current.addEventListener('play', () => setIsPlaying(true));
//             audioReference.current.addEventListener('pause', () => setIsPlaying(false));

//             return () => {
//                 audioReference.current?.removeEventListener('play', () => setIsPlaying(true));
//                 audioReference.current?.removeEventListener('pause', () => setIsPlaying(false));
//             };
//         }
//     }, [audioReference]);

//     return (
//         <AudioContext.Provider value={{ audioSource, setAudioSource, isPlaying, togglePlayPause }}>
//             <audio ref={audioReference} src={audioSource ?? undefined} />
//             {children}
//         </AudioContext.Provider>
//     );
// };

// export const useAudio = () => {
//     const context = useContext(AudioContext);
//     if (!context) {
//         throw new Error("Erreur avec le contexte audio");
//     }
//     return context;
// };