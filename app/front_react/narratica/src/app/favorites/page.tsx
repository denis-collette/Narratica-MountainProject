"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Card from "@/components/CardFavView";
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
import { FaFeatherAlt, FaMicrophoneAlt, FaBuilding } from "react-icons/fa";
import scrollbarHide from 'tailwind-scrollbar-hide'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

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
                    favAuthors.map(async (fav) => {
                        const author = await fetchAuthorById(fav.author);
                        return { id: author.id, name: author.name };
                    })
                );
                setFavoriteAuthors(authorDetails);

                // Fetch favorite narrators
                const favNarrators = await fetchFavoriteNarratorId(Number(userId));
                const narratorDetails = await Promise.all(
                    favNarrators.map(async (fav) => {
                        const narrator = await fetchNarratorById(fav.narrator);
                        return { id: narrator.id, name: narrator.name };
                    })
                );
                setFavoriteNarrators(narratorDetails);

                // Fetch favorite publishers
                const favPublishers = await fetchFavoritePublisherId(Number(userId));
                const publisherDetails = await Promise.all(
                    favPublishers.map(async (fav) => {
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
        <main className="relative h-[calc(100vh-140px)] w-screen  text-white mb-10 flex items-center justify-center bg-[url('/favicon.ico')]  bg-no-repeat bg-center bg-contain ">
            <div
                className="h-full w-3/4 bg-[rgba(67,67,67,0.42)] backdrop-blur-sm border border-white/10 overflow-y-auto pt-5 pb-5 rounded-3xl"
                style={{
                    scrollbarWidth: 'none', // Firefox
                    msOverflowStyle: 'none' // Internet Explorer 10+
                }}
            >
            <section className="px-10">
                <section >
                    <h2 className="text-4xl md:text-5xl font-bold text-center text-white drop-shadow-md mb-4 tracking-wide">
                    Favoris
                    </h2>

                    <h3 className="text-2xl font-semibold text-center text-gray-200 mb-6">
                    Vos livres audio préférés
                    </h3>

                        <div className=" m-auto">
                            <div className="flex justify-center ">
                            <section className="flex flex-wrap justify-center mb-10 gap-5 w-full max-w-[90%]">
                                {favoriteBooks.map((book) => (
                                    <Card key={book.id} book={book} />
                                ))}
                            </section>
                        </div>
                        </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-11/12 mx-auto mb-10">


                    {/* Auteurs */}
                    <div className="bg-white/5  p-4 rounded-lg backdrop-blur-sm border border-white/10 shadow-md">
                        <div className="inline-flex items-center gap-2 mb-3">
                        <h3 className="text-xl font-semibold">Auteurs</h3>
                        <FaFeatherAlt className="text-white text-sm" />
                        </div>
                        <ul className="list-disc list-inside space-y-1 pl-2">
                        {favoriteAuthors.map((author) => (
                            <li key={author.id}>
                            <Link
                                href={`/authorView?id=${author.id}`}
                                className="underline hover:text-gray-300 transition-colors"
                            >
                                {author.name}
                            </Link>
                            </li>
                        ))}
                        </ul>
                    </div>

                    {/* Narrateurs */}
                    <div className="bg-white/5 p-4 rounded-lg backdrop-blur-sm border border-white/10 shadow-md">
                        <div className="inline-flex items-center gap-2 mb-3">
                        <h3 className="text-xl font-semibold">Narrateurs</h3>
                        <FaMicrophoneAlt className="text-white text-sm" />
                        </div>
                        <ul className="list-disc list-inside space-y-1 pl-2">
                        {favoriteNarrators.map((narrator) => (
                            <li key={narrator.id}>
                            <Link
                                href={`/narratorView?id=${narrator.id}`}
                                className="underline hover:text-gray-300 transition-colors"
                            >
                                {narrator.name}
                            </Link>
                            </li>
                        ))}
                        </ul>
                    </div>

                    {/* Éditeurs */}
                    <div className="bg-white/5 p-4 rounded-lg backdrop-blur-sm border border-white/10 shadow-md">
                        <div className="inline-flex items-center gap-2 mb-3">
                        <h3 className="text-xl font-semibold">Éditeurs</h3>
                        <FaBuilding className="text-white text-sm" />
                        </div>
                        <ul className="list-disc list-inside space-y-1 pl-2">
                        {favoritePublishers.map((publisher) => (
                            <li key={publisher.id}>
                            <Link
                                href={`/publisherView?id=${publisher.id}`}
                                className="underline hover:text-gray-300 transition-colors"
                            >
                                {publisher.name}
                            </Link>
                            </li>
                        ))}
                        </ul>
                    </div>
                    </div>
                   
                </section>
            </section>
            </div>
        </main>
    );
}

export default ProfileView;
