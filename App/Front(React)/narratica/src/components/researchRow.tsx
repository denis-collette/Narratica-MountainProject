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
            <div className="flex w-full aspect-[4/1] cursor-pointer">
            {/* Square image on the left */}
            <div className="relative w-1/4">
                <img
                className="absolute inset-0 w-full h-full object-cover rounded"
                src={book.cover_art_jpg}
                alt={`Image pour ${book.title}`}
                />
            </div>
        
            {/* Text content on the right */}
            <div className="w-3/4 p-2 flex flex-col justify-center overflow-hidden">
                <h2 className="text-white text-xs font-bold leading-tight break-words line-clamp-none">
                {book.title}
                </h2>
                <div className="text-white text-[0.55em] mt-1 leading-tight break-words">
                Author: {author}
                </div>
                <div className="text-white text-[0.55em] mt-1 leading-tight break-words">
                Narrator: {narrator}
                </div>
            </div>
            </div>
        </Link>
        

    );
    };

export default ResearchRow;
