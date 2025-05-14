import axios from 'axios';
import { url } from "../baseUrl";

export const postBookChapter = async (chapterData: FormData) => {
    try {
        const response = await axios.post(`${url}/api/bookchapters/`, chapterData, {
            headers: { 
                'Content-Type': 'multipart/form-data' 
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error posting chapter:', error);
        throw error;
    }
};