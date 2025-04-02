import axios from "axios";
import  { url, Audiobook }  from './getAllAudioBooks';

export const fetchAudioBooksByNew = async ( quantity? : number): Promise<Audiobook[]> => {
    
    // *TODO object encapsulated in array to change in backend 
    let routeUrl = url + `api/audio/new`

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
