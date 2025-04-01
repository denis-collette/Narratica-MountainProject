import axios from "axios";
import  { url, Audiobook }  from './getAllAudioBooks';

export const fetchAudioBooksByPubliser = async (publisherId : number, quantity? : number): Promise<Audiobook[]> => {
    
    let routeUrl = url + `api/audio/author/${publisherId}`

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
