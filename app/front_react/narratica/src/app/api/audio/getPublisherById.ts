import axios from "axios";
import { url } from "../baseUrl";

export interface Publisher {
    id: number;
    name: string;
};

export const fetchPublisherById  = async (publisherId : number): Promise<Publisher> => {

    let routeUrl = url + `api/publishers/${publisherId}`

    try {
        const response = await axios.get<Publisher>(routeUrl);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};
