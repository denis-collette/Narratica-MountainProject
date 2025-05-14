import axios from 'axios';
import { url } from "../baseUrl";

export const updatePublisher = async (id: number, updatedData: FormData) => {
    try {
        const response = await axios.put(`${url}/api/publishers/${id}/`, updatedData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating publisher:', error);
        throw error;
    }
};

