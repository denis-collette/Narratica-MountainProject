import axios from 'axios';
import  { url }  from '../audio/getAllAudioBooks';
import  { FavoriteAudioBook } from './getFavoriteAudioBookId'

// *TODO to test in local
export const postFavoriteAudioBook = async ( favoriteAudioBook : FavoriteAudioBook) => {
    let routeUrl = url + `/api/playlist/create/` //? Should be `/api/favorites/?type=book&user=${userId}` Missing userId
        axios.post(routeUrl, favoriteAudioBook)
        .then(response => {
            console.log('Response data:', response.data);
        })
        .catch(error => {
            console.error('Error:', error);
        });

}