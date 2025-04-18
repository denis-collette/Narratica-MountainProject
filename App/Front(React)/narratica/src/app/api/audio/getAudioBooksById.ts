import axios from "axios";
import  { url, Audiobook }  from './getAllAudioBooks';

export const fetchAudioBooksById = async (bookId : number): Promise<Audiobook[]> => {
    
    let routeUrl = url + `api/audio/${bookId}/`

 
    
    try {
        const response = await axios.get<Audiobook[]>(routeUrl);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};
