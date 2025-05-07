"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '../api/userAuth/checkAuth';

const ProfileView = () => {
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/login');
        }
    }, [router]);

    const username = localStorage.getItem('username');
    const profile_img = localStorage.getItem('profile_img');

    console.log('imgProfile', profile_img);
    console.log('username', username);

    if (!username) {
        return <p className="text-white text-center">Chargement...</p>
    }

    return (
        <section className="text-white text-center p-8">
            <div className="flex flex-col items-center space-y-6">
                <img 
                    src={profile_img || "https://github.com/shadcn.png"} 
                    alt="Profile" 
                    className="rounded-full w-32 h-32 object-cover"
                />
                <h1 className="text-4xl font-bold">
                    Bienvenue, {username}
                </h1>
            </div>
        </section>
    );
}

export default ProfileView;