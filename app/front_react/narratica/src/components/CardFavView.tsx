import React from 'react'
import { Audiobook, BookWithAuthorAndNarrator } from '../app/api/audio/getAllAudioBooks';
import Link from "next/link"

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

    const Bookd = (book.id).toString()

    return (
        <Link href={{ pathname: "/bookView", query: ({ id: book.id }) }}>
            <section className='rounded-lg  w-3xs shadow-lg border border-white/10  bg-white/30  hover:bg-white/40  '>
                <section className='relative w-full aspect-square'>
                    <img className='object-cover rounded-lg p-2 w-full h-full' src={book.cover_art_jpg} alt={`Image pour ${book.title}`} />
                </section>
                <section className='p-2'>
                    <h2 className='text-white text-[1em] font-bold'>
                        {book.title}
                    </h2>
                    <h3 className='text-white  text-xs'>
                        Auteur : {book.authorName}
                    </h3>
                    <h3 className='text-white  text-xs '>
                        Narrateur : {book.narratorName}
                    </h3>
                </section>
            </section>
        </Link>
    )
}

export default Card