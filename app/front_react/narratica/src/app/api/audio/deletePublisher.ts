import axios from 'axios';
import { url } from "../baseUrl";

export const deletePublisher = async (id: number) => {
    try {
        const response = await axios.delete(`${url}/api/publishers/${id}/`);
        return response.data;
    } catch (error) {
        console.error('Error deleting publisher:', error);
        throw error;
    }
};