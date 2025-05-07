"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

import NavBar from "@/components/NavBar"
import { fetchUserProfile, UserProfile } from "../api/userAuth/fetchUserProfile"

function ProfileView() {
    const params = useSearchParams()
    const searchId = params.get("id")
    const localId = typeof window !== "undefined" ? localStorage.getItem("user_id") : null
    const userId = searchId || localId

    const [userInfo, setUserInfo] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            if (!userId) return
            try {
                const userData = await fetchUserProfile(Number(userId))
                setUserInfo(userData)
                console.log("Fetched user data:", userData)

            } catch (error) {
                console.error("Failed to fetch user:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [userId])

    if (loading) return <p className="text-white text-center mt-8">Loading...</p>
    if (!userInfo) return <p className="text-white text-center mt-8">User not found</p>

    return (
        <main className="min-h-screen bg-black text-white">
            <section className="p-10">
                <div className="flex items-start gap-10">
                    <img
                        src={localStorage.getItem("profile_img") || "https://github.com/shadcn.png"}
                        alt="Profile"
                        className="rounded-full h-52 w-52 object-cover"
                    />

                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold">{userInfo.username}</h1>
                        <p>Email: {userInfo.email}</p>
                        <p>Name: {userInfo.first_name} {userInfo.last_name}</p>
                        <p>Joined: {new Date(userInfo.date_joined).toLocaleDateString()}</p>
                        <button className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">
                            Edit Profile
                        </button>
                    </div>
                </div>
                <section className="mt-10">
                    <h2 className="text-2xl font-semibold">Playlist</h2>
                    {/* TODO: Render playlist items here */}
                </section>
            </section>
        </main>
    )
}

export default ProfileView