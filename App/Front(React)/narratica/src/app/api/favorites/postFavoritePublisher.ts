import axios from 'axios';
import { url } from "../baseUrl";


export interface PostFavoritePublisher {
    //csrfmiddlewaretoken: string
    user : number;
    publisher : number;

};

// *TODO to test in local
export const postFavoritePublisher = async ( PostFavoritePublisher : PostFavoritePublisher) => {
    const routeUrl = url + `api/favorites/publishers/`
    
    try {
        const token = localStorage.getItem("access");

        const response = await axios.post<PostFavoritePublisher>(routeUrl, PostFavoritePublisher, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        console.log('Response data:', response.data);
        
    } catch (error) {
        console.error('Error posting favorite publisher:', error);
    }
}