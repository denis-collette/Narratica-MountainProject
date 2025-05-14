"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SearchBar from "@/components/SearchBar";
import { useSearch } from "@/components/SearchContext";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/app/api/userAuth/checkAuth";
import { logoutUser } from "@/app/api/userAuth/logout";
import { GoHome, GoHomeFill } from "react-icons/go";
import Image from "next/image";


export default function NavBar() {
    const { search, setSearch } = useSearch();
    const [loggedIn, setLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setLoggedIn(isAuthenticated());
    }, []);

    const handleLogout = () => {
        logoutUser();
        setLoggedIn(false);
        router.push("/");
    };

    const [profileImg, setProfileImg] = useState<string | null>(null);
    const [username, setUsername] = useState("");

    useEffect(() => {
        if (isAuthenticated()) {
            setProfileImg(localStorage.getItem("profile_img"));
            setUsername(localStorage.getItem("username") || "");
        }
    }, []);

    useEffect(() => {
        const handleStorageChange = () => {
            setLoggedIn(isAuthenticated());
            setProfileImg(localStorage.getItem("profile_img"));
            setUsername(localStorage.getItem("username") || "");
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    return (
        <nav className="relative p-2 bg-[#120e0c] text-white z-10 px-3.5">
            <ul className="flex gap-5 justify-between items-center">
                <div className="flex gap-2 justify-between items-center">
                    <Link href="/" >
                        {/* <GoHome size={22} /> */}
                        <Image src="/favicon.ico" alt="Home" width={35} height={35} />
                    </Link>
                    {/* <li><Link href="/homePage02" className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ease-in-out bg-neutral-800 text-white hover:bg-neutral-700 hover:text-white">Homepage 02</Link></li> */}
                    {loggedIn ? (
                        <>
                            <Link href="/favorites" className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ease-in-out bg-neutral-800 text-white hover:bg-neutral-700 hover:text-white">Favoris</Link>
                        </>
                    ) : (
                        <>
                        </>
                    )}
                </div>
                <section>
                    <SearchBar search={search} setSearch={setSearch} />
                </section>
                <section className="flex gap-5 items-center">
                    {loggedIn ? (
                        <>
                            <li><button onClick={handleLogout} className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ease-in-out bg-neutral-800 text-white hover:bg-neutral-700 hover:text-white">Logout</button></li>
                            <Link href="/bookUpload" className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ease-in-out bg-neutral-800 text-white hover:bg-neutral-700 hover:text-white">Upload</Link>
                            <Avatar>
                                <Link href="/profile">
                                    <AvatarImage src={profileImg || "https://github.com/shadcn.png"}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = "/default_avatar.png";
                                        }}
                                    />
                                    <AvatarFallback>{username.slice(0, 2).toUpperCase()}</AvatarFallback>
                                </Link>
                            </Avatar>


                        </>
                    ) : (
                        <>
                            <li><Link href="/login" className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ease-in-out bg-neutral-800 text-white hover:bg-neutral-700 hover:text-white">Connexion</Link></li>
                            <li><Link href="/signup" className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ease-in-out bg-neutral-800 text-white hover:bg-neutral-700 hover:text-white">Inscription</Link></li>
                        </>
                    )}
                </section>
                {/* THIS IS THE SAFE ZONE ACCESS POINT - NEVER REMOVE IT   A=> :p  */}
                <li className="absolute bottom-1 right-1">
                    <Link href="/safeZone">
                        <div className="w-3 h-3 opacity-0 hover:opacity-100 bg-green-500 cursor-pointer rounded-full" />
                    </Link>
                </li>
                {/* THIS IS THE SAFE ZONE ACCESS POINT - NEVER REMOVE IT */}
            </ul>
        </nav>
    );
}
