import axios from 'axios';
import { url } from "../baseUrl";

export const postTag = async (tag: { name: string }) => {
    try {
        const response = await axios.post(`${url}/api/tags/`, tag, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error posting tag:', error);
        throw error;
    }
};