import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Search from "./audio/custom/Search";


export default function NavBar() {
    return (
        <nav className="p-2 bg-violet-500 text-white">
            <ul className="flex gap-5">
                <Search />
                <li><Link href="/">Accueil</Link></li>
                <li><Link href="/profil">Profil</Link></li>
                <li><Link href="/login">Connexion</Link></li>
                <li><Link href="/signup">Inscription</Link></li>
                <li><Link href="/bookView">Book View</Link></li>
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </ul>
        </nav>
    )
}