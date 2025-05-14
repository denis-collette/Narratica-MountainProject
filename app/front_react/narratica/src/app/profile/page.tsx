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
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        profile_img: null as File | null,
    });
    const [previewImg, setPreviewImg] = useState<string | null>(null);
    const [profileImgUrl, setProfileImgUrl] = useState<string | null>(null);

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
                if (userData) {
                    setFormData({
                        username: userData.username,
                        email: userData.email,
                        first_name: userData.first_name,
                        last_name: userData.last_name,
                        profile_img: null,
                    });
                    setProfileImgUrl(userData.profile_img || null);
                };

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

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData((prev) => ({ ...prev, profile_img: file }));
            setPreviewImg(URL.createObjectURL(file));
        }
    };

    const saveProfileChanges = async () => {
        if (!userId) return;

        try {
            const updatedUser = await updateUserProfile(Number(userId), formData);

            localStorage.setItem("profile_img", updatedUser.profile_img || "");
            if (updatedUser.profile_img) {
                setProfileImgUrl(`${updatedUser.profile_img}?cb=${Date.now()}`);
            }

            setUserInfo(updatedUser);
            setEditMode(false);
            setPreviewImg(null);
        } catch (error) {
            console.error("❌ Failed to update profile:", error);
        }
    };

    const deleteAccount = async () => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) return;

        try {
            const success = await deleteUserProfile(Number(userId));
            if (success) {
                localStorage.clear();
                window.location.href = "/";
            }
        } catch (error) {
            console.error("Erreur lors de la suppression du compte:", error);
        }
    }

    if (loading) return <p className="text-white text-center mt-8">Chargement...</p>;
    if (!userInfo) return <p className="text-white text-center mt-8">Utilisateur non trouvé</p>;

    return (
        <main className="min-h-screen bg-black text-white mb-10">
            <section className="p-10">
                <div className="flex items-start gap-10">
                    <div>
                        <img
                            src={previewImg || profileImgUrl || "https://github.com/shadcn.png" + `?cb=${Date.now()}`}
                            alt="Profile"
                            className="rounded-full h-52 w-52 object-cover"
                        />
                        {editMode && (
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="mt-2 text-sm"
                            />
                        )}
                    </div>

                    <div className="space-y-4 flex-1">
                        {editMode ? (
                            <>
                                <input
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    placeholder="Nom d'utilisateur"
                                    className="w-full bg-gray-800 text-white px-4 py-2 rounded"
                                />
                                <input
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Email"
                                    className="w-full bg-gray-800 text-white px-4 py-2 rounded"
                                />
                                <input
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleInputChange}
                                    placeholder="Prénom"
                                    className="w-full bg-gray-800 text-white px-4 py-2 rounded"
                                />
                                <input
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleInputChange}
                                    placeholder="Nom"
                                    className="w-full bg-gray-800 text-white px-4 py-2 rounded"
                                />

                                <div className="flex gap-4 mt-4">
                                    <button onClick={saveProfileChanges} className="px-4 py-2 bg-green-600 rounded hover:bg-green-500">
                                        Enregistrer
                                    </button>
                                    <button onClick={() => setEditMode(false)} className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">
                                        Annuler
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h1 className="text-4xl font-bold">{userInfo.username}</h1>
                                <p>Email : {userInfo.email}</p>
                                <p>Nom : {userInfo.first_name} {userInfo.last_name}</p>
                                <p>Narraticien depuis : {new Date(userInfo.date_joined).toLocaleDateString('fr-FR')}</p>
                                <div className="flex gap-4">
                                    <button onClick={() => setEditMode(true)} className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">
                                        Modifier le profil
                                    </button>
                                    <button onClick={deleteAccount} className="px-4 py-2 bg-red-600 rounded hover:bg-red-500">
                                        Supprimer le compte
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <section className="mt-10">
                    <h2 className="text-2xl font-semibold mb-4">Favoris</h2>

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
        </main>
    );
}

export default ProfileView;