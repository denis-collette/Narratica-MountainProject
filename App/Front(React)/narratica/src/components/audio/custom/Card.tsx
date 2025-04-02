import React from 'react'
import Image from 'next/image';
import shrek from "@/../public/asset/shrek.jpg"
import { Audiobook } from '@/app/api/audio/getAllAudioBooks';

type Props = {
    book: Audiobook
    children?: React.ReactNode;
}

// const Card = ({ children }: Props) => {
//     return (
//         <section className='rounded-2xl bg-amber-50 w-md h-100 shadow'>
//             {children}
//         </section>
//     )
// }

const Card = ({ book, children }: Props) => {
    return (
        <section className='rounded-lg bg-transparent w-3xs shadow-lg hover:bg-gray-400/20'>
            <section className='relative h-50'>
                <Image className='object-fill rounded-lg p-2' src={shrek} alt={`Image pour ${book.title}`} layout='fill' />
            </section>
            <section className='p-2'>
                <h2 className='text-lg font-bold'>
                    {book.title}
                </h2>
                <h3 className='text-gray-500'>
                    {book.author}
                </h3>
                <h3 className=''>
                    {book.narrator}
                </h3>
            </section>
        </section>
    )
}

export default Card