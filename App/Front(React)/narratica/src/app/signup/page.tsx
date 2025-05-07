"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { loginUser } from "../api/userAuth/login"
import { registerUser } from "../api/userAuth/register"

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
        <main className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#242424] from-0% to-[#120e0c] to-90% rounded-[0.5%]">
            <div className="flex-row justify-center items-center bg-[#1b1b1b] p-8 rounded-lg shadow-lg w-2/6">
                <img src="./favicon.ico" className="w-20 mx-auto" alt="Favicon" />
                <h1 className="text-white font-bold text-4xl text-center pb-4">Signup now!</h1>
                <form className="flex-row items-center self-center space-y-4 mx-auto" onSubmit={handleSubmit}>
                    <label className="text-white">Pseudo:</label><br />
                    <input className="bg-white border-2 border-gray-500 w-full" type="text" name="pseudo" /><br />

                    <label className="text-white">Profile Image:</label><br />
                    <input className="bg-white border-2 border-gray-500 w-full" type="file" name="profile_img" accept="image/*" /><br />

                    <label className="text-white">First Name:</label><br />
                    <input className="bg-white border-2 border-gray-500 w-full" type="text" name="first_name" /><br />

                    <label className="text-white">Last Name:</label><br />
                    <input className="bg-white border-2 border-gray-500 w-full" type="text" name="last_name" /><br />

                    <label className="text-white">Email:</label><br />
                    <input className="bg-white border-2 border-gray-500 w-full" type="email" name="email" /><br />

                    <label className="text-white">Password:</label><br />
                    <input className="bg-white border-2 border-gray-500 w-full" type="password" name="password" /><br />

                    <label className="text-white">Confirm Password:</label><br />
                    <input className="bg-white border-2 border-gray-500 w-full" type="password" name="confirm_password" /><br />

                    <button className="block mx-auto text-white bg-b border-2 border-gray-500 py-2 px-4 rounded" type="submit">Submit</button>
                </form>
                {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            </div>
        </main>
    )
}

export default SignUpView
