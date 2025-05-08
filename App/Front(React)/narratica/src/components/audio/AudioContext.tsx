'use client';

import { Chapter } from '@/app/api/audio/getAllChaptersFromAudioBookId';
import React, { createContext, useState, useContext, useRef, useEffect } from 'react';

//#region Interfaces

/**
 * Interface décrivant les propriétés accessibles via le contexte audio.
 */
interface AudioContextType {
    audioRef: React.RefObject<HTMLAudioElement | null>;
    audioApiContext: AudioContext | null;
    audioState: AudioState;
    setAudioState: React.Dispatch<React.SetStateAction<AudioState>>;

    /** Joue ou met en pause la lecture */
    togglePlayPause: () => void;

    /** Change le volume de l'audio */
    handleVolume: (newVolume: number) => void;

    /** Formate un temps donné (en secondes) en "minutes:secondes" */
    formatTime: (time: number) => string;

    /** Déplace la lecture à un pourcentage spécifique de la durée */
    seekTo: (progress: number) => void;

    /** Avance la lecture de X secondes */
    skipForward: (seconds: number) => void;

    /** Recule la lecture de X secondes */
    skipBackward: (seconds: number) => void;

    /** Charge un chapitre audio spécifique */
    loadChapter: (chapter: Chapter, bookTitle: string, coverImage: string) => void;

    /** Passe au chapitre suivant s'il existe */
    nextChapter: () => void;

    /** Revient au chapitre précédent ou au début du chapitre actuel */
    previousChapter: () => void;
}

/**
 * Représente l'état du lecteur audio.
 */
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

//#endregion

//#region Contexte

// Création du contexte audio
export const AudioContext = createContext<AudioContextType | undefined>(undefined);

//#endregion

//#region Provider

/**
 * Fournit un contexte audio global à l'application.
 * @param children Composants enfants ayant accès au contexte.
 */
export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    //#region État

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

    const audioReference = useRef<HTMLAudioElement | null>(null);
    const audioApiContext = useRef<AudioContext | null>(null);

    useEffect(() => {
        if (!audioApiContext.current) {
            audioApiContext.current = new window.AudioContext();
        }
    }, []);

    //#endregion

    //#region Fonctions principales

    /** Alterne entre lecture et pause de l'audio. */
    const togglePlayPause = () => {
        const audio = audioReference.current;
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

    /** Modifie le volume de l'audio.
     * @param newVolume Valeur entre 0 et 1.
     */
    const handleVolume = (newVolume: number) => {
        if (audioReference.current) {
            audioReference.current.volume = newVolume;
            setAudioState((prev) => ({ ...prev, volume: newVolume }));
        }
    };

    /** Formate un temps en secondes en format mm:ss.
     * @param time Temps en secondes
     * @returns Temps formaté
     */
    const formatTime = (time: number): string => {
        if (!time || isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, "0");
        return `${minutes}:${seconds}`;
    };

    /** Déplace la lecture à une certaine progression.
     * @param progress Pourcentage (entre 0 et 1)
     */
    const seekTo = (progress: number) => {
        const audio = audioReference.current;
        if (audio && audio.duration) {
            audio.currentTime = progress * audio.duration;
        }
    };

    /** Recule la lecture de X secondes.
     * @param seconds Durée à reculer
     */
    const skipBackward = (seconds: number) => {
        if (audioReference.current) {
            audioReference.current.currentTime = Math.max(
                audioReference.current.currentTime - seconds, 0
            );
        }
    };

    /** Avance la lecture de X secondes.
     * @param seconds Durée à avancer
     */
    const skipForward = (seconds: number) => {
        if (audioReference.current) {
            audioReference.current.currentTime = Math.min(
                audioReference.current.currentTime + seconds,
                audioReference.current.duration
            );
        }
    };

    /** Charge et lance la lecture d’un nouveau chapitre.
     * @param chapter Le chapitre à charger
     * @param bookTitle Titre du livre
     * @param coverImage Image de couverture du livre
     */
    const loadChapter = (chapter: Chapter, bookTitle: string, coverImage: string) => {
        const audio = audioReference.current;
        if (!audio) return;

        audio.src = chapter.audio_data;
        audio.load();

        setAudioState((prev) => ({
            ...prev,
            audioSource: chapter.audio_data,
            currentChapterTitle: `Chapitre ${chapter.chapter_number}`,
            coverImage,
            bookTitle,
            allChapters: prev.allChapters,
            currentChapterIndex: prev.allChapters.findIndex(
                (ch) => ch.chapter_number === chapter.chapter_number),
            isPlaying: true,
        }));

        audio.onloadedmetadata = () => {
            setAudioState((prev) => ({
                ...prev,
                duration: audio.duration || 0,
            }));
        };

        audio.play();
    };

    /** Charge le chapitre suivant si disponible. */
    const nextChapter = () => {
        const next = audioState.currentChapterIndex + 1;
        if (next < audioState.allChapters.length) {
            loadChapter(audioState.allChapters[next], audioState.bookTitle!, audioState.coverImage!);
        }
    };

    /** Revient au chapitre précédent ou au début si déjà au début. */
    const previousChapter = () => {
        const prev = audioState.currentChapterIndex - 1;
        if (prev >= 0) {
            loadChapter(audioState.allChapters[prev], audioState.bookTitle!, audioState.coverImage!);
        } else if (audioReference.current) {
            audioReference.current.currentTime = 0;
        }
    };

    //#endregion

    //#region Effets

    /** Met à jour le temps actuel et la progression du lecteur à chaque mise à jour de l'audio. */
    useEffect(() => {
        const audio = audioReference.current;
        if (!audio) return;

        const handleTimeChange = () => {
            setAudioState((prev) => ({
                ...prev,
                currentTime: audio.currentTime,
                progress: (audio.currentTime / audio.duration) * 100,
                duration: audio.duration
            }));
        };

        audio.addEventListener('timeupdate', handleTimeChange);
        return () => {
            audio.removeEventListener('timeupdate', handleTimeChange);
        };
    }, []);

    /** Met à jour l'état `isPlaying` en fonction des événements audio natifs. */
    useEffect(() => {
        const audio = audioReference.current;
        if (!audio) return;

        const play = () => setAudioState((prev => ({ ...prev, isPlaying: true })));
        const pause = () => setAudioState((prev => ({ ...prev, isPlaying: false })));

        audio.addEventListener('play', play);
        audio.addEventListener('pause', pause);

        return () => {
            audio.removeEventListener('play', play);
            audio.removeEventListener('pause', pause);
        };
    }, [audioReference]);

    /** Passe automatiquement au chapitre suivant quand la lecture se termine. */
    useEffect(() => {
        const audio = audioReference.current;
        if (!audio) return;

        const handleEnded = () => {
            nextChapter();
        };

        audio.addEventListener('ended', handleEnded);
        return () => {
            audio.removeEventListener('ended', handleEnded);
        };
    }, [audioState.currentChapterIndex, nextChapter]);

    //#endregion

    //#region Render Provider

    const value: AudioContextType = {
        audioRef: audioReference,
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
                ref={audioReference}
                crossOrigin="anonymous"
                style={{ display: 'none' }}
            />
            {children}
        </AudioContext.Provider>
    );

    //#endregion
};

//#endregion

//#region Hook useAudio

/**
 * Hook pour utiliser le contexte audio.
 * @returns Le contexte audio
 * @throws Erreur si utilisé en dehors d'un <AudioProvider>
 */
export const useAudio = () => {
    const context = useContext(AudioContext);
    if (!context) throw new Error('Erreur avec le contexte audio');
    return context;
};

//#endregion
