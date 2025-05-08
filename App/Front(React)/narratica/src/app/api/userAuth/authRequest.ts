import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { refreshAccessToken } from "./refreshToken";

const BASE_HEADERS = () => {
    const token = localStorage.getItem("access");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const authRequest = async <T = any>(
    config: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
    try {
        const response = await axios({
            ...config,
            headers: {
                ...BASE_HEADERS(),
                ...config.headers,
            },
        });

        return response;
    } catch (error: any) {
        // Check if error is due to token expiration
        if (error.response?.status === 401) {
            const newAccess = await refreshAccessToken();

            if (newAccess) {
                // Retry with the new access token
                try {
                    const retryResponse = await axios({
                        ...config,
                        headers: {
                            Authorization: `Bearer ${newAccess}`,
                            ...config.headers,
                        },
                    });

                    return retryResponse;
                } catch (retryError) {
                    console.error("Retry after token refresh failed", retryError);
                    throw retryError;
                }
            } else {
                console.warn("Access token refresh failed.");
            }
        }

        throw error;
    }
};
