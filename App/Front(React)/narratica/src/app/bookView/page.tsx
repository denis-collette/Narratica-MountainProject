"use client"
import { useEffect, useState } from 'react';

import NavBar from "@/components/NavBar"
import ChapterCard from "@/components/chapterCard";
import { fetchAudioBooksChaptersById, Chapter } from '../api/audio/getAllChaptersFromAudioBookId';
import { fetchAudioBooksById } from '../api/audio/getAudioBooksById';
import { Audiobook } from '../api/audio/getAllAudioBooks';
import { Author, fetchAuthorById } from "../api/audio/getAuthorById";
import { Narrator, fetchNarratorById } from '../api/audio/getNarratorById'
import { useAudio } from '@/components/audio/AudioContext';
import { useSearchParams } from 'next/navigation';

function sortChapter(bookChapterObj: Chapter[]) {
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

function BookView({ searchParams }: { searchParams: { id: string; } }) {
    let id = 1
    const params = useSearchParams()
    const strId = params.get('id')
    if (strId !== null) {
        id = parseInt(strId)
    }

    const [informations, setState] = useState<Informations>({
        chapters: [],
        audiobook: [],
        author: [],
        narrator: [],
        loadingAudioBook: true,
        loadingChapter: true,
    });

    const { setAudioState, loadChapter } = useAudio();

    console.log(informations.audiobook[0]?.cover_art_jpg)
    useEffect(() => {
        const loadData = async () => {
            try {
                let chapters = await fetchAudioBooksChaptersById(id);
                chapters = sortChapter(chapters);
                let audiobook = await fetchAudioBooksById(id);
                console.log('Audiobook :', audiobook);

                if (audiobook && audiobook.id) {
                    let author = await fetchAuthorById(audiobook.author);
                    let narrator = await fetchNarratorById(audiobook.narrator);
                    setState((prevState) => ({
                        ...prevState,
                        author: [author],
                        narrator: [narrator],
                        audiobook: [audiobook],
                    }));
                    console.log('Titre :', audiobook.title);
                    console.log('Image :', audiobook.cover_art_jpg);
                    setAudioState((prevState) => ({
                        ...prevState,
                        bookTitle: audiobook.title,
                        coverImage: audiobook.cover_art_jpg,
                        allChapters: chapters,
                    }));
                } else {
                    setState((prevState) => ({
                        ...prevState,
                        audiobook: [],
                    }));
                    setAudioState((prevState) => ({
                        ...prevState,
                        bookTitle: "titre test",
                    }));
                }
                setState((prevState) => ({
                    ...prevState,
                    chapters: chapters,
                }));
            } catch (error) {
                console.error("Error loading data:", error);
            }
        };
        loadData();
    }, [id, setAudioState]);

    const handleChapterClick = (audioSource: string | null, chapter: Chapter) => {
        console.log("test prout", audioSource, chapter)
        if (audioSource && informations.audiobook && informations.audiobook.length > 0) {
            loadChapter(chapter, informations.audiobook[0]?.title, informations.audiobook[0]?.cover_art_jpg);
        };
    }
    return (

        <section>
            {informations.loadingChapter && informations.loadingAudioBook ? (
                <p>Chargement...</p>
            ) : (
                <div className="relative min-h-screen">
                <div 
                    className="absolute inset-0 z-0"
                    style={{
                    filter: 'blur(150px)',
                    backgroundImage: `url(${informations.audiobook[0]?.cover_art_jpg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    }}
                />
                <div className="relative flex justify-between z-0 h-screen w-screen ">
                    <div className=" w-full flex flex-col bg-gradient-to-b from-[#00000000] from-15%  to-[#120e0c] to-45% rounded-[0.5%] " >
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
                        <div className='bg-gray-800/25 flex-1 h-full border-b-[65px]  overflow-y-auto'>
                            <div className='text-white pt-[3%] flex-col items-center m-auto w-[80%] pb-[3%]'>
                                <h2 className='text-[0.5em]'>Narrated by : {informations.narrator[0]?.name}</h2>
                                <h2 className='text-[0.7em]'>{informations.audiobook[0]?.description}</h2>
                            </div>
                            <div className=' max-h-[60vh]'>
                                <div className="grid grid-cols-[0.1fr_0.8fr_0.4fr_0.5fr] grid-rows-1 mx-auto w-[80%] text-[hsl(0,0%,70%)] items-center justify-between Arial h-full">
                                    <div className='text-[hsl(0,_0%,_70%)] text-xs' >#</div>
                                    <div className='text-[hsl(0,_0%,_70%)] text-xs'>Chapters</div>
                                    <div className='text-[hsl(0,_0%,_70%)] text-xs text-center'>Lectures</div>
                                    <div className='text-[hsl(0,_0%,_70%)] text-xs text-right'>Time</div>
                                </div>
                                <ul>
                                    {informations.chapters.map((chapter) => (
                                        <li key={chapter.chapter_number}>
                                            <ChapterCard  {...chapter} onChapterClick={handleChapterClick} />
                                        </li> 
                                    ))}
                                </ul>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>)}
        </section>)
}
export default BookView