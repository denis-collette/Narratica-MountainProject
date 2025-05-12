import { url } from "../baseUrl";
import { authRequest } from "./authRequest";

export const deleteUserProfile = async (userId: number): Promise<boolean> => {
    const routeUrl = url + `api/users/${userId}/`;

    try {
        await authRequest({
            method: "DELETE",
            url: routeUrl,
        });

        return true;
    } catch (error) {
        console.error("Error deleting user profile:", error);
        return false;
    }
};
