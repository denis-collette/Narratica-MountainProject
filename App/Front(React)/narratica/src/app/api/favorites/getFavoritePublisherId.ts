import axios from "axios";
import { url } from "../baseUrl";

export interface FavoritePublisher {
    id : number;
    user : number;
    publisher : number;
};

export const fetchFavoritePublisherId = async (user_id : number): Promise<FavoritePublisher[]> => {
    
    let routeUrl = url + `api/favorites/publishers/?user=${user_id}`
    
    try {
        const response = await axios.get<FavoritePublisher[]>(routeUrl);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};
