"use client"
import React from 'react';
import { Chapter } from '../app/api/audio/getChapterById';

interface ChapterCardProps extends Chapter {
    onChapterClick: (audioSource: string | null, chapter: Chapter) => void;
}

function ChapterCard(props: ChapterCardProps) {

    return (
        <section onClick={() => props.onChapterClick(props.audio_data, props)} className='hover:bg-gray-400/20 cursor-pointer'>
            <section className="grid grid-cols-[0.1fr_0.8fr_0.4fr_0.5fr] grid-rows-1 mx-auto w-[80%] text-[hsl(0,0%,70%)] items-center justify-between Arial">
                <section>
                    <h2 className='text-[hsl(0,_0%,_70%)] text-xs'>{props.chapter_number}</h2>
                </section>
                <section>
                    <h1 className='text-white text-lg '>Chapitre : {props.chapter_number}</h1>
                </section>
                <section>
                    <h2 className='text-[hsl(0,_0%,_70%)] text-xs text-center'>{props.number_of_listening}</h2>
                </section>
                <section className="text-right text-[hsl(0,_0%,_70%)] text-xs">
                    <h2>{props.total_time}</h2>
                </section>
            </section>
        </section>
    );
}

export default ChapterCard;

// export default ChapterCard


// import Link from "next/link"
// import { Chapter } from '../app/api/audio/getChapterById'
// import { Button } from './ui/button'

// function ChapterCard(props: Chapter) {


//     const book = props.book.toString();
//     const chapter = props.id.toString();


//     return (
//         <section className='hover:bg-gray-400/20'>
//             <Link href={{ pathname: "/playerView", query: ({ bookId: book, chapterId: chapter }) }}>
//                 <section className="grid grid-cols-[0.1fr_0.8fr_0.4fr_0.5fr] grid-rows-1 mx-auto w-[80%] text-[hsl(0,0%,70%)] items-center justify-between Arial">
//                     <section>
//                         <h2 className='text-[hsl(0,_0%,_70%)] text-xs'>{props.chapter_number}</h2>
//                     </section>
//                     <section >
//                         <h1 className='text-white text-lg '>Chapter : {props.chapter_number}</h1>
//                     </section>
//                     <section>
//                         <h2 className='text-[hsl(0,_0%,_70%)] text-xs text-center'>{props.number_of_listening}</h2>
//                     </section>
//                     <section className="text-right text-[hsl(0,_0%,_70%)] text-xs">
//                         <h2>{props.total_time}</h2>
//                     </section>
//                 </section>
//             </Link>
//         </section>
//     )

// }

// export default ChapterCard