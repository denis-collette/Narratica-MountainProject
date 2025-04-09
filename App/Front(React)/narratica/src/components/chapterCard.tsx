import Link from "next/link"
import { Chapter } from '../app/api/audio/getChapterById'
import { Button } from './ui/button'

function ChapterCard(props: Chapter) {


    const book = props.book.toString();
    const chapter = props.id.toString();


    return (
        <section className='hover:bg-gray-400/20'>
            <Link href={{ pathname: "/playerView", query: ({ bookId: book, chapterId: chapter }) }}>
                <div className="grid grid-cols-[0.1fr_0.8fr_0.4fr_0.5fr] grid-rows-1 mx-auto w-[80%] text-[hsl(0,0%,70%)] items-center justify-between Arial">
                    <div>
                        <h2 className='text-[hsl(0,_0%,_70%)] text-xs'>{props.chapter_number}</h2>
                    </div>
                    <div >
                        <h1 className='text-white text-lg '>Chapter : {props.chapter_number}</h1>
                    </div>
                    <div>
                        <h2 className='text-[hsl(0,_0%,_70%)] text-xs text-center'>{props.number_of_listening}</h2>
                    </div>
                    <div className="text-right text-[hsl(0,_0%,_70%)] text-xs">
                        <h2>{props.total_time}</h2>
                    </div>
                </div>
            </Link>
        </section>
    )

}

export default ChapterCard