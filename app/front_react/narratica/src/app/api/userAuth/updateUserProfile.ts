import { url } from "../baseUrl";
import { authRequest } from "./authRequest";

export interface UpdateUserProfileData {
    username?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    profile_img?: File | null;
}

export const updateUserProfile = async (
    userId: number,
    updatedData: UpdateUserProfileData
): Promise<any> => {
    const routeUrl = url + `api/users/${userId}/`;

    const formData = new FormData();
    Object.entries(updatedData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            formData.append(key, value);
        }
    });

    try {
        const response = await authRequest({
            method: "PATCH",
            url: routeUrl,
            data: formData,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw error;
    }
};
