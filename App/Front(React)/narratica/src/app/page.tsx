"use client"
import { useEffect, useState } from 'react';
import { fetchAllAudioBooks, Audiobook } from '../app/api/audio/getAllAudioBooks';
import Card from '@/components/Card';
import { fetchAuthorById } from './api/audio/getAuthorById';
import { fetchNarratorById } from './api/audio/getNarratorById';
import { BookWithAuthorAndNarrator } from '../app/api/audio/getAllAudioBooks';
import { Tag } from './api/audio/getTagById';
import { fetchAllTags, } from './api/audio/getAllTags';
import Filter from '@/components/TagFilter';

// Interface pour tout regrouper

// Ici le extends hérite de Audiobook et ajoute 2 éléments authorName et narratorName 
// mais ceci fonctionne aussi : BookWithAuthorAndNarrator en le mettant dans le usestate
// voir getAllAudioBooks ligne 18

// interface AudiobookAllInfos extends Audiobook {
//     authorName: string;
//     narratorName: string;
// }

export default function HomePage() {
    const [audiobooks, setAudiobooks] = useState<BookWithAuthorAndNarrator[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(true);
    const [tag, setTag] = useState<number | null>(null);

    useEffect(() => {
        const loadBooks = async () => {
            const data = await fetchAllAudioBooks();
            const allTags = await fetchAllTags();

            setTags(allTags);

            const booksInfos = await Promise.all(data.map(async (book) => {
                const author = await fetchAuthorById(book.author).catch(() => ({ id: 0, name: "Unknown Author" }));
                const narrator = await fetchNarratorById(book.narrator).catch(() => ({ id: 0, name: "Unknown Narrator" }));

                return {
                    ...book,
                    authorName: author.name,
                    narratorName: narrator.name,
                };
            }))

            setAudiobooks(booksInfos);
            setLoading(false);
        };

        loadBooks();
    }, []);


    const filteredBooks = tag
        ? audiobooks.filter((book) => book.tags?.includes(tag))
        : audiobooks;
    return (
        <>
            <section>
                <p>Yo la team</p>
                {loading ? (
                    <p>Chargement...</p>
                ) : (
                    <>
                        <section className="flex flex-wrap justify-start gap-5 w-screen">
                            <Filter
                                tags={tags}
                                selectedTag={tag}
                                setSelectedTag={setTag} />
                            {/* {tags.map((tag) => (
                                <section key={tag.id}>
                                    <h2 className='text-xl text-white font-bold hover:underline'>{tag.name}</h2>
                                </section>
                            ))} */}
                        </section>
                        <section className='flex flex-wrap justify-center gap-5 mb-16 content-center w-screen'>
                            {filteredBooks.map((book) => (
                                <Card key={book.id} book={book} />
                            ))}
                        </section>
                    </>
                )}
            </section>
        </>
    );
}