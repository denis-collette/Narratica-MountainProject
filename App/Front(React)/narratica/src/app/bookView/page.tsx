"use client"
import { useEffect, useState } from 'react';
import NavBar from "@/components/NavBar"
import ChapterCard from "@/components/chapterCard";
import { fetchAudioBooksChaptersById , Chapter} from '../api/audio/getAllChaptersFromAudioBookId';
import { fetchAudioBooksById } from '../api/audio/getAudioBooksById';
import { Audiobook } from '../api/audio/getAllAudioBooks';
import { Author, fetchAuthorById } from "../api/audio/getAuthorById";
import  { Narrator,fetchNarratorById} from '../api/audio/getNarratorById'
import { useColor } from 'color-thief-react'
import { useSearchParams } from 'next/navigation';
/*
href={/pathname:"bookView" query:{id:x}}
*/



function sortChapter(bookChapterObj :Chapter[] ){
    bookChapterObj.sort((a, b) => a.chapter_number - b.chapter_number);
    return bookChapterObj
}
interface Informations {
    chapters: Chapter[];
    audiobook: Audiobook[];
    author: Author[];
    narrator: Narrator[];
    loadingAudioBook: boolean;
    loadingChapter: boolean;
}



function bookView({searchParams} : {searchParams : {id : string;}}) {
    let id = 1

    const params = useSearchParams()
    const strId = params.get('id')
    if(strId !== null){
        id = parseInt(strId)
    }
    
    const [informations, setState] = useState<Informations>({
        chapters: [],
        audiobook: [],
        author: [],
        narrator:[],
        loadingAudioBook: true,
        loadingChapter: true,
    });

    const { data, loading, error } = useColor(informations.audiobook[0]?.cover_art_thumbnail , 'hslString',{crossOrigin : "Anonymous"}) // still not working


    useEffect(() => {
        const loadData = async () => {
            try {
                let chapters = await fetchAudioBooksChaptersById(id);
                chapters = sortChapter(chapters);
                let audiobook = await fetchAudioBooksById(id);

                if (audiobook && audiobook.length > 0) {
                    let author = await fetchAuthorById(audiobook[0]?.author);
                    let narrator = await fetchNarratorById(audiobook[0]?.narrator);
                    setState((prevState) => ({
                        ...prevState,
                            author,
                            narrator,
                    }));
                }
                setState((prevState) => ({
                    ...prevState,
                    chapters: chapters,
                    loadingChapter: false,
                    audiobook,
                }));
            } catch (error) {
                console.error("Error loading data:", error);
            }
        };
        loadData();
    }, [id]);


    /** 
     * TODO: This use state curently return an error in google console
     * 
     * from origin 'http://localhost:3000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
     * 
     * Is supposed to retrive the most dominent color of an image, problem probably from AWS options
    */
    // useEffect(() => {
    //     console.log('Color Data:', data);
    //     console.log('Loading:', loading);
    //     console.log('Error:', error);
    //   }, [data, loading, error]);



    return(
        <section>
            {informations.loadingChapter  && informations.loadingAudioBook ? (
                <p>Chargement...</p>
            ) : (
            <div className="min-h-[90vh] w-[70%] ml-[1%] bg-gradient-to-b from-[#006f38] from-15%  to-[#120e0c] to-45% rounded-[0.5%] " >
                <div className="pt-[3%] flex items-center m-auto w-[80%] pb-[3%]">
                    <div className="w-[20%] h-0 pb-[20%] mr-[5%]">
                    <img className="rounded-[5%] shadow-[0px_0px_25px]" src={informations.audiobook[0]?.cover_art_jpg} ></img>
                    </div>
                    <div className="text-left self-end">
                        <h1 className='text-white text-[1.5em] font-bold'>{informations.audiobook[0]?.title}</h1>
                        <div>
                            <h2 className='text-white text-[0.7em]'>{informations.author[0]?.name} . {informations.narrator[0]?.name} narrator . {informations.audiobook[0]?.total_time} </h2>
                        </div>
                    </div>
                </div>
                <div className='bg-gray-800/25'>
                    <div className='text-white pt-[3%] flex-col items-center m-auto w-[80%] pb-[3%]'>
                        <h2 className='text-[0.5em]'>Narrated by : {informations.narrator[0]?.name}</h2>
                        <h2 className='text-[0.7em]'>{informations.audiobook[0]?.description}</h2>
                    </div>
                    <div className=' h-3/6 overflow-y-auto'>
                    <div className="grid grid-cols-[0.1fr_0.8fr_0.4fr_0.5fr] grid-rows-1 mx-auto w-[80%] text-[hsl(0,0%,70%)] items-center justify-between Arial">
                        <div className='text-[hsl(0,_0%,_70%)] text-xs' >#</div>
                        <div className='text-[hsl(0,_0%,_70%)] text-xs'>Chapters</div>
                        <div className='text-[hsl(0,_0%,_70%)] text-xs text-center'>Lectures</div>
                        <div className='text-[hsl(0,_0%,_70%)] text-xs text-right'>Time</div>
                    </div>
                            <ul>
                                {informations.chapters.map((chapter) => (
                                    <li key={chapter.chapter_number}>
                                        <ChapterCard chapter_number = {chapter.chapter_number}  id = {chapter.id} number_of_listening = {chapter.number_of_listening} cover_art_thumbnail = {chapter.cover_art_thumbnail} total_time={chapter.total_time} upload_date={chapter.upload_date} total_number_of_listening={chapter.number_of_listening} audio_data={chapter.audio_data} book={chapter.book}/>
                                    </li>
                                ))}
                            </ul>
                    </div>
                </div>
            </div>)}
        </section>)
}
export default bookView