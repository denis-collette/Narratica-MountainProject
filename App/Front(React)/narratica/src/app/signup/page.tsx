"use client"

function SignUpView(){


    function printInfo(){
        var info = document.forms
        console.log(JSON.stringify(info))
    }

    const handleSubmit = (e : any) =>  {
            e.preventDefault(); 
            const formData = new FormData(e.currentTarget) 
            const userName = formData.get("pseudo")
            const password = formData.get("password")
            const first_name = formData.get("fname")
            const last_name = formData.get("lname")
            const email = formData.get("email")

            const apiObj = {
                "user_name" : userName,
                "first_name" : first_name,
                "last_name" : last_name,
                "email" : email,
                "password" : password
            }
            console.log(apiObj)
    }


    return (
        <main className=" flex justify-center items-center bg-gradient-to-b from-[#242424] from-0%  to-[#120e0c] to-90% rounded-[0.5%] min-h-screen min-w-screen">
            
            <div className=" flex-row justify-center items-center bg-[#1b1b1b] p-8 rounded-lg shadow-lg">
            <img src="./favicon.ico" className="w-20" alt="Favicon" />
            <h1 className="text-white font-bold text-4xl text-center pb-">Signup now ! </h1>
                <form className=" flex-row justify-center items-center space-y-4 " onSubmit={handleSubmit}>
                    <label htmlFor="firstname" className="text-white">First name:</label><br />
                    <input className=" bg-white border-2 border-gray-500" type="text" id="fname" name="fname" /><br />

                    <label className="text-white">Last name:</label><br />
                    <input className=" bg-white border-2 border-gray-500" type="text" id="lname" name="lname" /><br />

                    <label className="text-white">Pseudo:</label><br />
                    <input className="bg-white border-2 border-gray-500" type="text" id="pseudo" name="pseudo" /><br />

                    <label className="text-white">Email:</label><br />
                    <input className="bg-white border-2 border-gray-500" type="email" id="email" name="email" /><br />

                    <label className="text-white">Password:</label><br />
                    <input className="bg-white border-2 border-gray-500" type="password" id="password" name="password" /><br />

                    <button className="text-white bg-b border-2 border-gray-500 py-2 px-4 rounded" type="submit" value="Submit">Submit</button>
                </form>
            </div>
        </main>
    );
}
export default SignUpView