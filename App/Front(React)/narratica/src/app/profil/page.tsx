"use client"
import { useEffect, useState } from 'react';

import NavBar from "@/components/NavBar"
import ChapterCard from "@/components/chapterCard";
import { fetchAudioBooksChaptersById, Chapter } from '../api/audio/getAllChaptersFromAudioBookId';
import { fetchAudioBooksById } from '../api/audio/getAudioBooksById';
import { Audiobook } from '../api/audio/getAllAudioBooks';
import { Author, fetchAuthorById } from "../api/audio/getAuthorById";
import { fetchUserById, User } from '../api/audio/getUserById'
import { useAudio } from '@/components/audio/AudioContext';
import { useSearchParams } from 'next/navigation';
import { debug } from 'console';
import { userInfo } from 'os';





function ProfileView({ searchParams }: { searchParams: { id: string; } }) {

    let id = 8


    interface Information {
        userInfo: User[]
    }

    const params = useSearchParams()

    const strId = params.get('id')
    if (strId !== null) {
        id = parseInt(strId)
    }
    const [informations, setInformation] = useState<Information>({
        userInfo: [],
    })
    id = 8
    useEffect(() => {
        const fetchData = async () => {

            if (id === null)

                return;
            try {
                console.log("coucou")
                const userInfos = await fetchUserById(id);
                console.log("huhu")

                setInformation(() => ({
                    userInfo: userInfos
                }));


            } catch (error) {
                console.error("Failed to fetch:", error);
            }
        };
        fetchData();
    }, [id]);
    console.log(JSON.stringify(informations))

    return (
        <section>
            {!informations.userInfo[0] ? (
                <p>Chargement...</p>
            ) : (
                <main >
                    <div className=" ml-7 text-white text-center  h-[10vh]">
                        <section className="ml-52 mt-15 flex flex-row">
                            <div>
                                <img src="https://github.com/shadcn.png" className="rounded-full h-52"></img>
                            </div>
                            <div className="ml-10 text-left">
                                <h1 className='text-white text-[4em] font-bold'> Pseudo { }</h1>
                                <button>Edit Profile</button>
                            </div>
                            <section>
                                <h1 className='text-3xl font-bold mb-2'>
                                    {informations.userInfo[0]?.username}
                                </h1>
                            </section>
                            <section className="space-y-2 text-gray-300">
                                <p>Email: {informations.userInfo[0].email}</p>
                                <p>Nom: {informations.userInfo[0].first_name} {informations.userInfo[0].last_name}</p>
                                <p>Membre depuis: {new Date(informations.userInfo[0].date_joined).toLocaleDateString()}</p>
                            </section>
                        </section>
                        <section>
                            <h1>Playlist</h1>
                        </section>
                    </div>
                </main>)}
        </section>)
}
export default ProfileView