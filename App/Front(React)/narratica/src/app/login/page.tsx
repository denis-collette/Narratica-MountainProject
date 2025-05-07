"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaUser, FaLock } from "react-icons/fa";
import { loginUser } from "../api/userAuth/login";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await loginUser(username, password);

        if (response) {
            router.push("/profil")
        } else {
            setError("Invalid username or password");
        }
    };

    return (
        <section className="flex justify-center items-center min-h-screen bg-black">
            <section className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-96 shadow-lg">
                <h2 className="text-center text-white text-xl font-semibold mb-4">
                    CUSTOMER LOGIN
                </h2>
                <form onSubmit={handleSubmit}>
                    <section className="relative mb-4">
                        <FaUser className="absolute left-3 top-3 text-gray-300" />
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-transparent border border-gray-300 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                        />
                    </section>
                    <section className="relative mb-4">
                        <FaLock className="absolute left-3 top-3 text-gray-300" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-transparent border border-gray-300 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                        />
                    </section>
                    {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
                    <section className="flex justify-between text-sm text-gray-300 mb-4">
                        <label className="flex items-center">
                            <input type="checkbox" className="mr-2" /> Remember me
                        </label>
                        <a href="#" className="hover:underline">Forgot Password?</a>
                    </section>
                    <button
                        type="submit"
                        className="w-full py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition"
                    >
                        LOGIN
                    </button>
                </form>
            </section>
        </section>
    );
}
