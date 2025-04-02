
import  { Chapter}  from '../app/api/audio/getChapterById'

function ChapterCard(props : Chapter){

    return(
    
        <div className="ChapterCard">
            
            <div>
                <h2>{props.chapter_number}</h2>
            </div>
            <div>
                <h1>Chapter : {props.chapter_number}</h1>
            </div>
            <div>
            <h2>{props.number_of_listening}</h2>
            </div>
            <div>
            <h2>{props.total_time}</h2>
            </div>
        </div>
    )

}

export default ChapterCard