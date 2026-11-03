import { useState } from "react"
import {loginRequest} from "../api"

type LoginFormProps = {
    onLogin:(token:string) => void
}


function LoginForm({onLogin}:LoginFormProps){
    const [userName,setUserName] = useState("")
    const [password,setPassword] = useState("")
    const [errorMessage,setErrorMessage] = useState("")
    async function handleLogin(){
        try{
            const token = await loginRequest(userName, password)
            onLogin(token)
        }
        catch(error){
            console.error(error)
            setErrorMessage(error instanceof Error ? error.message : "Something went wrong.")
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