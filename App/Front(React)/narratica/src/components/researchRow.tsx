import Link from 'next/link';
import { Audiobook } from "../app/api/audio/getAllAudioBooks";

interface ResearchRowProps {
    book: Audiobook;
    author: string;
    narrator: string;
}

const ResearchRow: React.FC<ResearchRowProps> = ({ book, author, narrator }) => {
    return (
        <Link href={{ pathname: "/bookView", query: { id: book.id } }}>
        <div className="flex cursor-pointer">
            <div className="relative w-1/4 aspect-square">
            <img className='w-full' src={book.cover_art_jpg} alt={`Image pour ${book.title}`} />
            </div>
            <div className="p-2">
            <h2 className="text-white text-xs font-bold">{book.title}</h2>
            <div className="text-white text-[0.55em] mt-1">Author: {author}</div>
            <div className="text-white text-[0.55em] mt-1">Narrator: {narrator}</div>
            </div>
        </div>
        </Link>
    );
    };

export default ResearchRow;
