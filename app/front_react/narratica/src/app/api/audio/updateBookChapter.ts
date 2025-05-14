import axios from 'axios';
import { url } from "../baseUrl";

export const updateBookChapter = async (id: number, updatedData: FormData) => {
    try {
        const response = await axios.put(`${url}/api/bookchapters/${id}/`, updatedData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating chapter:', error);
        throw error;
    }
};

