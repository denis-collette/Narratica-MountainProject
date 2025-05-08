"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchAudioBooksById } from '../api/audio/getAudioBooksById';
import { fetchFavoriteAudioBookId } from '../api/favorites/getFavoriteAudioBookId';
import { fetchAuthorById } from '../api/audio/getAuthorById';
import { fetchNarratorById } from '../api/audio/getNarratorById';
import { fetchAudioBooksByAuthor } from '../api/audio/getByAuthorId';
import { fetchAllTags } from '../api/audio/getAllTags';
import { useSearch } from "@/components/SearchContext";
import Card from '@/components/Card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Tag } from '../api/audio/getTagById';
import { BookWithAuthorAndNarrator } from '../api/audio/getAllAudioBooks';

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
    const author_id = searchParams.get("id");

    useEffect(() => {
        const loadBooks = async () => {
            if (!author_id) return;

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

    return (
        <section className="px-6">
            {state.loading ? (
                <p>Chargement...</p>
            ) : (
                <>
                    <h1 className="text-3xl font-semibold my-6 text-white">
                        Livres de {state.authorName}
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
