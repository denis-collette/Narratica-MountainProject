import axios from "axios";

interface UserProfile {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    last_login: string;
    is_active: boolean;
    date_joined: string;
    is_staff: boolean;
}

export const fetchUserProfile = async (userId: number): Promise<UserProfile | null> => {
    const routeUrl = `http://127.0.0.1:8000/api/users/${userId}/`;
    
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
