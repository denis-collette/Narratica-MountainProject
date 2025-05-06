import axios from "axios";
import { url } from "../baseUrl";

export interface Audiobook {
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

export type BookWithAuthorAndNarrator = Audiobook & { authorName?: string; narratorName?: string }

export const fetchAllAudioBooks = async (): Promise<Audiobook[]> => {

    let routeUrl = url + "api/audiobooks"

    try {
        const response = await axios.get<Audiobook[]>(routeUrl);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};
