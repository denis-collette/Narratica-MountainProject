// import axios from "axios";
import { url } from "../baseUrl";

export interface FavoriteAudioBook {
    id : number;
    user : number;
    book : number;

};

export const fetchFavoriteAudioBookId = async (user_id : number): Promise<FavoriteAudioBook[]> => {
    
    let routeUrl = url + `api/favorites/books/?user=${user_id}`
    
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

        const data: FavoriteAudioBook[] = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};
