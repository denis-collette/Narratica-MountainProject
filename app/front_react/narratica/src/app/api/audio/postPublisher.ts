import axios from 'axios';
import { url } from "../baseUrl";

export const postPublisher = async (publisherData: FormData) => {
    try {
        const response = await axios.post(`${url}/api/publishers/`, publisherData, {
            headers: { 
                'Content-Type': 'multipart/form-data' 
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error posting publisher:', error);
        throw error;
    }
};
