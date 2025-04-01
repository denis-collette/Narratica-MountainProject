"use client"
import { useEffect, useState } from 'react';
import NavBar from "@/components/NavBar"
import ChapterCard from "@/components/chapterCard"
import { fetchAudioBooksChapterById , Chapter} from '../api/audio/getAllChaptersFromAudioBookId'
import { fetchAudioBooksById } from '../api/audio/getAudioBooksById'
import { Audiobook } from '../api/audio/getAllAudioBooks'


function bookView(){

    const id = 1;
    const [loadingAudioBook, setLoadingAudioBook] = useState(true);
    const [loadingChapter, setLoadingChapter] = useState(true);
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [audiobook, setAudioBook] = useState<Audiobook[]>([])

      useEffect(() => {
            const loadChapters= async () => {
                let allChapterObject  = await fetchAudioBooksChapterById(id)
                setChapters(allChapterObject);
                setLoadingChapter(false);
            };
            loadChapters();
        }, []);

        useEffect(() => {
            const loadBook = async () => {
                let audiobook  = await fetchAudioBooksById(id)
                setAudioBook(audiobook);
                setLoadingAudioBook(false);
            };
            loadBook();
        }, []);


        
    return(
        <section>
            {loadingChapter  && loadingAudioBook ? (
                <p>Chargement...</p>
            ) : (
            <div className="containerFull" >
                <div className="imageAndTitle">
                    <div className="image">
                    <img src={audiobook[0]?.cover_art_jpg} ></img>
                    </div>
                    <div className="titleText">
                        <h1>{audiobook[0]?.title}</h1>
                        <div>
                            <h2>{audiobook[0]?.author} author </h2>
                            <h2>{audiobook[0]?.narrator} narrator</h2>
                            <h2>{audiobook[0]?.total_time}</h2>
                        </div>
                    </div>
                </div>
                <div className='description'>
                    <h2>Narrated by : {audiobook[0]?.narrator}</h2>
                    <h2>{audiobook[0]?.description}</h2>
                </div>
                <div className="cardContainer">
                    
                        <ul>
                            {chapters.map((chapter) => (
                                <li key={chapter.chapter_number}>
                                    <ChapterCard chapter_number = {chapter.chapter_number}  id = {chapter.id} number_of_listening = {chapter.number_of_listening} cover_art_thumbnail = {chapter.cover_art_thumbnail} total_time={chapter.total_time} upload_date={chapter.upload_date} total_number_of_listening={chapter.number_of_listening} audio_data={chapter.audio_data} book={chapter.book}/>
                                </li>
                            ))}
                        </ul>
                </div>
            </div>)}
        </section>)
    
}

export default bookView