import axios from "axios";
import { url } from "../baseUrl";


interface LoginResponse {
    access: string;
    refresh: string;
    user_id: number;
    username: string;
}

export const loginUser = async (username: string, password: string): Promise<LoginResponse | null> => {
    const routeUrl = url + "api/login/";
    
    try {
        const response = await axios.post<LoginResponse>(routeUrl, {
            username,
            password
        });

        return response.data;
    } catch (error) {
        console.error("Error logging in:", error);
        return null;
    }
};
