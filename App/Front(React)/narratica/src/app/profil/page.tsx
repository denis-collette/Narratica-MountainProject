"use client"

import NavBar from "@/components/NavBar"
import  { Narrator,fetchNarratorById} from '../api/audio/getNarratorById'
import { useSearchParams } from 'next/navigation';





function ProfileView({searchParams} : {searchParams : {id : string;}}) {

    return(
        <main >
            <div className=" ml-7 text-white text-center  h-[30vh]">
                <section className= "m-52 flex flex-row">
                    <div>
                        <img src="https://github.com/shadcn.png" className="rounded-full h-52"></img>
                    </div>
                    <div className="ml-1 text-left">
                        <h1 className='text-white text-[4em] font-bold'> Pseudo </h1>
                        <button>Edit Profile</button>
                    </div>
                </section>
                <section>
                    <h1>Playlist</h1>
                </section>
            </div>
        </main>)
}
export default ProfileView