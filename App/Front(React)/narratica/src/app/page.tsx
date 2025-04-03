"use client"
import { useEffect, useState } from 'react';
import { fetchAllAudioBooks, Audiobook } from '../app/api/audio/getAllAudioBooks';
import Card from '@/components/audio/custom/Card';

// Interface pour tout regrouper

export default function HomePage() {
    const [audiobooks, setAudiobooks] = useState<Audiobook[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadBooks = async () => {
            const data = await fetchAllAudioBooks();
            setAudiobooks(data);
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
                        <section className='flex flex-wrap gap-5 justify-center'>
                            {audiobooks.map((book) => (
                                <Card key={book.id} book={book} />
                            ))}
                            {/* <h3 className='font-bold'>{book.title}</h3>
                                    <p className='text-gray-950'>{book.description}</p> */}
                            {/* <Card>
                            </Card>
                            <Card>
                            </Card>
                            <Card>
                            </Card>
                            <Card>
                            </Card> */}
                        </section>
                    </>
                )}
            </section>
        </>
    );
}