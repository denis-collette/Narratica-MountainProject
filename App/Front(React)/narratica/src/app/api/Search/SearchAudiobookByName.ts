import axios from "axios";
import { url } from "../baseUrl";
import { Audiobook } from "../audio/getAllAudioBooks";

export interface IdName{
    id : number,
    name : string
}


export interface SearchObj {
    audiobooks : Audiobook[],
    authors : IdName[],
    narrators : IdName[],
};



export const SearchAudioByName = async (name: string): Promise<SearchObj> => {

    let routeUrl = url + `api/search/${name}`
    if (name == ""){
        return {
            audiobooks: [],
            authors: [],
            narrators: [],
            }
    }


    try {
        const response = await axios.get<SearchObj>(routeUrl);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return {
            audiobooks: [],
            authors: [],
            narrators: [],
            }
    }
};