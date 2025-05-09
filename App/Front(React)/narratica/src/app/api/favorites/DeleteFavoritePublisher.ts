import axios from 'axios';
import { url } from "../baseUrl";

export interface DeleteFavoritePublisher {
    id: number;
}

// *TODO to test in local
export const DeleteFavoritePublisher = async (DeleteFavoritePublisher: DeleteFavoritePublisher) => {
    const routeUrl = url + `api/favorites/publishers/${DeleteFavoritePublisher.id}/`;

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
        console.error('Error deleting favorite publisher: ', error);
    }
};
