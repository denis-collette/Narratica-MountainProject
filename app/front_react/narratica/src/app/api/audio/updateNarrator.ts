import axios from 'axios';
import { url } from "../baseUrl";

export const updateNarrator = async (id: number, updatedData: FormData) => {
    try {
        const response = await axios.put(`${url}/api/narrators/${id}/`, updatedData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating narrator:', error);
        throw error;
    }
};

