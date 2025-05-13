"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { loginUser } from "../api/userAuth/login"
import { registerUser } from "../api/userAuth/register"
import { LuUser } from "react-icons/lu";
import { FaLock, FaRegImage } from "react-icons/fa6";
import { MdOutlineEmail } from "react-icons/md";
import { FaPen } from "react-icons/fa"; 

function SignUpView() {
    const router = useRouter()
    const [error, setError] = useState("")

    const validatePassword = (password: string) => {
        const minLength = /.{8,}/
        const upper = /[A-Z]/
        const lower = /[a-z]/
        const digit = /\d/
        const special = /[!@#$%^&*(),.?":{}|<>]/
        return (
            minLength.test(password) &&
            upper.test(password) &&
            lower.test(password) &&
            digit.test(password) &&
            special.test(password)
        )
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        setError("")

        const formData = new FormData(e.currentTarget)
        const username = formData.get("pseudo") as string
        const email = formData.get("email") as string
        const password = formData.get("password") as string
        const confirmPassword = formData.get("confirm_password") as string
        const firstName = formData.get("first_name") as string;
        const lastName = formData.get("last_name") as string;
        const profileImg = formData.get("profile_img") as File;

        if (profileImg) {
            if (!profileImg.type.startsWith("image/")) {
                setError("Only image files are allowed");
                return;
            }
            if (profileImg.size > 2 * 1024 * 1024) {
                setError("Image must be smaller than 2MB");
                return;
            }
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        if (!validatePassword(password)) {
            setError("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.")
            return
        }

        const signupData = new FormData();
        signupData.append("username", username);
        signupData.append("email", email);
        signupData.append("password", password);
        signupData.append("first_name", firstName);
        signupData.append("last_name", lastName);
        if (profileImg) signupData.append("profile_img", profileImg);

        try {
            const registerRes = await registerUser(signupData);

            if (!registerRes || registerRes.status >= 400) {
                const errorData = registerRes?.data;
                console.error("Register response:", errorData)
                setError("Signup failed: " + JSON.stringify(errorData))
                return
            }

            const loginRes = await loginUser(username, password);

            if (!loginRes) {
                console.error("Login failed")
                setError("Login failed: Invalid username or password")
                return
            }

            router.push("/profile")
        } catch (err) {
            console.error("Unexpected error:", err)
            setError("Unexpected error occurred")
        }
    }

    return (
        <main className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#000000] from-0% to-[#120e0c] to-90%">
            <section className="flex-row justify-center items-center bg-[#1b1b1b] p-8 rounded-lg shadow-lg w-[450px] mb-30 mt-10">
                <img src="./favicon.ico" className="w-16 mx-auto mb-6" alt="Favicon" />
                <h1 className="text-white font-bold text-3xl text-center mb-8">Créer un compte</h1>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <section className="relative">
                        <label className="text-white text-lg mb-2 block">Pseudo</label>
                        <section className="relative">
                            <LuUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                className="w-full bg-[#2b2b2b] text-white pl-10 pr-4 py-3 rounded-md focus:outline-none"
                                type="text"
                                name="pseudo"
                                placeholder="Votre pseudo"
                            />
                        </section>
                    </section>

                    <section className="relative">
                        <label className="text-white text-lg mb-2 block">Photo de profil</label>
                        <section className="relative">
                            <FaRegImage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                className="w-full bg-[#2b2b2b] text-white pl-10 pr-4 py-3 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-green-500 file:text-white hover:file:bg-green-600"
                                type="file"
                                name="profile_img"
                                accept="image/*"
                            />
                        </section>
                    </section>

                    <section className="grid grid-cols-2 gap-4">
                        <section className="relative">
                            <label className="text-white text-lg mb-2 block">Prénom</label>
                            <section className="relative">
                                <FaPen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    className="w-full bg-[#2b2b2b] text-white pl-10 pr-4 py-3 rounded-md focus:outline-none"
                                    type="text"
                                    name="first_name"
                                    placeholder="Votre prénom"
                                />
                            </section>
                        </section>

                        <section className="relative">
                            <label className="text-white text-lg mb-2 block">Nom</label>
                            <section className="relative">
                                <FaPen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    className="w-full bg-[#2b2b2b] text-white pl-10 pr-4 py-3 rounded-md focus:outline-none"
                                    type="text"
                                    name="last_name"
                                    placeholder="Votre nom"
                                />
                            </section>
                        </section>
                    </section>

                    <section className="relative">
                        <label className="text-white text-lg mb-2 block">Email</label>
                        <section className="relative">
                            <MdOutlineEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                className="w-full bg-[#2b2b2b] text-white pl-10 pr-4 py-3 rounded-md focus:outline-none"
                                type="email"
                                name="email"
                                placeholder="Exemple@gmail.com"
                            />
                        </section>
                    </section>

                    <section className="relative">
                        <label className="text-white text-lg mb-2 block">Mot de passe</label>
                        <section className="relative">
                            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                className="w-full bg-[#2b2b2b] text-white pl-10 pr-4 py-3 rounded-md  focus:outline-none"
                                type="password"
                                name="password"
                                placeholder="••••••••"
                            />
                        </section>
                    </section>

                    <section className="relative">
                        <label className="text-white text-lg mb-2 block">Confirmer le mot de passe</label>
                        <section className="relative">
                            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                className="w-full bg-[#2b2b2b] text-white pl-10 pr-4 py-3 rounded-md focus:outline-none"
                                type="password"
                                name="confirm_password"
                                placeholder="••••••••"
                            />
                        </section>
                    </section>

                    <button
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-md transition-colors duration-300"
                        type="submit"
                    >
                        S'inscrire
                    </button>
                </form>

                {error && <p className="text-red-500 text-center mt-4">{error}</p>}

                <p className="text-gray-400 text-center mt-6">
                    Vous avez déjà un compte ?{' '}
                    <a href="/login" className="text-green-500 hover:text-green-400 hover:underline">
                        Se connecter
                    </a>
                </p>
            </section>
        </main>
    );
}

export default SignUpView
