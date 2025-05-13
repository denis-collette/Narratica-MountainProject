"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Card from "@/components/Card";
import { fetchUserProfile, UserProfile } from "../api/userAuth/fetchUserProfile";
import { fetchFavoriteAudioBookId } from "../api/favorites/getFavoriteAudioBookId";
import { fetchFavoriteAuthorId } from "../api/favorites/getFavoriteAuthorId";
import { fetchFavoriteNarratorId } from "../api/favorites/getFavoriteNarratorId";
import { fetchFavoritePublisherId } from "../api/favorites/getFavoritePublisherId";
import { fetchAudioBooksById } from "../api/audio/getAudioBooksById";
import { fetchAuthorById } from "../api/audio/getAuthorById";
import { fetchNarratorById } from "../api/audio/getNarratorById";
import { fetchPublisherById } from "../api/audio/getPublisherById";
import { updateUserProfile } from "../api/userAuth/updateUserProfile";
import { deleteUserProfile } from "../api/userAuth/deleteUserProfile";

interface FavoriteItem {
    id: number;
    name: string;
}

function ProfileView() {
    const router = useRouter();
    const params = useSearchParams();
    const searchId = params.get("id");
    const localId = typeof window !== "undefined" ? localStorage.getItem("user_id") : null;
    const userId = searchId || localId;

    const [userInfo, setUserInfo] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);


    const [favoriteBooks, setFavoriteBooks] = useState<any[]>([]);
    const [favoriteAuthors, setFavoriteAuthors] = useState<FavoriteItem[]>([]);
    const [favoriteNarrators, setFavoriteNarrators] = useState<FavoriteItem[]>([]);
    const [favoritePublishers, setFavoritePublishers] = useState<FavoriteItem[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!userId) return;
            try {
                const userData = await fetchUserProfile(Number(userId));
                setUserInfo(userData);
           

                // Fetch favorite audiobooks
                const favBooks = await fetchFavoriteAudioBookId(Number(userId));
                const bookDetails = await Promise.all(
                    favBooks.map(async (fav) => {
                        const baseBook = await fetchAudioBooksById(fav.book);
                        const author = await fetchAuthorById(baseBook.author).catch(() => ({ name: "Unknown Author" }));
                        const narrator = await fetchNarratorById(baseBook.narrator).catch(() => ({ name: "Unknown Narrator" }));

                        return {
                            ...baseBook,
                            authorName: author.name,
                            narratorName: narrator.name,
                        };
                    })
                );
                setFavoriteBooks(bookDetails);

                // Fetch favorite authors
                const favAuthors = await fetchFavoriteAuthorId(Number(userId));
                const authorDetails = await Promise.all(
                    favAuthors.slice(0, 5).map(async (fav) => {
                        const author = await fetchAuthorById(fav.author);
                        return { id: author.id, name: author.name };
                    })
                );
                setFavoriteAuthors(authorDetails);

                // Fetch favorite narrators
                const favNarrators = await fetchFavoriteNarratorId(Number(userId));
                const narratorDetails = await Promise.all(
                    favNarrators.slice(0, 5).map(async (fav) => {
                        const narrator = await fetchNarratorById(fav.narrator);
                        return { id: narrator.id, name: narrator.name };
                    })
                );
                setFavoriteNarrators(narratorDetails);

                // Fetch favorite publishers
                const favPublishers = await fetchFavoritePublisherId(Number(userId));
                const publisherDetails = await Promise.all(
                    favPublishers.slice(0, 5).map(async (fav) => {
                        const publisher = await fetchPublisherById(fav.publisher);
                        return { id: publisher.id, name: publisher.name };
                    })
                );
                setFavoritePublishers(publisherDetails);

            } catch (error) {
                console.error("Failed to fetch user data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userId]);






    if (loading) return <p className="text-white text-center mt-8">Chargement...</p>;
    if (!userInfo) return <p className="text-white text-center mt-8">Utilisateur non trouvé</p>;

    return (
        <main className="min-h-screen bg-black text-white mb-10">
            <section className="p-10">
                <section className="mt-10">
                    <h2 className="text-2xl font-semibold mb-4">Favoris</h2>
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2">Livres audio</h3>
                        <div className="flex gap-4 overflow-x-auto">
                            {favoriteBooks.map((book) => (
                                <Card key={book.id} book={book} />
                            ))}
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2">Auteurs</h3>
                        <ul className="list-disc list-inside">
                            {favoriteAuthors.map((author) => (
                                <li key={author.id}>
                                    <Link href={`/authorView?id=${author.id}`} className="underline hover:text-gray-300">
                                        {author.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2">Narrateurs</h3>
                        <ul className="list-disc list-inside">
                            {favoriteNarrators.map((narrator) => (
                                <li key={narrator.id}>
                                    <Link href={`/narratorView?id=${narrator.id}`} className="underline hover:text-gray-300">
                                        {narrator.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2">Éditeurs</h3>
                        <ul className="list-disc list-inside">
                            {favoritePublishers.map((publisher) => (
                                <li key={publisher.id}>
                                    <Link href={`/publisherView?id=${publisher.id}`} className="underline hover:text-gray-300">
                                        {publisher.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            </section>
        </main>
    );
}

export default ProfileView;
