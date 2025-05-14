import axios from 'axios';
import { url } from "../baseUrl";

export const updateTag = async (id: number, tag: { name: string }) => {
    try {
        const response = await axios.put(`${url}/api/tags/${id}/`, tag, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating tag:', error);
        throw error;
    }
};