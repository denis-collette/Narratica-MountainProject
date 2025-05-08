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
        const token = localStorage.getItem("access");
        const response = await fetch(routeUrl, { 
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: FavoritePublisher[] = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};
