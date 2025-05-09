import axios from 'axios';
import { url } from "../baseUrl";


export interface PostFavoriteNarrator {
    //csrfmiddlewaretoken: string
    user : number;
    narrator : number;

};

// *TODO to test in local
export const PostFavoriteNarrator = async ( postFavoriteNarrator : PostFavoriteNarrator) => {
    const routeUrl = url + `api/favorites/narrators/`
    
    try {
        const token = localStorage.getItem("access");

        const response = await axios.post<PostFavoriteNarrator>(routeUrl, postFavoriteNarrator, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        console.log('Response data:', response.data);
        
    } catch (error) {
        console.error('Error posting favorite narrator:', error);
    }
}