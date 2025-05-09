"use client"
import { useEffect, useState } from 'react';
import NavBar from "@/components/NavBar"
import ChapterCard from "@/components/chapterCard";
import { fetchAudioBooksChaptersById, Chapter } from '../api/audio/getAllChaptersFromAudioBookId';
import { fetchAudioBooksById } from '../api/audio/getAudioBooksById';
import { Audiobook } from '../api/audio/getAllAudioBooks';
import { Author, fetchAuthorById } from "../api/audio/getAuthorById";
import { Narrator, fetchNarratorById } from '../api/audio/getNarratorById'
import { useAudio } from '@/components/audio/AudioContext';
import { useSearchParams } from 'next/navigation';
import { isAuthenticated } from "@/app/api/userAuth/checkAuth";
import { GoHeartFill,GoHeart } from "react-icons/go";
import {PostFavoriteAudioBook,postFavoriteAudioBook} from '../api/favorites/postFavoriteAudioBook'
import{fetchFavoriteAudioBookId} from '../api/favorites/getFavoriteAudioBookId'
import{deleteFavoriteAudioBook} from '../api/favorites/DeleteFavoriteAudio'
import{fetchFavoriteAudioBookTableId} from '../api/favorites/getFavoriteAudioBookTableId'
// #region Utils
function sortChapter(bookChapterObj: Chapter[]) {
    bookChapterObj.sort((a, b) => a.chapter_number - b.chapter_number);
    return bookChapterObj;
}
// #endregion

// #region Interfaces
interface Informations {
    chapters: Chapter[];
    audiobook: Audiobook | null;
    author: Author | null;
    narrator: Narrator | null;
    loadingAudioBook: boolean;
    loadingChapter: boolean;
    BookIsLiked:boolean;
}
// #endregion

