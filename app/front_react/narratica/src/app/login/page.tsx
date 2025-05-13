"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaUser, FaLock } from "react-icons/fa";
import { loginUser } from "../api/userAuth/login";
import { LuUser } from "react-icons/lu";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await loginUser(username, password);

        if (response) {
            router.push("/profile")
        } else {
            setError("Invalid username or password");
        }
    };

    return (
        <main className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#000000] from-0% to-[#120e0c] to-90%">
            <section className="flex-row justify-center items-center bg-[#1b1b1b] p-8 rounded-lg shadow-lg w-[450px] mb-30 mt-10">
                <img src="./favicon.ico" className="w-16 mx-auto mb-6" alt="Favicon" />
                <h1 className="text-white font-bold text-3xl text-center mb-8">Se connecter</h1>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="relative">
                        <label className="text-white text-lg mb-2 block">Nom d'utilisateur</label>
                        <div className="relative">
                            <LuUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-[#2b2b2b] text-white pl-10 pr-4 py-3 rounded-md focus:outline-none"
                                placeholder="Votre nom d'utilisateur"
                            />
                        </div>
                    </div>

                    <div className="relative">
                        <label className="text-white text-lg mb-2 block">Mot de passe</label>
                        <div className="relative">
                            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[#2b2b2b] text-white pl-10 pr-4 py-3 rounded-md focus:outline-none"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-center">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-md transition-colors duration-300"
                    >
                        Se connecter
                    </button>
                </form>

                <p className="text-gray-400 text-center mt-6">
                    Vous n'avez pas de compte ?{' '}
                    <a href="/signup" className="text-green-500 hover:text-green-400 hover:underline">
                        S'inscrire
                    </a>
                </p>
            </section>
        </main>
    );
}
