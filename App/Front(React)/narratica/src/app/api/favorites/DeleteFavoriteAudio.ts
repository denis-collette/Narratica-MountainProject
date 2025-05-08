import axios from 'axios';
import { url } from "../baseUrl";

export interface DeleteFavoriteAudioBook {
    id: number;
}

// *TODO to test in local
export const deleteFavoriteAudioBook = async (deleteFavoriteAudioBook: DeleteFavoriteAudioBook) => {
    const routeUrl = url + `api/favorites/books/${deleteFavoriteAudioBook.id}/`;

    try {
        const response = await axios.delete(routeUrl);
        console.log('Response data:', response.data);
    } catch (error) {
        console.error('Error:', error);
    }
};
