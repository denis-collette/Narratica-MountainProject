"use client"
import { use, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { FaUser, FaLock } from "react-icons/fa";
import { loginUser } from "../api/userAuth/login";
import { LuUser, LuScrollText, LuClock, LuFileAudio } from "react-icons/lu";
import { FaBookMedical, FaRegImage } from "react-icons/fa6";
import { IoClose, IoLanguage } from "react-icons/io5";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { fetchAllTags, Tag } from "../api/audio/getAllTags";
import { MultiSelect } from "@/components/MultiSelect";

const languages = [
    { id: "fr", name: "Français" },
    { id: "en", name: "Anglais" },
    { id: "es", name: "Espagnol" },
    { id: "de", name: "Allemand" },
    { id: "nl", name: "Néerlandais" },
    { id: "it", name: "Italien" }
];

export default function LoginPage() {
    const [tags, setTags] = useState<Tag[]>([]);
    const [selectedTag, setSelectedTag] = useState<string[]>([]);
    const [selectedLanguage, setSelectedLanguage] = useState<string>("");
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        const loadTags = async () => {
            const allTags = await fetchAllTags();
            setTags(allTags);
        };
        loadTags();
    }, []);

    const handleTagSelection = (tagId: string) => {
        setSelectedTag(prev => {
            if (prev.includes(tagId)) {
                return prev.filter(id => id !== tagId);
            }
            return [...prev, tagId];
        });
    };

    const removeTag = (tagId: string) => {
        setSelectedTag(prev => prev.filter(id => id !== tagId));
    };

    const SelectedTags = ({ selectedTags, tags, onRemove }: {
        selectedTags: string[],
        tags: Tag[],
        onRemove: (id: string) => void
    }) => {
        return (
            <div className="flex flex-wrap gap-2 mt-2">
                {selectedTags.map(tagId => {
                    const tag = tags.find(t => t.id.toString() === tagId);
                    if (!tag) return null;
                    return (
                        <span
                            key={tagId}
                            className="bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        >
                            {tag.name}
                            <button
                                type="button"
                                onClick={() => onRemove(tagId)}
                                className="hover:text-gray-200"
                            >
                                <IoClose className="size-4" />
                            </button>
                        </span>
                    );
                })}
            </div>
        );
    };

    return (
        <main className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#000000] from-0% to-[#120e0c] to-90%">
            <section className="flex-row justify-center items-center bg-[#1b1b1b] p-8 rounded-lg shadow-lg w-[450px] mb-30 mt-10">
                <img src="./favicon.ico" className="w-16 mx-auto mb-6" alt="Favicon" />
                <h1 className="text-white font-bold text-3xl text-center mb-8">Ajouter un livre audio</h1>

                <form className="space-y-6">
                    <section className="relative">
                        <label className="text-white text-lg mb-2 block">Titre</label>
                        <section className="relative">
                            <FaBookMedical className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                // value={username}
                                // onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-[#2b2b2b] text-white pl-10 pr-4 py-3 rounded-md focus:outline-none"
                                placeholder="Titre du livre audio"
                            />
                        </section>
                    </section>

                    <section className="grid grid-cols-2 gap-4">
                        <section className="relative">
                            <label className="text-white text-lg mb-2 block">Auteur</label>
                            <section className="relative">
                                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    className="w-full bg-[#2b2b2b] text-white pl-10 pr-4 py-3 rounded-md focus:outline-none"
                                    type="text"
                                    name="first_name"
                                    placeholder="Nom de l'auteur"
                                />
                            </section>
                        </section>

                        <section className="relative">
                            <label className="text-white text-lg mb-2 block">Narrateur</label>
                            <section className="relative">
                                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    className="w-full bg-[#2b2b2b] text-white pl-10 pr-4 py-3 rounded-md focus:outline-none"
                                    type="text"
                                    name="last_name"
                                    placeholder="Nom du narrateur"
                                />
                            </section>
                        </section>
                    </section>

                    <section className="relative">
                        <label className="text-white text-lg mb-2 block">Image du livre</label>
                        <section className="relative">
                            <FaRegImage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                className="w-full bg-[#2b2b2b] text-white pl-10 pr-4 py-3 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-green-500 file:text-white hover:file:bg-green-600"
                                type="file"
                                name="profile_img"
                                accept="image/*"
                            />
                        </section>
                    </section>

                    <section className="relative">
                        <label className="text-white text-lg mb-2 block">Description</label>
                        <section className="relative">
                            <LuScrollText className="absolute left-3 top-6 transform -translate-y-1/2 text-gray-400" />
                            <textarea
                                className="w-full bg-[#2b2b2b] text-white pl-10 pr-4 py-3 rounded-md focus:outline-none 
                      min-h-[100px] max-h-[200px] overflow-y-auto resize-none"
                                placeholder="Description du livre audio"
                            />
                        </section>
                    </section>

                    <section className="relative">
                        <label className="text-white text-lg mb-2 block">Langue</label>
                        <section className="relative">
                            <IoLanguage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                                <SelectTrigger className="w-full bg-[#2b2b2b] text-white pl-10 pr-4 py-3 rounded-md focus:outline-none appearance-none cursor-pointer">
                                    <SelectValue placeholder="Sélectionnez une langue" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#2b2b2b] text-white border border-gray-600">
                                    {languages.map((language) => (
                                        <SelectItem
                                            key={language.id}
                                            value={language.id}
                                            className="hover:bg-[#3b3b3b]"
                                        >
                                            {language.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </section>
                    </section>


                    <MultiSelect
                        icon={<LuFileAudio />}
                        label="Genres"
                        placeholder="Sélectionnez des genres"
                        options={tags}
                        selectedValues={selectedTag}
                        onSelect={handleTagSelection}
                        onRemove={removeTag}
                    />

                    {error && <p className="text-red-500 text-center">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-md transition-colors duration-300"
                    >
                        Publier
                    </button>
                </form>

                <p className="text-center mt-6">
                    <a href="/" className="text-green-500 hover:text-green-400 hover:underline">
                        Retour à la page d'accueil
                    </a>
                </p>
            </section>
        </main>
    );
}
