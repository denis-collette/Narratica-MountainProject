import axios from 'axios';
import { url } from "../baseUrl";

export const deleteTag = async (id: number) => {
    try {
        const response = await axios.delete(`${url}/api/tags/${id}/`);
        return response.data;
    } catch (error) {
        console.error('Error deleting tag:', error);
        throw error;
    }
}