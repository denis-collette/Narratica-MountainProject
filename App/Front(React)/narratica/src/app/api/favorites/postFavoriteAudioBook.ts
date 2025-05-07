import axios from 'axios';
import { url } from "../baseUrl";


export interface PostFavoriteAudioBook {
    //csrfmiddlewaretoken: string
    user : number;
    book : number;

};

// *TODO to test in local
export const postFavoriteAudioBook = async ( postFavoriteAudioBook : PostFavoriteAudioBook) => {
    let routeUrl = url + `api/favorites/books/` //? Should be `/api/favorites/?type=book&user=${userId}` Missing userId
        axios.post(routeUrl, postFavoriteAudioBook)
        .then(response => {
            console.log('Response data:', response.data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}