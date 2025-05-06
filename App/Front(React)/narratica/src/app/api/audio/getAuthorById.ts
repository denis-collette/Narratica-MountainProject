import axios from "axios";
import { url } from "../baseUrl";

export interface Author {
    id: number;
    name: string;
};


export const fetchAuthorById  = async (authorId : number): Promise<Author> => {

    let routeUrl = url + `api/authors/${authorId}`

    try {
        const response = await axios.get<Author>(routeUrl);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};
