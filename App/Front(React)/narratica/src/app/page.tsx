"use client"
import { useEffect, useState } from 'react';
import axios from 'axios';

type Audiobook = {
    id: number;
    title: string;
    description: string;
    cover_art_jpg: string;
    cover_art_thumbnail: string;
    language: string;
    total_time: string;
    total_number_of_listening: number;
    author: number;
    narrator: number;
    publisher: number;
    tags: number[];
};

export default function HomePage() {
    const [audiobooks, setAudiobooks] = useState<Audiobook[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/audio');
                setAudiobooks(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
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