"use client"
import { useEffect, useState } from 'react';
import axios from 'axios';
import { fetchBooks, Audiobook } from '../app/api/audio/getAllAudioBooks';

export default function HomePage() {
    const [audiobooks, setAudiobooks] = useState<Audiobook[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadBooks = async () => {
            const data = await fetchBooks();
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