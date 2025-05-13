import axios from "axios";
import { url } from "../baseUrl";

// This function increments the number of listens for a specific chapter
export const incrementPlay = async (chapterId: number) => {
    const routeUrl = `${url}/api/bookchapters/${chapterId}/increment-listening/`;

    axios.post(routeUrl)
        .then(response => {
            console.log("Listening count updated:", response.data);
        })
        .catch(error => {
            console.error("Error incrementing listening count:", error);
        });
};
