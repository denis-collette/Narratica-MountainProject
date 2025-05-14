import axios from 'axios';
import { url } from "../baseUrl";
import { Audiobook } from './getAllAudioBooks';
import { Chapter } from './getAllChaptersFromAudioBookId';

/*
Post steps

1) If user  entered custom tags, Author, Narrator, Publisher Post them and wait awnser
2) Post Audiobook
3) Post chapters

postObj : [
Newtags:[...]
Author[...]
Narrator[...]
Publisher[...]
Audiobooks:[... containing the new user input too]
chapters:[...]
]
*/

interface AudiobookPost {
    bookInfo : 
    {
        title: string
        description: string
        cover_art_jpg: File | null
        language: string
        total_time: number
        total_number_of_listening : number
        authors: number | string
        narrators: number | string
        tags: number []
        publisher :  number | string
    };
    chaptersInfo :
    {
    book: number
    audio_data: File
    total_time: string;
    chapter_number: number;
    }[]
}

export const postAudioBook = async (audioBookPost: AudiobookPost) => {
    console.log(JSON.stringify(audioBookPost.bookInfo))
    try {
        const response = await axios.post(`${url}api/audiobooks/`, audioBookPost.bookInfo, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error posting audiobook:', error);
        throw error;
    }
};