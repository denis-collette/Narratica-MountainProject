"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaUser } from "react-icons/fa";
import { LuUser, LuScrollText, LuFileAudio } from "react-icons/lu";
import { FaBookMedical, FaRegImage } from "react-icons/fa6";
import { IoLanguage } from "react-icons/io5";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelect } from "@/components/MultiSelect";
import SelectOrCreate from "@/components/SelectOrCreate";
import { fetchAllTags, Tag } from "../api/audio/getAllTags";
import AudioFileUploader from "@/components/AudioFileUploader"
import { fetchAllNarrators } from "../api/audio/getAllNarrators";
import { fetchAllAuthors } from "../api/audio/getAllAuthors";
import { postAudioBook } from "../api/audio/PostAudioBook";

interface AudiobookPost {
    bookInfo : 
    {
        title: string
        description: string
        cover_art_jpg: File | null
        language: string
        total_time: number
        total_number_of_listening : number
        authors: number | string
        narrators: number | string
        tags: number []
        publisher :  number | string
    };
    chaptersInfo :
    {
    book: number
    audio_data: File
    total_time: string;
    chapter_number: number;
    }[]
}


// Données mockées pour le développement
const languages = [
    { id: "fr", name: "Français" },
    { id: "en", name: "Anglais" },
    { id: "es", name: "Espagnol" },
    { id: "de", name: "Allemand" },
    { id: "nl", name: "Néerlandais" },
    { id: "it", name: "Italien" }
];

