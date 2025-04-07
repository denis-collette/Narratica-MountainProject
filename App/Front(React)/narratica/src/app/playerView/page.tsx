"use client"
import NavBar from "@/components/NavBar"
import { useEffect, useState } from 'react';
import ChapterCard from "@/components/chapterCard";
import { fetchAudioBooksChapterById , Chapter} from '../api/audio/getChapterById';
import { fetchAudioBooksById } from '../api/audio/getAudioBooksById';
import { Audiobook } from '../api/audio/getAllAudioBooks';
import { Author, fetchAuthorById } from "../api/audio/getAuthorById";
import  { Narrator,fetchNarratorById} from '../api/audio/getNarratorById'
import { useColor } from 'color-thief-react'
import * as React from 'react'


function PlayerView({searchParams} : {searchParams : {bookId : string, chapterId : string}}) {
    
    interface Informations {
        chapter: Chapter[];
        audiobook: Audiobook[];
        author: Author[];
        narrator: Narrator[];
        loadingAudioBook: boolean;
        loadingChapter: boolean;
    }


    let bookId = 1
    let chapterId = 1

    //Check if their is parameters
    try{
        if(parseInt(searchParams.bookId)> 0 && parseInt(searchParams.chapterId)> 0){
            bookId = parseInt(searchParams.bookId)
            chapterId = parseInt(searchParams.chapterId)
        }
    
    }catch(e){
        console.log(e)
    }
    
    console.log(searchParams.bookId + " " + searchParams.chapterId )
    
        const [informations, setState] = useState<Informations>({
            chapter: [],
            audiobook: [],
            author: [],
            narrator:[],
            loadingAudioBook: true,
            loadingChapter: true,
        });
    
        const { data, loading, error } = useColor(informations.audiobook[0]?.cover_art_jpg ?? null, 'hslString',{crossOrigin : "anonymous"})
        
        useEffect(() => {
            const loadData = async () => {
                try {
    
                    let chapter = await fetchAudioBooksChapterById(bookId , chapterId); 

    
                    let audiobook = await fetchAudioBooksById(bookId);
                    
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
                        chapter: chapter,
                        loadingChapter: false,
                        audiobook,
                    }));
                } catch (error) {
                    console.error("Error loading data:", error);
                }
            };
        
            loadData();
        }, [chapterId]);
        
        const covertArt = informations.audiobook[0]?.cover_art_jpg  ?? null
        console.log(JSON.stringify(informations.chapter[0]))


return(

    <div className="flex h-screen w-screen">
        <div className="flex items-center justify-center bg-red-500 w-1/2 h-full ">
            <div className="bg-blue-500 w-[70%] h-0 pb-[70%] mr-[5%]">
                <img src={covertArt ?? null} alt="cover art"></img>
            </div>
        </div>
        <div className="flex items-center justify-center bg-green-500 w-1/2 h-full ">
            <div className="flex-col text-center bg-blue-500 w-[70%] h-0 pb-[70%] mr-[5%]">

                <div>
                <div className='text-white text-[1.5em] font-bold'>{informations.audiobook[0]?.title}</div>
                <div className="text-[hsl(0,_0%,_70%)] text-xs">{informations.chapter[0]?.chapter_number} </div>
                <div className="text-[hsl(0,_0%,_70%)] text-xs">{informations.author[0]?.name}</div>
                <div className="text-[hsl(0,_0%,_70%)] text-xs">{informations.narrator[0]?.name}</div>
                </div>
                
                <div>
                <div className="bg-fuchsia-600">PLAYER</div>
                </div>

            </div>
        </div>
    </div>
)}

export default PlayerView