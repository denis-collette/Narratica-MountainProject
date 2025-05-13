"use client"
import { useEffect, useState } from 'react';
import ChapterCard from "@/components/chapterCard";
import { fetchAudioBooksChaptersById, Chapter } from '../api/audio/getAllChaptersFromAudioBookId';
import { fetchAudioBooksById } from '../api/audio/getAudioBooksById';
import { Audiobook } from '../api/audio/getAllAudioBooks';
import { Author, fetchAuthorById } from "../api/audio/getAuthorById";
import { Narrator, fetchNarratorById } from '../api/audio/getNarratorById'
import { Publisher, fetchPublisherById } from '../api/audio/getPublisherById';
import { useAudio } from '@/components/audio/AudioContext';
import { useSearchParams } from 'next/navigation';
import { isAuthenticated } from "@/app/api/userAuth/checkAuth";
import { GoHeartFill, GoHeart } from "react-icons/go";
import { PostFavoriteAudioBook, postFavoriteAudioBook } from '../api/favorites/postFavoriteAudioBook'
import { fetchFavoriteAudioBookId } from '../api/favorites/getFavoriteAudioBookId'
import { deleteFavoriteAudioBook } from '../api/favorites/DeleteFavoriteAudio'
import { fetchFavoriteAudioBookTableId } from '../api/favorites/getFavoriteAudioBookTableId'
import Link from 'next/link';
import { FaFeatherAlt, FaMicrophoneAlt, FaBuilding } from "react-icons/fa";
import { SkeletonBookView } from '@/components/SkeletonAll';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
// #region Utils
function sortChapter(bookChapterObj: Chapter[]) {
    bookChapterObj.sort((a, b) => a.chapter_number - b.chapter_number);
    return bookChapterObj;
}
// #endregion
//test
// #region Interfaces
interface Informations {
    chapters: Chapter[];
    audiobook: Audiobook | null;
    author: Author | null;
    narrator: Narrator | null;
    publisher: Publisher | null;
    loadingAudioBook: boolean;
    loadingChapter: boolean;
    BookIsLiked: boolean;
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
        publisher: null,
        loadingAudioBook: true,
        loadingChapter: true,
        BookIsLiked: false,
    });

    const { setAudioState, loadChapter } = useAudio();
    // #endregion

    console.log("informations.audiobook?.cover_art_jpg :", informations.audiobook?.cover_art_jpg)

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
                        loadingAudioBook: false,
                        loadingChapter: false
                    }));

                    setAudioState((prevState) => ({
                        ...prevState,
                        bookTitle: "titre test",
                    }));
                    return;
                }

                const author = await fetchAuthorById(audiobook.author);
                const narrator = await fetchNarratorById(audiobook.narrator);
                const publisher = await fetchPublisherById(audiobook.publisher);

                if (isAuthenticated()) {
                    const userId = localStorage.getItem("user_id");
                    if (userId !== null) {
                        const queryObj = {
                            user: parseInt(userId),
                            book: audiobook.id,
                        };
                        const BookIsLiked = await fetchFavoriteAudioBookTableId(queryObj);
                        if (BookIsLiked.length > 0) {
                            setState((prevState) => ({
                                ...prevState,
                                BookIsLiked: true
                            }));
                        }
                    }
                }

                setState((prevState) => ({
                    ...prevState,
                    author,
                    narrator,
                    publisher,
                    audiobook,
                    chapters,
                    loadingAudioBook: false,
                    loadingChapter: false
                }));

                console.log("Titre :", audiobook.title);
                console.log("Image :", audiobook.cover_art_jpg);

                setAudioState((prevState) => ({
                    ...prevState,
                    // bookTitle: audiobook.title,
                    // coverImage: audiobook.cover_art_jpg,
                    allChapters: chapters,
                    currentChapterIndex: -1,
                }));

                // setState((prevState) => ({
                //     ...prevState,
                //     chapters,
                // }));
            } catch (error) {
                console.error("Error loading data:", error);
                setState(prev => ({
                    ...prev,
                    loadingAudioBook: false,
                    loadingChapter: false
                }));
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

        <section className='relative overflow-x-hidden pb-[80px]'>
            {informations.loadingChapter && informations.loadingAudioBook ? (
                <SkeletonBookView />
            ) : (
                <div className="relative h-[calc(100vh-140px)]">
                <div className="absolute top-0 left-0 w-full h-full z-0 ">
                    <div
                        style={{
                        backgroundImage: `url(${informations.audiobook?.cover_art_jpg})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'blur(150px)',
                        }}
                        className="w-full h-full"
                    />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#120e0c]"/>
                </div>
                <div className="relative h-full flex flex-col w-screen ">
                    <div className=" w-full h-full flex flex-col bg-gradient-to-b from-[#00000000] from-15%  to-[#120e0c] to-45% rounded-[0.5%]">
                        <div className="pt-[3%] flex gap-6 m-auto w-[80%] pb-[1%] h-2/5">
                            <div className="w-[h-full] h-full flex-shrink-0 ">
                                <img
                                    src={informations.audiobook?.cover_art_jpg}
                                    alt="Cover"
                                    className="w-full h-full object-cover rounded-[5%] shadow-[0px_0px_25px]"
                                />
                            </div>
                            <div className="text-left self-end h-full">
                                <h1 className='text-white text-[2.5em] font-bold'>{informations.audiobook?.title} {loggedIn && (
                                    <button  onClick={() => LikeButton()}>
                                        {informations.BookIsLiked ? (
                                            <GoHeartFill className="text-white hover:text-gray-300 transition text-xl w-5 h-5" />
                                        ):(
                                            <GoHeart className="text-white hover:text-red-500 transition text-xl" />
                                        )}
                                    </button>
                                )}</h1>
                                <div className="flex flex-col space-y-2 h-3/4">
                                    <h2 className='text-white text-[0.9em] mb-[1%]'>
                                        Ecrit par :{" "}
                                        <Link 
                                        href={`/authorView?id=${informations.author?.id}`} 
                                        className="group inline-flex items-center gap-x-2 px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white border border-white/20 hover:bg-neutral-200 hover:text-black transition-transform duration-200 hover:scale-105"
                                        >
                                            <FaFeatherAlt className="text-white text-[0.7rem] group-hover:text-black transition" />
                                            {informations.author?.name}
                                        </Link>
                                    </h2>
                                    <h2 className='text-white text-[0.9em]  mb-[1%]'>
                                        Lu par :{" "}
                                        <Link 
                                        href={`/narratorView?id=${informations.narrator?.id}`} 
                                        className="group inline-flex items-center gap-x-2 px-3 py-1 h-full rounded-full text-xs font-medium bg-white/10 text-white border border-white/20 hover:bg-neutral-200 hover:text-black transition-transform duration-200 hover:scale-105"
                                        >
                                            <FaMicrophoneAlt className="text-white text-[0.7rem] group-hover:text-black transition" />
                                            {informations.narrator?.name}
                                        </Link>
                                    </h2>
                                    <h2 className='text-white text-[0.9em]  mb-[1%]'>
                                        Mis en ligne par :{" "}
                                        <Link 
                                        href={`/publisherView?id=${informations.publisher?.id}`} 
                                        className="group inline-flex items-center gap-x-2 px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white border border-white/20 hover:bg-neutral-200 hover:text-black transition-transform duration-200 hover:scale-105"
                                        >
                                            <FaBuilding className="text-white text-[0.7rem] group-hover:text-black transition" />
                                            {informations.publisher?.name}
                                        </Link>
                                    </h2>
                                    <h2 className='text-white text-[0.9em] mb-[1%]'>
                                        Durée totale : {informations.audiobook?.total_time}
                                    </h2 >
                                    <h2 className='text-white text-[0.9em] mb-[1%]'>Nombre de vue :</h2>
                                </div>
                            </div>
                        </div>
                        <div className='bg-gray-800/25 overflow-y-auto pt-5 pb-5 h-full '>
                            <div>
                                <div className='"pt-[1%]  gap-6 m-auto w-[80%] pb-[1%] items-start"'>
                                <h2 className='text-white text-[1.5em]'>Description:</h2>
                                    <h2 className='text-white text-[1em]  pr-2 w-3/4'>{informations.audiobook?.description}</h2>
                                </div>
                                
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