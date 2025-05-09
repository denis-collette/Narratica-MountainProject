import axios from "axios";
import { url } from "../baseUrl";
import  { Audiobook }  from './getAllAudioBooks';

export const fetchAudioBooksByNarrator = async (narratorId : number, quantity? : number): Promise<Audiobook[]> => {
    
    let routeUrl = url + `api/audiobooks/by-narrator/${narratorId}`

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
