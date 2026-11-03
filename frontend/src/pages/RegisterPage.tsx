import RegisterForm from "../components/RegisterForm"

type RegisterPageProps ={
    onRegister:(token:string)=>void
}

function RegisterPage({onRegister}:RegisterPageProps){
    return(
        <div>
            <RegisterForm onRegister={onRegister}/>
        </div>
    )
}
export default RegisterPage