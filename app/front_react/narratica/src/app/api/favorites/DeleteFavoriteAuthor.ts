import axios from 'axios';
import { url } from "../baseUrl";

export interface DeleteFavoriteAuthor {
    id: number;
}

// *TODO to test in local
export const deleteFavoriteAuthor = async (deleteFavoriteAuthor: DeleteFavoriteAuthor) => {
    const routeUrl = url + `api/favorites/authors/${deleteFavoriteAuthor.id}/`;

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
        console.error('Error deleting favorite author: ', error);
    }
};
