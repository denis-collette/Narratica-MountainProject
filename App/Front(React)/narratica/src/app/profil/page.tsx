"use client"

import NavBar from "@/components/NavBar"
import  { Narrator,fetchNarratorById} from '../api/audio/getNarratorById'
import { useSearchParams } from 'next/navigation';





function ProfileView({searchParams} : {searchParams : {id : string;}}) {

    return(
        <main className="flex justify-center items-center text-white text-center h-[60vh]">
            <div>
                <section>
                    <img src="https://github.com/shadcn.png" className="rounded-full h-52"></img>
                    <h1> Pseudo </h1>
                    <button>Edit Profile</button>
                </section>
                <section>
                    <h1>Playlist</h1>
                </section>
            </div>
        </main>)
}
export default ProfileView