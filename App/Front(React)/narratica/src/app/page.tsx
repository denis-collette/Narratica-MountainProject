"use client";
import { useEffect, useState } from 'react';
import { fetchAllAudioBooks } from '../app/api/audio/getAllAudioBooks';
import Card from '@/components/Card';
import { fetchAuthorById } from './api/audio/getAuthorById';
import { fetchNarratorById } from './api/audio/getNarratorById';
import { BookWithAuthorAndNarrator } from '../app/api/audio/getAllAudioBooks';
import { fetchAllTags } from './api/audio/getAllTags';
import { Tag } from './api/audio/getTagById';
import Filter from '@/components/TagFilter';
import { useSearch } from "@/components/SearchContext";

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
        <section>
            {state.loading ? (
                <p>Chargement...</p>
            ) : (
                <>
                    <section className='ml-4 px-4'>
                        <section className="flex flex-wrap justify-start gap-5 w-screen mb-4 px-2">
                            <Filter
                                tags={state.tags}
                                selectedTag={state.selectedTag}
                                setSelectedTag={(tag) => setState((prev) => ({ ...prev, selectedTag: tag }))}
                            />
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