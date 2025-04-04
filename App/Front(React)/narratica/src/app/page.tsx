"use client"
import { useEffect, useState } from 'react';
import { fetchAllAudioBooks, Audiobook } from '../app/api/audio/getAllAudioBooks';
import Card from '@/components/audio/custom/Card';
import { fetchAuthorById } from './api/audio/getAuthorById';
import { fetchNarratorById } from './api/audio/getNarratorById';
import { BookWithAuthorAndNarrator } from '../app/api/audio/getAllAudioBooks';
import { Tag } from './api/audio/getTagById';
import { fetchAllTags, } from './api/audio/getAllTags';

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

    useEffect(() => {
        const loadBooks = async () => {
            const data = await fetchAllAudioBooks();
            const allTags = await fetchAllTags();

            setTags(allTags);

            const booksInfos = await Promise.all(data.map(async (book) => {
                const author = await fetchAuthorById(book.author).catch(() => []);
                const narrator = await fetchNarratorById(book.narrator).catch(() => []);

                return {
                    ...book,
                    authorName: author[0]?.name,
                    narratorName: narrator[0]?.name,
                };
            }))

            setAudiobooks(booksInfos);
            setLoading(false);
        };

        loadBooks();
    }, []);

    return (
        <>
            <section>
                <p>Yo la team</p>
                {loading ? (
                    <p>Chargement...</p>
                ) : (
                    <>
                        <section className="flex flex-wrap gap-5 justify-start">
                            {tags.map((tag) => (
                                <section key={tag.id}>
                                    <h2 className='text-xl text-white font-bold hover:underline'>{tag.name}</h2>
                                </section>
                            ))}
                        </section>
                        <section className='flex flex-wrap gap-5 justify-start'>
                            {audiobooks.map((book) => (
                                <Card key={book.id} book={book} />
                            ))}
                        </section>
                    </>
                )}
            </section>
        </>
    );
}