import axios from 'axios';
import { url } from "../baseUrl";

export const deleteBookChapter = async (id: number) => {
    try {
        const response = await axios.delete(`${url}/api/bookchapters/${id}/`);
        return response.data;
    } catch (error) {
        console.error('Error deleting chapter:', error);
        throw error;
    }
};
