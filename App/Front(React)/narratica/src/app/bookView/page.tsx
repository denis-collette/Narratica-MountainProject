import NavBar from "@/components/NavBar"
import ChapterCard from "@/components/chapterCard"

function bookView(){

  
    let path : "../app/shrek.jpg"

    return(

            <div className="containerFull" >
                <div className="imageAndTitle">
                    <div className="image">
                    <img ></img>
                    </div>
                    <div className="titleText">
                        <h1>Book title</h1>
                        <h2>Author name</h2>
                        <h2>Narrator name</h2>
                        <h2>Date of publish</h2>
                        <h2>Number of chapter</h2>
                        <h2>Total duration</h2>
                    </div>
                </div>
                <div className="cardContainer">
                    <div>
                        <ChapterCard />
                    </div>
                </div>
            </div>
        
    )
}

export default bookView