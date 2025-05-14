import axios from 'axios';
import { url } from "../baseUrl";

export const updateAudioBook = async (id: number, updatedData: FormData) => {
    try {
        const response = await axios.put(`${url}/api/audiobooks/${id}/`, updatedData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating audiobook:', error);
        throw error;
    }
};
