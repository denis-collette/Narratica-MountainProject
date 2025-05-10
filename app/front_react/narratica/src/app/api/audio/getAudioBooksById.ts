import axios from "axios";
import { url } from "../baseUrl";
import  { Audiobook }  from './getAllAudioBooks';

export const fetchAudioBooksById = async (bookId : number): Promise<Audiobook> => {
    
    let routeUrl = url + `api/audiobooks/${bookId}`

 
    
    try {
        const response = await axios.get<Audiobook>(routeUrl);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};
