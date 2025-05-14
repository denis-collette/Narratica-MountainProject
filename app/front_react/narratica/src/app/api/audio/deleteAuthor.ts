import axios from 'axios';
import { url } from "../baseUrl";

export const deleteAuthor = async (id: number) => {
    try {
        const response = await axios.delete(`${url}/api/authors/${id}/`);
        return response.data;
    } catch (error) {
        console.error('Error deleting author:', error);
        throw error;
    }
};