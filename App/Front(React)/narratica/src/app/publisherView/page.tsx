"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchAudioBooksById } from '../api/audio/getAudioBooksById';
import { fetchAuthorById } from '../api/audio/getAuthorById';
import { fetchNarratorById } from '../api/audio/getNarratorById';
import { fetchPublisherById } from '../api/audio/getPublisherById';
import { fetchAudioBooksByPublisher } from '../api/audio/getByPublisher';
import { fetchAllTags } from '../api/audio/getAllTags';
import { useSearch } from "@/components/SearchContext";
import Card from '@/components/Card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Tag } from '../api/audio/getTagById';
import { BookWithAuthorAndNarrator } from '../api/audio/getAllAudioBooks';
import { fetchFavoritePublisherId } from '../api/favorites/getFavoritePublisherId';
import { postFavoritePublisher, PostFavoritePublisher } from '../api/favorites/postFavoritePublisher';
import { DeleteFavoritePublisher } from '../api/favorites/DeleteFavoritePublisher';
import { GoHeart, GoHeartFill } from "react-icons/go";
import { isAuthenticated } from '../api/userAuth/checkAuth';

export default function PublisherView() {
    interface PublisherViewState {
        audiobooks: BookWithAuthorAndNarrator[];
        tags: Tag[];
        loading: boolean;
        selectedTag: number | null;
        publisherName: string;
    }

    const [state, setState] = useState<PublisherViewState>({
        audiobooks: [],
        tags: [],
        loading: true,
        selectedTag: null,
        publisherName: "",
    });

    const { search } = useSearch();
    const searchParams = useSearchParams();
    const publisher_id = searchParams.get("id") || "1";

    useEffect(() => {
        const loadBooks = async () => {
            if (!publisher_id) {
                return;
            }

            try {
                const bookIdList = await fetchAudioBooksByPublisher(parseInt(publisher_id));
                const allTags = await fetchAllTags();
                const publisher = await fetchPublisherById(parseInt(publisher_id));

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
                    publisherName: publisher.name,
                });
            } catch (error) {
                console.error("Error loading books:", error);
                setState((prev) => ({ ...prev, loading: false }));
            }
        };

        loadBooks();
    }, [publisher_id]);

    const filteredBooks = state.audiobooks.filter((book) => {
        const matchesTag = state.selectedTag ? book.tags?.includes(state.selectedTag) : true;
        const matchesSearch = book.title.toLowerCase().includes(search.toLowerCase());
        return matchesTag && matchesSearch;
    });

    const [publisherIsLiked, setPublisherIsLiked] = useState(false);
            const [loggedIn, setLoggedIn] = useState(false);
        
            const LikeButton = async () => {
                const newLikedState = !publisherIsLiked;
                setPublisherIsLiked(newLikedState);
                
                const userId = parseInt(localStorage.getItem("user_id") || "0");
                const publisherId = parseInt(publisher_id || "0");
            
                if (newLikedState) {
                    await postFavoritePublisher({ publisher: parseInt(publisher_id || "0"), user: userId });
                } else {
                    const favoriteList = await fetchFavoritePublisherId(userId);
                    const favoriteEntry = favoriteList.find(
                        entry => entry.user === userId && entry.publisher === publisherId
                    );
            
                    if (favoriteEntry) {
                        await DeleteFavoritePublisher({ id: favoriteEntry.id });
                    }
                }
            };
        
            useEffect(() => {
                const checkIfLiked = async () => {
                    const userId = parseInt(localStorage.getItem("user_id") || "0");
                    const favs = await fetchFavoritePublisherId(userId);
                    const liked = favs.some(fav => fav.publisher === parseInt(publisher_id || "0"));
                    setPublisherIsLiked(liked);
                };
            
                if (publisher_id) {
                    checkIfLiked();
                }
            }, [publisher_id]);
        
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
                        Livres mis en ligne par {state.publisherName} {loggedIn && (
                            <button  onClick={() => LikeButton()}>
                                {publisherIsLiked ? (
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
