import axios from 'axios';
import  { url, Audiobook }  from './getAllAudioBooks';


// *TODO to test in local
export const fetchAudioBooksByNew = async ( audioBook : Audiobook) => {
    let routeUrl = url + `/api/audio/upload/`
        axios.post(routeUrl, audioBook)
        .then(response => {
            console.log('Response data:', response.data);
        })
        .catch(error => {
            console.error('Error:', error);
        });

}