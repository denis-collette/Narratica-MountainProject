"use client"
import { useEffect, useState } from 'react';
import NavBar from "@/components/NavBar"
import ChapterCard from "@/components/chapterCard";
import { fetchAudioBooksChapterById , Chapter} from '../api/audio/getAllChaptersFromAudioBookId';
import { fetchAudioBooksById } from '../api/audio/getAudioBooksById';
import { Audiobook } from '../api/audio/getAllAudioBooks';
import { Author, fetchAuthorById } from "../api/audio/getAuthorById";
import { useColor } from 'color-thief-react';


function sortChapter(bookChapterObj :Chapter[] ){

    bookChapterObj.sort((a, b) => a.chapter_number - b.chapter_number);
    return bookChapterObj
}

interface Informations {
    chapter: Chapter[]
    audiobook: Audiobook[]
    author :Author[]
}

function bookView(){

    const id = 1;
    const [loadingAudioBook, setLoadingAudioBook] = useState(true);
    const [loadingChapter, setLoadingChapter] = useState(true);
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [audiobook, setAudioBook] = useState<Audiobook[]>([]);
    const [author , setAuthor] = useState<Author[]>([]);
    const { data, loading, error } = useColor(audiobook[0]?.cover_art_jpg, 'hslString')


      useEffect(() => {
            const loadChapters= async () => {
                let allChapterObject  = await fetchAudioBooksChapterById(id)
                setChapters(allChapterObject);
                setLoadingChapter(false);
                allChapterObject = sortChapter(allChapterObject)
            };
            loadChapters();

            const loadBook = async () => {
                let audiobook  = await fetchAudioBooksById(id)
                setAudioBook(audiobook);
            };
            loadBook();

            const loadAuthor =  async () => {
                let author  = await fetchAuthorById(id)
                setAuthor(author);
                setLoadingAudioBook(false);
            };
            loadAuthor();
        }, []);



        
    return(
        
        <section>

            {loadingChapter  && loadingAudioBook ? (
                <p>Chargement...</p>
            ) : (
            <div className="h-screen w-[70%] ml-[1%] bg-gradient-to-b from-[#006f38] from-15%  to-[#120e0c] to-45% rounded-[0.5%] mt-[1%]" >
                <div className="pt-[3%] flex items-center m-auto w-[80%] pb-[3%]">
                    <div className="w-[20%] h-0 pb-[20%] mr-[5%]">
                    <img className="rounded-[5%] shadow-[0px_0px_25px]" src={audiobook[0]?.cover_art_jpg} ></img>
                    </div>
                    <div className="text-left self-end">
                        <h1 className='text-white text-[1.5em]'>{audiobook[0]?.title}</h1>
                        <div>
                            <h2 className='text-white text-[0.7em]'>{author[0]?.name}  </h2>
                            <h2 className='text-white text-[0.5em]'>{audiobook[0]?.narrator} narrator</h2>
                            <h2 className='text-white text-[0.5em]'>{audiobook[0]?.total_time}</h2>
                        </div>
                    </div>
                </div>
                <div className='text-white pt-[3%] flex-col items-center m-auto w-[80%] pb-[3%]'>
                    <h2 className='text-[0.5em]'>Narrated by : {audiobook[0]?.narrator}</h2>
                    <h2 className='text-[0.7em]'>{audiobook[0]?.description}</h2>
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