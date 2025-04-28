import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Search from "./Search";


export default function NavBar() {
    return (
        <nav className="relative p-2 bg-[#120e0c] text-white z-10">
            <ul className="flex gap-5">
                <Search />
                <li><Link href="/">Accueil</Link></li>
                <li><Link href="/profil">Profil</Link></li>
                <li><Link href="/login">Connexion</Link></li>
                <li><Link href="/signup">Inscription</Link></li> 
                <li><Link href="/bookView">Book View</Link></li>
                <li><Link href="/playerView">Player View</Link></li>
                <Avatar>
                    <Link href="/profil"> 
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                    </Link>
                </Avatar>
            </ul>
        </nav>
    )
}