function BookView({ searchParams }: { searchParams: { id: string; } }) {
    // #region Get ID from URL
    let id = 1;
    const params = useSearchParams();
    const strId = params.get('id');
    if (strId !== null) {
        id = parseInt(strId);
    }
    // #endregion
    const [loggedIn, setLoggedIn] = useState(false);
    useEffect(() => {
        setLoggedIn(isAuthenticated());
    }, []);
;
    // #region State & AudioContext
    const [informations, setState] = useState<Informations>({
        chapters: [],
        audiobook: null,
        author: null,
        narrator: null,
        loadingAudioBook: false,
        loadingChapter: false,
        BookIsLiked:false
    });

    const { setAudioState, loadChapter } = useAudio();
    // #endregion

    console.log("informations.audiobook?.cover_art_jpg :", informations.audiobook?.cover_art_jpg)




    // #region useEffect: chargement des données
    // #region useEffect: chargement des données
useEffect(() => {
    const loadData = async () => {
        try {
            let chapters = await fetchAudioBooksChaptersById(id);
            chapters = sortChapter(chapters);

            let audiobook = await fetchAudioBooksById(id);
            if (!audiobook || !audiobook.id) {
                setState((prevState) => ({
                    ...prevState,
                    audiobook,
                }));

                setAudioState((prevState) => ({
                    ...prevState,
                    bookTitle: "titre test",
                }));
                return;
            }

            const author = await fetchAuthorById(audiobook.author);
            const narrator = await fetchNarratorById(audiobook.narrator);

            console.log("isAuth", isAuthenticated());

            if (isAuthenticated()) {
                const userId = localStorage.getItem("user_id");
                if (userId !== null) {
                    const queryObj = {
                        user: parseInt(userId),
                        book: audiobook.id,
                    };
                    const BookIsLiked = await fetchFavoriteAudioBookTableId(queryObj);
                    if(BookIsLiked.length > 0 ){
                        setState((prevState) => ({
                            ...prevState,
                            BookIsLiked : true
                        }));
                    }
                }
            }

            setState((prevState) => ({
                ...prevState,
                author,
                narrator,
                audiobook,
            }));

            console.log("Titre :", audiobook.title);
            console.log("Image :", audiobook.cover_art_jpg);

            setAudioState((prevState) => ({
                ...prevState,
                // bookTitle: audiobook.title,
                // coverImage: audiobook.cover_art_jpg,
                allChapters: chapters,
            }));

            setState((prevState) => ({
                ...prevState,
                chapters,
            }));
        } catch (error) {
            console.error("Error loading data:", error);
        }
    };

    loadData();
}, [id]);
// #endregion

    // #endregion

    // #region Gestion du clic sur un chapitre
    const handleChapterClick = (audioSource: string | null, chapter: Chapter) => {

        if (audioSource && informations.audiobook && informations.audiobook.id) {
            loadChapter(chapter, informations.audiobook?.title, informations.audiobook?.cover_art_jpg);
        };
    }
    // #endregion

    const LikeButton = async () => {
        const newLikedState = !informations.BookIsLiked;
        setState(prev => ({
            ...prev,
            BookIsLiked: newLikedState,
        }));
    
        const userId = parseInt(localStorage.getItem("user_id") || "0");
        const bookId = informations.audiobook?.id;
    
        if (newLikedState) {
            await postFavoriteAudioBook({ book: id, user: userId });
        } else {
            const favoriteList = await fetchFavoriteAudioBookId(userId);
            const favoriteEntry = favoriteList.find(
                entry => entry.user === userId && entry.book === bookId
            );
    
            if (favoriteEntry) {
                await deleteFavoriteAudioBook({ id: favoriteEntry.id });
            }
        }
    };
    

    // #region Rendu
    return (
        
        <section className='relative min-h-screen overflow-x-hidden'>
            {informations.loadingChapter && informations.loadingAudioBook ? (
                <p>Chargement...</p>
            ) : (
                <div className="relative min-h-screen">
                <div 
                    className="absolute inset-0 z-0"
                    style={{
                    filter: 'blur(150px)',
                    backgroundImage: `url(${informations.audiobook?.cover_art_jpg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    }}
                />
                <div className="relative flex justify-between z-0 h-screen w-screen ">
                    <div className=" w-full flex flex-col bg-gradient-to-b from-[#00000000] from-15%  to-[#120e0c] to-45% rounded-[0.5%] " >
                        <div className="pt-[3%] flex items-center m-auto w-[80%] pb-[3%]">
                            <div className="w-[20%] h-0 pb-[20%] mr-[5%]">
                                <img className="rounded-[5%] shadow-[0px_0px_25px]" src={informations.audiobook?.cover_art_jpg} ></img>
                            </div>
                            <div className="text-left self-end">
                            {loggedIn && (
                                <button  onClick={() => LikeButton()}>
                                    {informations.BookIsLiked ? (
                                        <GoHeartFill className="text-white hover:text-gray-300 transition text-xl w-5 h-5" />
                                    ):(
                                        <GoHeart className="text-white hover:text-red-500 transition text-xl" />
                                    )}
                                </button>
                                )}
                                
                                <h1 className='text-white text-[1.5em] font-bold'>{informations.audiobook?.title}</h1>
                                <div>
                                    <h2 className='text-white text-[0.7em]'>{informations.author?.name} . {informations.narrator?.name} narrator . {informations.audiobook?.total_time} </h2>
                                </div>
                            </div>
                        </div>
                        <div className='bg-gray-800/25 flex-1 h-full border-b-[80px]  overflow-y-auto'>
                            <div className='text-white pt-[3%] flex-col items-center m-auto w-[80%] pb-[3%]'>
                                <h2 className='text-[0.5em]'>Narrated by : {informations.narrator?.name}</h2>
                                <h2 className='text-[0.7em]'>{informations.audiobook?.description}</h2>
                            </div>
                            <div className=' max-h-[60vh]'>
                                <div className="grid grid-cols-[0.1fr_0.8fr_0.4fr_0.5fr] grid-rows-1 mx-auto w-[80%] text-[hsl(0,0%,70%)] items-center justify-between Arial h-full">
                                    <div className='text-[hsl(0,_0%,_70%)] text-xs' >#</div>
                                    <div className='text-[hsl(0,_0%,_70%)] text-xs'>Chapters</div>
                                    <div className='text-[hsl(0,_0%,_70%)] text-xs text-center'>Lectures</div>
                                    <div className='text-[hsl(0,_0%,_70%)] text-xs text-right'>Time</div>
                                </div>
                                <ul>
                                    {informations.chapters.map((chapter) => (
                                        <li key={chapter.chapter_number}>
                                            <ChapterCard  {...chapter} onChapterClick={handleChapterClick} />
                                        </li> 
                                    ))}
                                </ul>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
    // #endregion
}

export default BookView;