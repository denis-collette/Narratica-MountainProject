"use client"

import NavBar from "@/components/NavBar"
import  { Narrator,fetchNarratorById} from '../api/audio/getNarratorById'
import { useSearchParams } from 'next/navigation';





function ProfileView({searchParams} : {searchParams : {id : string;}}) {

    return(
        <main >
            <div className="flex ml-7 text-white text-center flex-col h-[60vh]">
                <section>
                    <div>
                        <img src="https://github.com/shadcn.png" className="rounded-full h-52"></img>
                    </div>
                    <div>
                        <h1> Pseudo </h1>
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