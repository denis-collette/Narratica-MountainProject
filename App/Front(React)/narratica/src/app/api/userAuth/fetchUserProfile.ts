import axios from "axios";
import { url } from "../baseUrl";

interface UserProfile {
    id: number;
    username: string;
    profile_img: string;
    email: string;
    first_name: string;
    last_name: string;
    last_login: string;
    is_active: boolean;
    created_at: string;
    date_joined: string;
    is_staff: boolean;
    is_superuser: boolean;
} 

export const fetchUserProfile = async (userId: number): Promise<UserProfile | null> => {
    
    const routeUrl = url + `api/users/${userId}/`;
    
    const token = localStorage.getItem("access");

    try {
        const response = await axios.get<UserProfile>(routeUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return null;
    }
};
