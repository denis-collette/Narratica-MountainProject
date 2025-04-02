
import  { Chapter}  from '../app/api/audio/getChapterById'
import { Button } from './ui/button'

function ChapterCard(props : Chapter){

    return(
    <section className='ChapterCardFull'>
        <div className="ChapterCard">
            <div className="ChapterCardContent">
                <h2>{props.chapter_number}</h2>
            </div>
            <div className="ChapterCardContent">
                <h1>Chapter : {props.chapter_number}</h1>
            </div>
            <div className="ChapterCardContent">
            <h2>{props.number_of_listening}</h2>
            </div>
            <div className="ChapterCardEndContent">
            <h2>{props.total_time}</h2>
            </div>
        </div>
    </section>
    )

}

export default ChapterCard