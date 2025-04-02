// path('api/author/<int:author_id>', views.getAuthorByID),
//     path('api/narrator/<int:narrator_id>', views.getNarratorByID),

import axios from "axios";
import { url } from './getAllAudioBooks';

export interface Author {
    id: number;
    name: string;
}

export const fetchAuthorById = async (authorId: number): Promise<Author[]> => {

    let routeUrl = url + `api/author/${authorId}`

    try {
        const response = await axios.get<Author[]>(routeUrl);
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};
