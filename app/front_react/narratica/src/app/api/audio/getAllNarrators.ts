import axios from "axios";
import { url } from "../baseUrl";

export interface Tag {
    id: number;
    name: string;
}

export const fetchAllNarrators = async (): Promise<Tag[]> => {

    let routeUrl = url + `/api/narrators/`

    try {
        const response = await axios.get<Tag[]>(routeUrl);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};
