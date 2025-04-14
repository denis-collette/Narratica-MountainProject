"use client"
import React, { createContext, useState, useContext, useRef, useEffect } from 'react';

interface AudioContextType {
    audioSource: string | null;
    setAudioSource: React.Dispatch<React.SetStateAction<string | null>>;
    isPlaying: boolean;
    togglePlayPause: () => void;
    currentChapterTitle: string | undefined;
    setCurrentChapterTitle: React.Dispatch<React.SetStateAction<string | undefined>>;
    coverImage: string | undefined;
    setCoverImage: React.Dispatch<React.SetStateAction<string | undefined>>;
    bookTitle: string | undefined;
    setBookTitle: React.Dispatch<React.SetStateAction<string | undefined>>;
    audioReference: React.RefObject<HTMLAudioElement | null>;
    setVolume: React.Dispatch<React.SetStateAction<number | undefined>>;
    handleVolume: (newVolume: number) => void;
    // handleTime: (newTime: number) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [audioSource, setAudioSource] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [currentChapterTitle, setCurrentChapterTitle] = useState<string | undefined>(undefined);
    const [coverImage, setCoverImage] = useState<string | undefined>(undefined);
    const [bookTitle, setBookTitle] = useState<string | undefined>(undefined);
    const [volume, setVolume] = useState<number | undefined>();
    const [progress, setProgress] = useState<number>();
    const [currentTime, setCurrentTime] = useState<number>();
    const [duration, setDuration] = useState<number>();
    const audioReference = useRef<HTMLAudioElement>(null);

    const togglePlayPause = () => {
        if (audioReference.current) {
            if (isPlaying) {
                audioReference.current.pause();
            } else {
                audioReference.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleVolume = (newVolume: number) => {
        if (audioReference.current) {
            audioReference.current.volume = newVolume
            setVolume(newVolume)
        }
    }
    useEffect(() => {
        const audio = audioReference.current

        if (audio) {
            const handleTimeChange = () => {
                setCurrentTime(audio.currentTime)
                setProgress((audio.currentTime / audio.duration) * 100)
                setDuration(audio.duration)
            }

            audio?.addEventListener('timeChange', handleTimeChange);

            return () => {
                audio?.removeEventListener('timeChange', handleTimeChange);
            };
        }
    }, [])

    useEffect(() => {
        const play = () => setIsPlaying(true)
        const pause = () => setIsPlaying(false)

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

    useEffect(() => {
        if (audioReference.current) {
            audioReference.current.src = audioSource || '';
            setIsPlaying(false);
        }
    }, [audioSource]);

    const value = {
        audioSource,
        setAudioSource,
        isPlaying,
        togglePlayPause,
        currentChapterTitle,
        setCurrentChapterTitle,
        coverImage,
        setCoverImage,
        bookTitle,
        setBookTitle,
        audioReference,
        volume,
        setVolume,
        handleVolume,
        currentTime,
        duration,
        setCurrentTime,
        setDuration,
        progress,
        setProgress
    }

    return (
        <AudioContext.Provider value={value}>
            <audio ref={audioReference} />
            {children}
        </AudioContext.Provider>
    );
};

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