"use client";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SearchBar from "@/components/SearchBar";
import { useSearch } from "@/components/SearchContext";

export default function NavBar() {
    const { search, setSearch } = useSearch();

    return (
        <nav className="relative p-2 bg-[#120e0c] text-white z-10 px-3.5">
            <ul className="flex gap-5 justify-between items-center">
                
            <ul className="flex gap-5 justify-between">
                <li><Link href="/">Accueil</Link></li>
                <section>
                    <SearchBar search={search} setSearch={setSearch} />
                </section>
                <section className="flex gap-5">
                    <li><Link href="/login">Connexion</Link></li>
                    <li><Link href="/signup">Inscription</Link></li>
                    <Avatar>
                        <Link href="/profil">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Link>
                    </Avatar>
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
