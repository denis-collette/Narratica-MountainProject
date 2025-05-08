import axios from 'axios';
import { url } from "../baseUrl";


export interface PostFavoriteAudioBook {
    //csrfmiddlewaretoken: string
    user : number;
    book : number;

};

// *TODO to test in local
export const postFavoriteAudioBook = async ( postFavoriteAudioBook : PostFavoriteAudioBook) => {
    const routeUrl = url + `api/favorites/books/`
    
    try {
        const token = localStorage.getItem("access");

        const response = await axios.post<PostFavoriteAudioBook>(routeUrl, postFavoriteAudioBook, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        console.log('Response data:', response.data);
        
    } catch (error) {
        console.error('Error posting favorite audiobook:', error);
    }
}