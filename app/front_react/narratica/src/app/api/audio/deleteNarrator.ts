import axios from 'axios';
import { url } from "../baseUrl";

export const deleteNarrator = async (id: number) => {
    try {
        const response = await axios.delete(`${url}/api/narrators/${id}/`);
        return response.data;
    } catch (error) {
        console.error('Error deleting narrator:', error);
        throw error;
    }
};