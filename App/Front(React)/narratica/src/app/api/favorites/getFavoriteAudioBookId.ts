import axios from "axios";
import  { url, Audiobook }  from '../audio/getAllAudioBooks';


export interface FavoriteAudioBook {
    id : number;
    user : number;
    book : number;

};



export const fetchFavoriteAudioBookId = async (user_id : number): Promise<FavoriteAudioBook[]> => {
    
    let routeUrl = url + `api/favorite/audioBook/${user_id}/`
    
    try {
        const response = await axios.get<FavoriteAudioBook[]>(routeUrl);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};
