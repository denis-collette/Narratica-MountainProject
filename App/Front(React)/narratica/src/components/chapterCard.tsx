
import  { Chapter}  from '../app/api/audio/getChapterById'
import { Button } from './ui/button'

function ChapterCard(props : Chapter){

    return(
    <section className='hover:bg-gray-400/20'>
        <div className="grid grid-cols-[0.05fr_1fr_0.2fr_0.5fr] grid-rows-1 mx-auto w-[80%] text-[hsl(0,0%,70%)] items-center justify-between Arial">
            <div>
                <h2>{props.chapter_number}</h2>
            </div>
            <div >
                <h1>Chapter : {props.chapter_number}</h1>
            </div>
            <div>
            <h2 className='text-[hsl(0,_0%,_70%)] text-sm'>{props.number_of_listening}</h2>
            </div>
            <div className="text-right">
            <h2 className='text-[hsl(0,_0%,_70%)] text-sm'>{props.total_time}</h2>
            </div>
        </div>
    </section>
    )

}

export default ChapterCard