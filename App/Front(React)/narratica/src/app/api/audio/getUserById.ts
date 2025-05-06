import axios from "axios";
import { url } from "../baseUrl";

export  interface User{
    id: number,
    username: string,
    email: string,
    first_name: string,
    last_name: string,
    last_login: string,
    is_active: boolean,
    date_joined: string,
    is_staff: boolean
}

export const fetchUserById = async (userId: number): Promise<User[]> => {

    let routeUrl = url + `api/user/${userId}/`



    try {
        const response = await axios.get<User[]>(routeUrl);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};


