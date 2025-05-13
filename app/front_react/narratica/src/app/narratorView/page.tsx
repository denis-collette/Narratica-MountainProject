"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchAudioBooksById } from '../api/audio/getAudioBooksById';
import { fetchAuthorById } from '../api/audio/getAuthorById';
import { fetchNarratorById } from '../api/audio/getNarratorById';
import { fetchAudioBooksByNarrator } from '../api/audio/getByNarrator';
import { fetchAllTags } from '../api/audio/getAllTags';
import { useSearch } from "@/components/SearchContext";
import Card from '@/components/Card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Tag } from '../api/audio/getTagById';
import { BookWithAuthorAndNarrator } from '../api/audio/getAllAudioBooks';
import { fetchFavoriteNarratorId } from '../api/favorites/getFavoriteNarratorId';
import { PostFavoriteNarrator } from '../api/favorites/postFavoriteNarrator';
import { DeleteFavoriteNarrator } from '../api/favorites/DeleteFavoriteNarrator';
import { GoHeart, GoHeartFill } from "react-icons/go";
import { isAuthenticated } from '../api/userAuth/checkAuth';

export default function NarratorView() {
    interface NarratorViewState {
        audiobooks: BookWithAuthorAndNarrator[];
        tags: Tag[];
        loading: boolean;
        selectedTag: number | null;
        narratorName: string;
    }

    const [state, setState] = useState<NarratorViewState>({
        audiobooks: [],
        tags: [],
        loading: true,
        selectedTag: null,
        narratorName: "",
    });

    const { search } = useSearch();
    const searchParams = useSearchParams();
    const narrator_id = searchParams.get("id") || "1";



    useEffect(() => {
        const loadBooks = async () => {
            if (!narrator_id) {
                return;
            }
            try {
                const bookIdList = await fetchAudioBooksByNarrator(parseInt(narrator_id));
                const allTags = await fetchAllTags();
                const narrator = await fetchNarratorById(parseInt(narrator_id));

                const detailedBooks = await Promise.all(
                    bookIdList.map(async (book) => {
                        const fullBook = await fetchAudioBooksById(book.id);
                        const bookAuthor = await fetchAuthorById(fullBook.author).catch(() => ({ id: 0, name: "Unknown Author" }));
                        const narrator = await fetchNarratorById(fullBook.narrator).catch(() => ({ id: 0, name: "Unknown Narrator" }));

                        return {
                            ...fullBook,
                            authorName: bookAuthor.name,
                            narratorName: narrator.name,
                        };
                    })
                );

                setState({
                    audiobooks: detailedBooks,
                    tags: allTags,
                    loading: false,
                    selectedTag: null,
                    narratorName: narrator.name,
                });
            } catch (error) {
                console.error("Error loading books:", error);
                setState((prev) => ({ ...prev, loading: false }));
            }
        };

        loadBooks();
    }, [narrator_id]);

    const filteredBooks = state.audiobooks.filter((book) => {
        const matchesTag = state.selectedTag ? book.tags?.includes(state.selectedTag) : true;
        const matchesSearch = book.title.toLowerCase().includes(search.toLowerCase());
        return matchesTag && matchesSearch;
    });

    const [narratorIsLiked, setNarratorIsLiked] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        setLoggedIn(isAuthenticated());
        console.log("cc")
    }, []);


    const LikeButton = async () => {
        const newLikedState = !narratorIsLiked;
        setNarratorIsLiked(newLikedState);

        const userId = parseInt(localStorage.getItem("user_id") || "0");
        const narratorId = parseInt(narrator_id || "0");

        if (newLikedState) {
            await PostFavoriteNarrator({ narrator: parseInt(narrator_id || "0"), user: userId });
        } else {
            const favoriteList = await fetchFavoriteNarratorId(userId);
            const favoriteEntry = favoriteList.find(
                entry => entry.user === userId && entry.narrator === narratorId
            );

            if (favoriteEntry) {
                await DeleteFavoriteNarrator({ id: favoriteEntry.id });
            }
        }
    };

    useEffect(() => {
        const checkIfLiked = async () => {
            if (isAuthenticated()) {
                const userId = parseInt(localStorage.getItem("user_id") || "0");
                const favs = await fetchFavoriteNarratorId(userId);
                const liked = favs.some(fav => fav.narrator === parseInt(narrator_id || "0"));
                setNarratorIsLiked(liked);
            }
        };
        if (narrator_id) {
            checkIfLiked();
        }
    }, [narrator_id]);



    return (
        <section className="px-6">
            {state.loading ? (
                <p>Chargement...</p>
            ) : (
                <>
                    <h1 className="text-3xl font-semibold my-6 text-white">
                        Livres contés par {state.narratorName} {loggedIn && (
                            <button onClick={() => LikeButton()}>
                                {narratorIsLiked ? (
                                    <GoHeartFill className="text-white hover:text-gray-300 transition text-xl w-5 h-5" />
                                ) : (
                                    <GoHeart className="text-white hover:text-red-500 transition text-xl" />
                                )}
                            </button>
                        )}
                    </h1>

                    <section className='ml-4 w-1/2'>
                        <section className="relative mx-12">
                            <Carousel
                                opts={{
                                    align: "start",
                                    loop: true,
                                    slidesToScroll: 1,
                                    containScroll: "trimSnaps",
                                }}
                                className="w-full mb-8"
                            >
                                <CarouselContent className="gap-2 max-w-full">
                                    <CarouselItem className="basis-auto">
                                        <button
                                            onClick={() => setState((prev) => ({ ...prev, selectedTag: null }))}
                                            className={`
                                            px-4 py-1 rounded-full text-sm font-medium
                                            transition-all duration-200 ease-in-out
                                            ${!state.selectedTag ? "bg-white text-black" : "bg-neutral-800 text-white hover:bg-neutral-700"}
                                        `}
                                        >
                                            All Tags
                                        </button>
                                    </CarouselItem>

                                    {state.tags.map((tag) => (
                                        <CarouselItem key={tag.id} className="basis-auto">
                                            <button
                                                onClick={() =>
                                                    setState((prev) => ({
                                                        ...prev,
                                                        selectedTag: tag.id === state.selectedTag ? null : tag.id,
                                                    }))
                                                }
                                                className={`
                                                px-4 py-1 rounded-full text-sm font-medium
                                                transition-all duration-200 ease-in-out
                                                ${state.selectedTag === tag.id
                                                        ? "bg-white text-black"
                                                        : "bg-neutral-800 text-white hover:bg-neutral-700"}
                                            `}
                                            >
                                                {tag.name}
                                            </button>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious className="bg-neutral-800 text-white hover:bg-white hover:text-black border-none" />
                                <CarouselNext className="bg-neutral-800 text-white hover:bg-white hover:text-black border-none" />
                            </Carousel>
                        </section>

                        <section className="flex flex-wrap justify-start gap-5 mb-25 content-center w-screen">
                            {filteredBooks.map((book) => (
                                <Card key={book.id} book={book} />
                            ))}
                        </section>
                    </section>
                </>
            )}
        </section>
    );
}