import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Search from "./Search";

export default function NavBar() {
    return (
        <nav className="relative p-2 bg-[#120e0c] text-white z-10 px-3.5">
            <ul className="flex gap-5 justify-between items-center">
                
                <li><Link href="/">Accueil</Link></li>

                <li>
                    <Search />
                </li>

                <li className="flex gap-5 items-center">
                    <Link href="/login">Connexion</Link>
                    <Link href="/signup">Inscription</Link> 
                    <Link href="/profil">
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </Link>
                </li>

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
