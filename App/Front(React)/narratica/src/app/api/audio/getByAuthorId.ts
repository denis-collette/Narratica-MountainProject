import axios from "axios";
import  { url, Audiobook }  from './getAllAudioBooks';

export const fetchAudioBooksByAuthor = async (authorId : number, quantity? : number): Promise<Audiobook[]> => {
    
    let routeUrl = url + `api/audiobooks/by-author/${authorId}`

    if( quantity != undefined){
        routeUrl += `/${quantity}`
    }
    
    try {
        const response = await axios.get<Audiobook[]>(routeUrl);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};
