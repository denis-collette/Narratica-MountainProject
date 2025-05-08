import React from 'react';
import { Audiobook } from '@/app/api/audio/getAllAudioBooks';
import Link from 'next/link';
import {fetchAuthorById} from "../app/api/audio/getAuthorById"
interface Props {
book: Audiobook;
}

const ResearchRow: React.FC<Props> =  ({ book }) => {

    //const author =  await fetchAuthorById(book.author)

    return (
    <Link href={{ pathname: "/bookView", query: { id: book.id } }}>
    <section className='flex'>
        <section className="relative w-1/4 aspect-square">
        <img
            src={book.cover_art_jpg}
            alt={`Image pour ${book.title}`}
        />
        </section>
        <section className="p-2">
        <h2 className="text-white text-xs font-bold">
            {book.title}
        </h2>
        </section>
    </section>
    </Link>
    );
};

export default ResearchRow;
