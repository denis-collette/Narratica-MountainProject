"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

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

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        if (!validatePassword(password)) {
            setError("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.")
            return
        }

        const signupData = { username, email, password }

        try {
            const registerRes = await fetch("http://127.0.0.1:8000/api/register/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(signupData)
            })

            if (!registerRes.ok) {
                const text = await registerRes.text()
                console.error("Register response text:", text)
                setError("Signup failed: " + text)
                return
            }

            const loginRes = await fetch("http://127.0.0.1:8000/api/login/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            })

            if (!loginRes.ok) {
                const text = await loginRes.text()
                console.error("Login response text:", text)
                setError("Login failed: " + text)
                return
            }

            const loginData = await loginRes.json()
            localStorage.setItem("access", loginData.access)
            localStorage.setItem("refresh", loginData.refresh)
            localStorage.setItem("username", loginData.username)
            localStorage.setItem("user_id", loginData.user_id)

            router.push("/")
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
