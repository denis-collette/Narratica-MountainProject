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
import { FaFeatherAlt, FaMicrophoneAlt, FaBuilding } from "react-icons/fa";
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
        <main className="relative h-[calc(100vh-140px)] w-screen  text-white mb-10 flex items-center justify-center bg-[url('/favicon.ico')]  bg-no-repeat bg-center bg-contain">
            <div className='h-10/12 w-10/12 bg-[rgba(67,67,67,0.42)] backdrop-blur-sm border border-white/10 overflow-y-auto pt-5 pb-5 rounded-3xl'>
            <section className="px-10">
                <section >
                    <h2 className="text-[3em] font-semibold  text-center">Favoris</h2>
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2">Livres audio</h3>
                    </div>

                        <div className="w-10/12 mb-8 m-auto">
                            <Carousel
                                opts={{
                                    align: "start",
                                    loop: true,
                                    slidesToScroll: 1,
                                    containScroll: "trimSnaps"
                                }}
                                 className="w-full mb-8"
                            >
                                <CarouselContent className='gap-2 max-w-full'>
                                    {/* All Tags */}

                                    {/* Le reste des tags */}
                                   {favoriteBooks.map((book) => (
                                        <CarouselItem key={book.id} className="basis-auto">
                                        <Card key={book.id} book={book} />
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious className="bg-neutral-800 text-white hover:bg-white hover:text-black border-none" />
                                <CarouselNext className="bg-neutral-800 text-white hover:bg-white hover:text-black border-none" />
                            </Carousel>
                        </div>
                    <div className="flex w-10/12 justify-around m-auto">
                        <div className="mb-6">
                            <div className="group inline-flex items-center gap-x-2 px-3 py-1">
                                <h3 className="text-xl font-semibold mb-2"> Auteurs</h3>
                                <FaFeatherAlt className="text-white text-[0.7rem] group-hover:text-black transition" />
                            </div>
                            
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
                            <div className="group inline-flex items-center gap-x-2 px-3 py-1">
                                <h3 className="text-xl font-semibold mb-2">Narrateurs</h3>
                                <FaMicrophoneAlt className="text-white text-[0.7rem] group-hover:text-black transition" />
                            </div>
                            
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
                            <div className="group inline-flex items-center gap-x-2 px-3 py-1">
                                <h3 className="text-xl font-semibold mb-2">Éditeurs</h3>
                                <FaBuilding className="text-white text-[0.7rem] group-hover:text-black transition" />
                            </div>
                            
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
                    </div>
                </section>
            </section>
            </div>
        </main>
    );
}

export default ProfileView;
