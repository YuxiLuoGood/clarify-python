import LoginForm from "../components/LoginForm"
import { Link } from "react-router"
import { useLocation } from "react-router"


type LoginPageProps ={
    onLogin:(token:string)=>void
}

function LoginPage({onLogin}:LoginPageProps){
    const location = useLocation()
    const message = (location.state as { message?: string } | null)?.message
    return(
        <div>
            <h1>Login Page</h1>
            <LoginForm onLogin={onLogin}/>
            <p>Don't have an account? <Link to="/register">Register here</Link></p>
            {message}
        </div>
        

    )
}
export default LoginPage