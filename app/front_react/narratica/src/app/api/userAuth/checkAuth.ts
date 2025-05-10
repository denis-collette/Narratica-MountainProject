import { jwtDecode } from "jwt-decode";

interface JwtPayload {
    exp: number;
    [key: string]: any;
}

export const isAuthenticated = (): boolean => {
    const token = localStorage.getItem("access");
    if (!token) return false;

    try {
        const decoded = jwtDecode<JwtPayload>(token);
        const currentTime = Math.floor(Date.now() / 1000);

        return decoded.exp > currentTime;
    } catch (error) {
        console.error("Invalid token:", error);
        return false;
    }
};
