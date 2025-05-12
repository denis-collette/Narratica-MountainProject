import axios from "axios";
import { url } from "../baseUrl";

export const registerUser = async (formData: FormData) => {
    const routeUrl = url + "api/register/";

    try {
        const response = await axios.post(routeUrl, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            console.error("Error registering user:", error.response?.data || error.message);
            return error.response;
        } else {
            console.error("Unknown error:", error);
            return null;
        }
    }
};
