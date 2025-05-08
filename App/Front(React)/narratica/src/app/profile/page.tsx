"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import NavBar from "@/components/NavBar";
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

interface FavoriteItem {
    id: number;
    name: string;
}

function ProfileView() {
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
                    favBooks.slice(0, 5).map((fav) => fetchAudioBooksById(fav.book))
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

                console.log("Authors:", favAuthors);
                console.log("Narrators:", favNarrators);
                console.log("Publishers:", favPublishers);

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
        <main className="min-h-screen bg-black text-white">
            <section className="p-10">
                <div className="flex items-start gap-10">
                    <img
                        src={localStorage.getItem("profile_img") || "https://github.com/shadcn.png"}
                        alt="Profile"
                        className="rounded-full h-52 w-52 object-cover"
                    />

                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold">{userInfo.username}</h1>
                        <p>Email : {userInfo.email}</p>
                        <p>Nom : {userInfo.first_name} {userInfo.last_name}</p>
                        <p>Narraticien depuis : {new Date(userInfo.date_joined).toLocaleDateString('fr-FR')}</p>
                        <button className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">
                            Modifier le profil
                        </button>
                    </div>
                </div>

                <section className="mt-10">
                    <h2 className="text-2xl font-semibold mb-4">Favoris</h2>

                    {/* Favorite Audiobooks */}
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2">Livres audio</h3>
                        <div className="flex gap-4 overflow-x-auto">
                            {favoriteBooks.map((book) => (
                                <Card key={book.id} book={book} />
                            ))}
                        </div>
                    </div>

                    {/* Favorite Authors */}
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2">Auteurs</h3>
                        <ul className="list-disc list-inside">
                            {favoriteAuthors.map((author) => (
                                <li key={author.id}>{author.name}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Favorite Narrators */}
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2">Narrateurs</h3>
                        <ul className="list-disc list-inside">
                            {favoriteNarrators.map((narrator) => (
                                <li key={narrator.id}>{narrator.name}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Favorite Publishers */}
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2">Éditeurs</h3>
                        <ul className="list-disc list-inside">
                            {favoritePublishers.map((publisher) => (
                                <li key={publisher.id}>{publisher.name}</li>
                            ))}
                        </ul>
                    </div>
                </section>
            </section>
        </main>
    );
}

export default ProfileView;