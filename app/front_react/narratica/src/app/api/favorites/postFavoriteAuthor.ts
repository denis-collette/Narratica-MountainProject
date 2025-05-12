import axios from 'axios';
import { url } from "../baseUrl";


export interface PostFavoriteAuthor {
    //csrfmiddlewaretoken: string
    user : number;
    author : number;
};

// *TODO to test in local
export const postFavoriteAuthor = async ( postFavoriteAuthor : PostFavoriteAuthor) => {
    const routeUrl = url + `api/favorites/authors/`
    
    try {
        const token = localStorage.getItem("access");

        const response = await axios.post<PostFavoriteAuthor>(routeUrl, postFavoriteAuthor, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        console.log('Response data:', response.data);
        
    } catch (error) {
        console.error('Error posting favorite author:', error);
    }
}