import { getErrorMessage } from "./utils"

export async function loginRequest(userName: string, password: string): Promise<string> {
    let response: Response
    try{
        response = await fetch("http://127.0.0.1:8000/login",{
        method: "POST",
        headers:{"Content-Type": "application/json" },
        body:JSON.stringify({user_name:userName,password:password})
        })
    }
    catch{
        throw new Error("Cannot connect to the server.")
    }
        
        const data = await response.json()

        if (response.ok){
            return data.access_token

        }
        else{
            throw new Error(getErrorMessage(data.detail))
        }
    
}