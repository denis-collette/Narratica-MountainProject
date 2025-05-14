import axios from 'axios';
import { url } from "../baseUrl";

export const postNarrator = async (narrator: FormData) => {
    try {
        const response = await axios.post(`${url}/api/narrators/`, narrator, {
            headers: { 
                'Content-Type': 'multipart/form-data' 
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error posting narrator:', error);
        throw error;
    }
};