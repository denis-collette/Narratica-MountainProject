import axios from "axios";
import { url } from "../baseUrl";

export interface FavoriteNarrator {
    id : number;
    user : number;
    narrator : number;

};

export const fetchFavoriteNarratorId = async (user_id : number): Promise<FavoriteNarrator[]> => {
    
    let routeUrl = url + `api/favorites/narrators/?user=${user_id}`
    
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
        
                const data: FavoriteNarrator[] = await response.json();
                return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};
