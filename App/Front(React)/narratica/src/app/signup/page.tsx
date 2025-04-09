"use client"

function SignUpView(){

    return(
        
        <main>
            <div className="flex justify-center items-center min-h-screen">
            <form className="space-y-4" action="/">
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
                
                <input className="text-white border-2 divide-gray-50" type="submit" value="Submit" />
            </form>
            </div>
        </main>
    )
}

export default SignUpView