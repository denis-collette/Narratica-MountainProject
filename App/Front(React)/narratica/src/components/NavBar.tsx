import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Search from "./Search";


export default function NavBar() {
    return (
        <nav className="relative p-2 bg-[#120e0c] text-white z-10 mx-3.5">
            <ul className="flex gap-5 justify-between">
                
                <li><Link href="/">Accueil</Link></li>
                <div>
                    <Search />
                </div>
                <div className="flex  gap-5 ">
                    <li><Link href="/login">Connexion</Link></li>
                    <li><Link href="/signup">Inscription</Link></li> 
                    <Avatar>
                        <Link href="/profil"> 
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                        </Link>
                    </Avatar>
                </div>
            </ul>
        </nav>
    )
}