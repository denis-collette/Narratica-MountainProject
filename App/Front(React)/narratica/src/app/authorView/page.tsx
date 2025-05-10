"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchAudioBooksById } from '../api/audio/getAudioBooksById';
import { fetchAuthorById } from '../api/audio/getAuthorById';
import { fetchNarratorById } from '../api/audio/getNarratorById';
import { fetchAudioBooksByAuthor } from '../api/audio/getByAuthorId';
import { fetchAllTags } from '../api/audio/getAllTags';
import { useSearch } from "@/components/SearchContext";
import Card from '@/components/Card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Tag } from '../api/audio/getTagById';
import { BookWithAuthorAndNarrator } from '../api/audio/getAllAudioBooks';
import { fetchFavoriteAuthorId } from '../api/favorites/getFavoriteAuthorId';
import { postFavoriteAuthor } from '../api/favorites/postFavoriteAuthor';
import { deleteFavoriteAuthor } from '../api/favorites/DeleteFavoriteAuthor';
import { GoHeart, GoHeartFill } from "react-icons/go";
import { isAuthenticated } from '../api/userAuth/checkAuth';

export default function AuthorView() {
    interface AuthorViewState {
        audiobooks: BookWithAuthorAndNarrator[];
        tags: Tag[];
        loading: boolean;
        selectedTag: number | null;
        authorName: string;
    }

    const [state, setState] = useState<AuthorViewState>({
        audiobooks: [],
        tags: [],
        loading: true,
        selectedTag: null,
        authorName: "",
    });

    const { search } = useSearch();
    const searchParams = useSearchParams();
    const author_id = searchParams.get("id") || "1";

    useEffect(() => {
        const loadBooks = async () => {
            if (!author_id) {
                return;
            }
            try {
                const bookIdList = await fetchAudioBooksByAuthor(parseInt(author_id));
                const allTags = await fetchAllTags();
                const author = await fetchAuthorById(parseInt(author_id));

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
                    authorName: author.name,
                });
            } catch (error) {
                console.error("Error loading books:", error);
                setState((prev) => ({ ...prev, loading: false }));
            }
        };

        loadBooks();
    }, [author_id]);

    const filteredBooks = state.audiobooks.filter((book) => {
        const matchesTag = state.selectedTag ? book.tags?.includes(state.selectedTag) : true;
        const matchesSearch = book.title.toLowerCase().includes(search.toLowerCase());
        return matchesTag && matchesSearch;
    });

    const [authorIsLiked, setAuthorIsLiked] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);

    const LikeButton = async () => {
        const newLikedState = !authorIsLiked;
        setAuthorIsLiked(newLikedState);
        if(localStorage != undefined){
        const userId = parseInt(localStorage.getItem("user_id") || "0");
        const authorId = parseInt(author_id || "0");
    
        if (newLikedState) {
            await postFavoriteAuthor({ author: parseInt(author_id || "0"), user: userId });
        } else {
            const favoriteList = await fetchFavoriteAuthorId(userId);
            const favoriteEntry = favoriteList.find(
                entry => entry.user === userId && entry.author === authorId
            );
    
            if (favoriteEntry) {
                await deleteFavoriteAuthor({ id: favoriteEntry.id });
            }
        }
    }};

    useEffect(() => {
        const checkIfLiked = async () => {
            if(localStorage != undefined){
            const userId = parseInt(localStorage.getItem("user_id") || "0");
            const favs = await fetchFavoriteAuthorId(userId);
            const liked = favs.some(fav => fav.author === parseInt(author_id || "0"));
            setAuthorIsLiked(liked);
        };
    
        if (author_id) {
            checkIfLiked();
        }
    }}, [author_id]);

    useEffect(() => {
        setLoggedIn(isAuthenticated());
    }, []);

    return (
        <section className="px-6">
            {state.loading ? (
                <p>Chargement...</p>
            ) : (
                <>
                    <h1 className="text-3xl font-semibold my-6 text-white">
                        Livres de {state.authorName} {loggedIn && (
                        <button  onClick={() => LikeButton()}>
                            {authorIsLiked ? (
                                <GoHeartFill className="text-white hover:text-gray-300 transition text-xl w-5 h-5" />
                            ):(
                                <GoHeart className="text-white hover:text-red-500 transition text-xl" />
                            )}
                        </button>
                    )}
                    </h1>
                    
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
                            <CarouselContent className="gap-2">
                                <CarouselItem className="basis-auto">
                                    <button
                                        onClick={() => setState((prev) => ({ ...prev, selectedTag: null }))}
                                        className={`
                                            px-4 py-1 rounded-full text-sm font-medium
                                            transition-all duration-200 ease-in-out
                                            ${!state.selectedTag ? "bg-white text-black" : "bg-neutral-800 text-white hover:bg-neutral-700"}
                                        `}
                                    >
                                        Tous les Tags
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

                    <section className="flex flex-wrap justify-start gap-5 mt-6 mb-16">
                        {filteredBooks.map((book) => (
                            <Card key={book.id} book={book} />
                        ))}
                    </section>
                </>
            )}
        </section>
    );
}
