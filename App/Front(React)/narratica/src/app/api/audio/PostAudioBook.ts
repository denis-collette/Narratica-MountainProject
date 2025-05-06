import axios from 'axios';
import { url } from "../baseUrl";
import  { Audiobook }  from './getAllAudioBooks';


// *TODO to test in local
export const postAudioBook = async ( audioBook : Audiobook) => {
    let routeUrl = url + `/api/audiobooks/`
        axios.post(routeUrl, audioBook)
        .then(response => {
            console.log('Response data:', response.data);
        })
        .catch(error => {
            console.error('Error:', error);
        });

}