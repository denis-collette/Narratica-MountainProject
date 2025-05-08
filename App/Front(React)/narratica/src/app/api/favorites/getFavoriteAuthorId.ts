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
        const token = localStorage.getItem("access");
                const response = await fetch(routeUrl, { 
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
        
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
        
                const data: FavoriteAuthor[] = await response.json();
                return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};
