import React from 'react'
import { Audiobook, BookWithAuthorAndNarrator } from '@/app/api/audio/getAllAudioBooks';
import { Narrator, fetchNarratorById } from '@/app/api/audio/getNarratorById';
import { Author, fetchAuthorById } from '@/app/api/audio/getAuthorById';

interface Props {
    book: BookWithAuthorAndNarrator;
}

// const Card = ({ children }: Props) => {
//     return (
//         <section className='rounded-2xl bg-amber-50 w-md h-100 shadow'>
//             {children}
//         </section>
//     )
// }

const Card = ({ book }: Props) => {
    return (
        <section className='rounded-lg bg-transparent w-3xs shadow-lg hover:bg-gray-400/20'>
            <section className='relative w-full aspect-square'>
                <img className='object-cover rounded-lg p-2 w-full h-full' src={book.cover_art_jpg} alt={`Image pour ${book.title}`} />
            </section>
            <section className='p-2'>
                <h2 className='text-lg font-bold'>
                    {book.title}
                </h2>
                <h3 className='text-gray-500'>
                    {book.authorName}
                </h3>
                <h3 className=''>
                    {book.narratorName}
                </h3>
            </section>
        </section>
    )
}

export default Card