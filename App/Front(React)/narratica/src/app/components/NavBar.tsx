import Link from "next/link";

export default function NavBar() {
    return (
        <nav className="p-2 bg-blue-800 text-white">
            <ul className="flex gap-5">
                <li><Link href="/">Accueil</Link></li>
                <li><Link href="/profil">Profil</Link></li>
                <li><Link href="/login">Connexion</Link></li>
                <li><Link href="/signup">Inscription</Link></li>
            </ul>
        </nav>
    )
}