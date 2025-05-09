"use client";
import { useEffect, useState } from 'react';
import { BookWithAuthorAndNarrator }  from "./api/audio/getAllAudioBooks";
import Card from '@/components/Card';
import { fetchAuthorById } from './api/audio/getAuthorById';
import { fetchNarratorById } from './api/audio/getNarratorById';
import { fetchAllAudioBooks } from "./api/audio/getAllAudioBooks";
import { fetchAllTags } from './api/audio/getAllTags';
import { Tag } from './api/audio/getTagById';
import Filter from '@/components/TagFilter';
import { useSearch } from "@/components/SearchContext";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"


export default function HomePage() {

    // Interface pour tout regrouper

    // Ici le extends hérite de Audiobook et ajoute 2 éléments authorName et narratorName 
    // mais ceci fonctionne aussi : BookWithAuthorAndNarrator en le mettant dans le usestate
    // voir getAllAudioBooks ligne 18

    // interface AudiobookAllInfos extends Audiobook {
    //     authorName: string;
    //     narratorName: string;
    // }

    interface HomePageState {
        audiobooks: BookWithAuthorAndNarrator[];
        tags: Tag[];
        loading: boolean;
        selectedTag: number | null;
    }

    const [state, setState] = useState<HomePageState>({
        audiobooks: [],
        tags: [],
        loading: true,
        selectedTag: null,
    });

    const { search } = useSearch()

    useEffect(() => {
        const loadBooks = async () => {
            const data = await fetchAllAudioBooks();
            const allTags = await fetchAllTags();

            const booksInfos = await Promise.all(data.map(async (book) => {
                const author = await fetchAuthorById(book.author).catch(() => ({ id: 0, name: "Unknown Author" }));
                const narrator = await fetchNarratorById(book.narrator).catch(() => ({ id: 0, name: "Unknown Narrator" }));

                return {
                    ...book,
                    authorName: author.name,
                    narratorName: narrator.name,
                };
            }));

            setState((prev) => ({
                ...prev,
                audiobooks: booksInfos,
                tags: allTags,
                loading: false,
            }));
        };

        loadBooks();
    }, []);

    const filteredBooks = state.audiobooks.filter((book) => {
        const matchesTag = state.selectedTag ? book.tags?.includes(state.selectedTag) : true;
        const matchesSearch = book.title.toLowerCase().includes(search.toLowerCase());
        return matchesTag && matchesSearch;
    });

    return (
        <section className='relative min-h-screen overflow-x-hidden mt-5'>
            {state.loading ? (
                <p>Chargement...</p>
            ) : (
                <>
                    <section className='ml-4 w-1/2'>
                        <section className="relative mx-12">
                            <Carousel
                                opts={{
                                    align: "start",
                                    loop: true,
                                    slidesToScroll: 1,
                                    containScroll: "trimSnaps"
                                }}
                                className="w-full mb-8"
                            >
                                <CarouselContent className='gap-2'>
                                    {/* All Tags */}
                                    <CarouselItem className="basis-auto">
                                        <button
                                            onClick={() => setState(prev => ({
                                                ...prev,
                                                selectedTag: null
                                            }))}
                                            className={`
                                                px-4 py-1 rounded-full text-sm font-medium
                                                transition-all duration-200 ease-in-out
                                                ${!state.selectedTag ? "bg-white text-black" : "bg-neutral-800 text-white hover:bg-neutral-700"}`}>
                                            All Tags
                                        </button>
                                    </CarouselItem>

                                    {/* Le reste des tags */}
                                    {state.tags.map((tag) => (
                                        <CarouselItem key={tag.id} className="basis-auto">
                                            <button
                                                onClick={() => setState(prev => ({
                                                    ...prev,
                                                    selectedTag: tag.id === state.selectedTag ? null : tag.id
                                                }))}
                                                className={`
                                                    px-4 py-1 rounded-full text-sm font-medium
                                                    transition-all duration-200 ease-in-out
                                                    ${state.selectedTag === tag.id
                                                        ? "bg-white text-black"
                                                        : "bg-neutral-800 text-white hover:bg-neutral-700"
                                                    }
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