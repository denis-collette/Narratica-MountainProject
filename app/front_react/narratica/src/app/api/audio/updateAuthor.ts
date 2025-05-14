import axios from 'axios';
import { url } from "../baseUrl";

export const updateAuthor = async (id: number, updatedData: FormData) => {
    try {
        const response = await axios.put(`${url}/api/authors/${id}/`, updatedData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating author:', error);
        throw error;
    }
};

