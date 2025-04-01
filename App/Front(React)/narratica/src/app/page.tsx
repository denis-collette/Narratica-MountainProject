"use client"
import { useEffect, useState } from 'react';
import axios from 'axios';
import { fetchAllAudioBooks, Audiobook } from '../app/api/audio/getAllAudioBooks';
import { fetchAudioBooksByNew } from '../app/api/audio/getNew';

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
                    <ul>
                        {audiobooks.map((book) => (
                            <li key={book.id}>
                                <h3>{book.title}</h3>
                                <p>{book.description}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </>
    );
}