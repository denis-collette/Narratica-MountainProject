import axios from "axios";
import  { url }  from '../audio/getAllAudioBooks';


export interface FavoriteNarrator {
    id : number;
    user : number;
    narrator : number;

};



export const fetchFavoriteNarratorId = async (user_id : number): Promise<FavoriteNarrator[]> => {
    
    let routeUrl = url + `api/favorite/narrator/${user_id}/`
    
    try {
        const response = await axios.get<FavoriteNarrator[]>(routeUrl);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};
