import axios from 'axios';
import { url } from "../baseUrl";

export interface DeleteFavoriteAudioBook {
    id: number;
}

// *TODO to test in local
export const deleteFavoriteAudioBook = async (deleteFavoriteAudioBook: DeleteFavoriteAudioBook) => {
    const routeUrl = url + `api/favorites/books/${deleteFavoriteAudioBook.id}/`;

    try {
        const token = localStorage.getItem("access");


        const response = await axios.delete(routeUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log('Response data: ', response.data);
        console.log("Deleted successfully: ", response.status);

    } catch (error) {
        console.error('Error deleting favorite audiobook: ', error);
    }
};
