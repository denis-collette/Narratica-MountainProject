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


    return(
                
        <main>
            <div className="flex justify-center items-center min-h-screen">
            <form className="space-y-4" onSubmit={handleSubmit}>
                <label htmlFor="firstname" className="text-white">First name:</label><br />
                <input className="text-white border-2 divide-gray-50" type="text" id="fname" name="fname" /><br />
                
                <label className="text-white">Last name:</label><br />
                <input className="text-white border-2 divide-gray-50" type="text" id="lname" name="lname" /><br />
                
                <label className="text-white">Pseudo:</label><br />
                <input className="text-white border-2 divide-gray-50" type="text" id="pseudo" name="pseudo" /><br />
                
                <label className="text-white">Email:</label><br />
                <input className="text-white border-2 divide-gray-50" type="email" id="email" name="email" /><br />
                
                <label className="text-white">Password:</label><br />
                <input className="text-white border-2 divide-gray-50" type="password" id="password" name="password" /><br />
                
                <button className="text-white border-2 divide-gray-50" type="submit" value="Submit">Submit</button>
            </form>
            </div>
        </main>
    )
}

export default SignUpView