import axios from "axios";
import { url } from "../baseUrl";

export interface Tag {
    id: number;
    name: string;
}

export const fetchTagById = async (tagId: number): Promise<Tag[]> => {

    let routeUrl = url + `api/tags/${tagId}`

    try {
        const response = await axios.get<Tag[]>(routeUrl);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};