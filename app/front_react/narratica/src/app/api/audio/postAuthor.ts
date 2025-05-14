import axios from 'axios';
import { url } from "../baseUrl";

export const postAuthor = async (authorData: FormData) => {
    try {
        const response = await axios.post(`${url}/api/authors/`, authorData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error posting author:', error);
        throw error;
    }
};