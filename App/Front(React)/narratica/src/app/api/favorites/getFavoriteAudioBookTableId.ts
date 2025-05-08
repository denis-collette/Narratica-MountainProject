
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
        const token = localStorage.getItem("access");
        const response = await fetch(routeUrl, { 
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: LinkTable[] = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};
