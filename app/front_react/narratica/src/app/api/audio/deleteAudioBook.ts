import axios from 'axios';
import { url } from "../baseUrl";

export const deleteAudioBook = async (id: number) => {
    try {
        const response = await axios.delete(`${url}/api/audiobooks/${id}/`);
        return response.data;
    } catch (error) {
        console.error('Error deleting audiobook:', error);
        throw error;
    }
};