export default function BookUploadPage() {
    const router = useRouter();

    // États pour le formulaire
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("");
    const [coverImage, setCoverImage] = useState<File | null>(null);

    // États pour les tags
    const [tags, setTags] = useState<Tag[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    // États pour l'auteur
    const [authors, setAuthors] =  useState<Tag[]>([]);
    const [selectedAuthor, setSelectedAuthor] = useState("");
    const [isAddingNewAuthor, setIsAddingNewAuthor] = useState(false);
    const [newAuthorName, setNewAuthorName] = useState("");

    // États pour le narrateur
    const [narrators, setNarrators] =  useState<Tag[]>([]);
    const [selectedNarrator, setSelectedNarrator] = useState("");
    const [isAddingNewNarrator, setIsAddingNewNarrator] = useState(false);
    const [newNarratorName, setNewNarratorName] = useState("");

    // État pour les erreurs
    const [error, setError] = useState("");


    const [isAddingNewTag, setIsAddingNewTag] = useState(false);

    // Gestionnaires d'événements

    const handleAddNewTag = (name: string) => {
        const newTag: Tag = {
            id: Date.now(),
            name: name
        };
        setTags(prev => [...prev, newTag]);
        setSelectedTags(prev => [...prev, newTag.id.toString()]);
    };

    useEffect(() => {
        const loadTags = async () => {
            const allTags = await fetchAllTags();
            setTags(allTags);
        };
        loadTags();
    }, []);

          useEffect(() => {
        const loadAuthors = async () => {
            const allAuthors = await fetchAllAuthors();
            setAuthors(allAuthors);
        };
        loadAuthors();
    }, []);

       useEffect(() => {
        const loadNarrators = async () => {
            const allNarrators = await fetchAllNarrators();
            setNarrators(allNarrators);
        };
        loadNarrators();
    }, []);

    const handleTagSelection = (tagId: string) => {
        setSelectedTags(prev => {
            if (prev.includes(tagId)) {
                return prev.filter(id => id !== tagId);
            }
            return [...prev, tagId];
        });
    };

    const removeTag = (tagId: string) => {
        setSelectedTags(prev => prev.filter(id => id !== tagId));
    };

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const handleFilesSelected = (files: File[]) => {
        setSelectedFiles(files);
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Validation basique
        if (!title || !selectedAuthor || !selectedNarrator || !selectedLanguage) {
            setError("Veuillez remplir tous les champs obligatoires");
            return;
        }
        setError("");
        
        const audiobookPost: AudiobookPost = {
        bookInfo: {
            title: title,
            description: description,
            cover_art_jpg: null, 
            language: selectedLanguage,
            total_time: 0,
            total_number_of_listening: 0,
            narrators: selectedNarrator,
            tags: [1],
            publisher: 1,
            authors: selectedAuthor,
        },
        chaptersInfo: selectedFiles.map((file, index) => ({
            book: 0, // replace when book created 
            audio_data: file,
            total_time: "00:11:05", 
            chapter_number: index + 1,
        })),
        };
    if (coverImage) {
        audiobookPost.bookInfo.cover_art_jpg = coverImage;
    }

    postAudioBook(audiobookPost)

    };

    return (
        <section className="fixed inset-0 overflow-y-auto [&::-webkit-scrollbar]:hidden mb-25 mt-15">
            <section className="min-h-screen bg-gradient-to-b from-[#000000] from-0% to-[#120e0c] to-90% py-10">
                <section className="mx-auto bg-[#1b1b1b] p-8 rounded-lg shadow-lg w-[450px] relative">
                    <img src="./favicon.ico" className="w-16 mx-auto mb-6" alt="Favicon" />
                    <h1 className="text-white font-bold text-3xl text-center mb-8">
                        Ajouter un livre audio
                    </h1>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <section className="relative">
                            <label className="text-white text-lg mb-2 block">Titre</label>
                            <section className="relative">
                                <FaBookMedical className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-[#2b2b2b] text-white pl-10 pr-4 py-3 rounded-md focus:outline-none"
                                    placeholder="Titre du livre audio"
                                />
                            </section>
                        </section>

                        <section className="grid grid-cols-2 gap-4">
                            <SelectOrCreate
                                label="Auteur"
                                options={authors}
                                selectedValue={selectedAuthor}
                                onSelect={setSelectedAuthor}
                                isAddingNew={isAddingNewAuthor}
                                setIsAddingNew={setIsAddingNewAuthor}
                                newName={newAuthorName}
                                setNewName={setNewAuthorName}
                                icon={<LuUser />}
                                placeholder="Sélectionnez un auteur"
                            />

                            <SelectOrCreate
                                label="Narrateur"
                                options={narrators}
                                selectedValue={selectedNarrator}
                                onSelect={setSelectedNarrator}
                                isAddingNew={isAddingNewNarrator}
                                setIsAddingNew={setIsAddingNewNarrator}
                                newName={newNarratorName}
                                setNewName={setNewNarratorName}
                                icon={<LuUser />}
                                placeholder="Sélectionnez un narrateur"
                            />
                        </section>

                        <section className="relative">
                            <label className="text-white text-lg mb-2 block">Image de couverture</label>
                            <section className="relative">
                                <FaRegImage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="file"
                                    onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
                                    className="w-full bg-[#2b2b2b] text-white pl-10 pr-4 py-3 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-green-500 file:text-white hover:file:bg-green-600"
                                    accept="image/*"
                                />
                            </section>
                        </section>

                        <section className="relative">
                            <label className="text-white text-lg mb-2 block">Description</label>
                            <section className="relative">
                                <LuScrollText className="absolute left-3 top-6 transform -translate-y-1/2 text-gray-400" />
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full bg-[#2b2b2b] text-white pl-10 pr-4 py-3 rounded-md focus:outline-none min-h-[100px] max-h-[200px] overflow-y-auto resize-none"
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
                        selectedValues={selectedTags}
                        onSelect={handleTagSelection}
                        onRemove={removeTag}
                        onAddNewTag={handleAddNewTag}
                    />
                    <section className="relative">
                        <AudioFileUploader onFilesSelected={handleFilesSelected}></AudioFileUploader>
                    </section>
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
            </section>
        </section>
    );
}


/*
Post steps

1) If user  entered custom tags, Author, Narrator, Publisher Post them and wait awnser (No need the api should do it)
2) Post Audiobook
3) Post chapters

Because of the serializer an id must be passed but will never be used (can be random)

postObj : [
newtags:[...]
Author[...]
Narrator[...]
Publisher[...]
Audiobooks:[... containing the new user input too]
chapters:[...]
]


*/