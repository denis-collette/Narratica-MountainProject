import axios from "axios";
import { url } from "../baseUrl";

interface RefreshResponse {
    access: string;
}

export const refreshAccessToken = async (): Promise<string | null> => {
    const refresh = localStorage.getItem("refresh");
    
    if (!refresh) return null;

    try {
        const response = await axios.post<RefreshResponse>(`${url}api/token/refresh/`, {
            refresh
        });

        const newAccessToken = response.data.access;
        localStorage.setItem("access", newAccessToken);
        
        return newAccessToken;

    } catch (error) {
        console.error("Error refreshing access token:", error);
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        return null;
    }
};
