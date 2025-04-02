import axios from "axios";
import  { url, Audiobook }  from './getAllAudioBooks';


// the recived object is encapsulated in an array 
export const fetchAudioBooksByTag = async (tagId : number, quantity? : number): Promise<Audiobook[]> => {
    
    let routeUrl = url + `api/audio/tag/${tagId}`

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
