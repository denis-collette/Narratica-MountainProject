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

        const loginData = response.data;

        // Store tokens & basic info
        localStorage.setItem("access", loginData.access);
        localStorage.setItem("refresh", loginData.refresh);
        localStorage.setItem("username", loginData.username);
        localStorage.setItem("user_id", loginData.user_id.toString());

        // Fetch and store profile image
        const profileRes = await axios.get(`${url}api/users/${loginData.user_id}/`, {
            headers: {
                Authorization: `Bearer ${loginData.access}`,
            },
        });

        localStorage.setItem("profile_img", profileRes.data.profile_img || "");

        return loginData;
    } catch (error) {
        console.error("Error logging in:", error);
        return null;
    }
};
