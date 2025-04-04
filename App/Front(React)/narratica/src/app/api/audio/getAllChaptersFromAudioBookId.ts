import axios from "axios";
import  { url}  from './getAllAudioBooks';


export interface Chapter {
    id : number;
    chapter_number : number;
    number_of_listening : number;
    cover_art_thumbnail: string;
    total_time: string;
    upload_date: string;
    total_number_of_listening: number;
    audio_data: string;
    book: number;
};

export const fetchAudioBooksChaptersById = async (bookId : number ): Promise<Chapter[]> => {
    
    let routeUrl = url + `api/audio/chapters/${bookId}`

 
    
    try {
        const response = await axios.get<Chapter[]>(routeUrl);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};
