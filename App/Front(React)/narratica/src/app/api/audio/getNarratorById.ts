import axios from "axios";
import { url } from './getAllAudioBooks';

export interface Narrator {
    id: number;
    name: string;
}

export const fetchNarratorById = async (narratorId: number): Promise<Narrator[]> => {

    let routeUrl = url + `api/narrators/${narratorId}`

    try {
        const response = await axios.get<Narrator[]>(routeUrl);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};
