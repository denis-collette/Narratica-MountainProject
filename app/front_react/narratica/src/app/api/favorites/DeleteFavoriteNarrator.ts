import axios from 'axios';
import { url } from "../baseUrl";

export interface DeleteFavoriteNarrator {
    id: number;
}

// *TODO to test in local
export const DeleteFavoriteNarrator = async (DeleteFavoriteNarrator: DeleteFavoriteNarrator) => {
    const routeUrl = url + `api/favorites/narrators/${DeleteFavoriteNarrator.id}/`;

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
        console.error('Error deleting favorite narrator: ', error);
    }
};
