



    const fetchBook = async () => {
        try{
            const response = await fetch('http://127.0.0.1:8000/api/audio')
            const data = await response.json
        }catch(err){
            console.log(err)
        }
    }
