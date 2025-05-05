import axios from "axios";

interface LoginResponse {
    access: string;
    refresh: string;
    user_id: number;
    username: string;
}

export const loginUser = async (username: string, password: string): Promise<LoginResponse | null> => {
    const routeUrl = "http://127.0.0.1:8000/login/";  // Adjust the URL if needed
    
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
