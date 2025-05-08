import axios from "axios";
import { url } from "../baseUrl";

export interface FavoriteAuthor {
    id : number;
    user : number;
    author : number;

};

export const fetchFavoriteAuthorId = async (user_id : number): Promise<FavoriteAuthor[]> => {
    
    let routeUrl = url + `api/favorites/authors/?user=${user_id}`
    
    try {
        const response = await axios.get<FavoriteAuthor[]>(routeUrl);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};
