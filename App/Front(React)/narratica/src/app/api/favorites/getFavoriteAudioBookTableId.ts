
import axios from "axios";
import { url } from "../baseUrl";

export interface LinkTableQuery {
    user : number;
    book : number;
};

export interface LinkTable {
    id: number
    user : number;
    book : number;
};



export const fetchFavoriteAudioBookTableId = async (linkTableQuery : LinkTableQuery): Promise<LinkTable[]> => {
    
    let routeUrl = url + `api/favorites/books/?user=${linkTableQuery.user}&book=${linkTableQuery.book}`
    
    try {
        const response = await axios.get<LinkTable[]>(routeUrl);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};
