import { useState } from "react"
import { getErrorMessage } from "../utils"

type LoginFormProps = {
    onLogin:(token:string) => void
}


function LoginForm({onLogin}:LoginFormProps){
    const [userName,setUserName] = useState("")
    const [password,setPassword] = useState("")
    const [errorMessage,setErrorMessage] = useState("")
    async function handleLogin(){
        try{
            const response = await fetch("http://127.0.0.1:8000/login",{
            method: "POST",
            headers:{"Content-Type": "application/json" },
            body:JSON.stringify({user_name:userName,password:password})
            })
        
            const data = await response.json()

            if (response.ok){
                onLogin(data.access_token)
                setErrorMessage("")

            }
            else{
                setErrorMessage(getErrorMessage(data.detail))
            }
            console.log(data)
        }
        catch(error){
            console.error(error)
            setErrorMessage("Cannot connect to the server.")
        }

    }

    return(
        <div>
        <input value = {userName} onChange={(e)=>setUserName(e.target.value)}/>
        <input value = {password} type="password" onChange={(e)=>setPassword(e.target.value)}/>
        <button onClick={handleLogin}>Login</button>
        {errorMessage && <p>{errorMessage}</p>}
        </div>
    )

}

export default LoginForm