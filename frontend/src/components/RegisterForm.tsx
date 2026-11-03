import { useState } from "react"
import { getErrorMessage } from "../utils"
import {loginRequest} from "../api"
import { useNavigate } from "react-router"
import { MIN_PASSWORD_LENGTH } from "../utils"

type RegisterFormProps = {
    onRegister:(token:string)=>void
}

function RegisterForm({onRegister}:RegisterFormProps) {
    const navigate = useNavigate()
    const [userName,setUserName] = useState("")
    const [password,setPassword] = useState("")
    const [errorMessage,setErrorMessage] = useState("")
    async function handleRegister() {
        if (userName.trim() ===""){
            setErrorMessage("Please enter a username.")
            return
        }
        if(password.length<MIN_PASSWORD_LENGTH){
            setErrorMessage(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`)
            return
        }
        let response:Response
        try{
            response = await fetch("http://127.0.0.1:8000/register",{
            method: "POST",
            headers:{"Content-Type": "application/json" },
            body:JSON.stringify({user_name:userName,password:password})
            })
        }
        catch(error){
            console.error(error)
            setErrorMessage("Cannot connect to the server.")
            return
        }
                
        const data = await response.json()
        if (!response.ok) {
            setErrorMessage(getErrorMessage(data.detail))
            return
        }

        try {
            const token = await loginRequest(userName, password)
            onRegister(token)
        } catch {
            navigate("/login", { state: { message: "Account created. Please log in." } })
        }
    }
    

    return(
        <div>
            <h1>Register Page</h1>
            <input value = {userName} onChange={(e)=>setUserName(e.target.value)}/>
            <input value = {password} type="password" onChange={(e)=>setPassword(e.target.value)}/>
            <button onClick={handleRegister}>Register</button>
            {errorMessage && <p>{errorMessage}</p>}
        </div>
    )
}
export default RegisterForm