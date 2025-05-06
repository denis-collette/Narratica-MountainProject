"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SearchBar from "@/components/SearchBar";
import { useSearch } from "@/components/SearchContext";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/app/api/userAuth/checkAuth";
import { logoutUser } from "@/app/api/userAuth/logout";

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

    // WAIT FOR THE S3 UPLOADS TO BE FUNCTIONAL BEFORE USING THE AVATAR COMPONENT
    // const [profileImg, setProfileImg] = useState<string | null>(null);
    // const [username, setUsername] = useState("");

    // useEffect(() => {
    //     if (isAuthenticated()) {
    //         setProfileImg(localStorage.getItem("profile_img"));
    //         setUsername(localStorage.getItem("username") || "");
    //     }
    // }, []);

    return (
        <nav className="relative p-2 bg-[#120e0c] text-white z-10 px-3.5">
            <ul className="flex gap-5 justify-between items-center">
                <li><Link href="/">Accueil</Link></li>
                <section>
                    <SearchBar search={search} setSearch={setSearch} />
                </section>
                <section className="flex gap-5 items-center">
                    {loggedIn ? (
                        <>
                            <li><button onClick={handleLogout}>Logout</button></li>
                            <Avatar>
                                <Link href="/profile">
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>PR</AvatarFallback>
                                </Link>
                            </Avatar>
                            {/* WAIT FOR THE S3 UPLOADS TO BE FUNCTIONAL BEFORE USING THE AVATAR COMPONENT
                            <Avatar>
                                <Link href="/profile">
                                    <AvatarImage src={profileImg || "/default_avatar.png" || "https://github.com/shadcn.png"} />
                                    <AvatarFallback>{username.slice(0, 2).toUpperCase()}</AvatarFallback>
                                </Link>
                            </Avatar> 
                            */}

                        </>
                    ) : (
                        <>
                            <li><Link href="/login">Connexion</Link></li>
                            <li><Link href="/signup">Inscription</Link></li>
                        </>
                    )}
                </section>
                {/* THIS IS THE SAFE ZONE ACCESS POINT - NEVER REMOVE IT */}
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
