import axios from "axios";

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

export let url = "http://127.0.0.1:8000/"; // url to change when deployed

export const fetchAllAudioBooks = async (): Promise<Audiobook[]> => {

    let routeUrl = url + "api/audio"

    try {
        const response = await axios.get<Audiobook[]>(routeUrl);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};
