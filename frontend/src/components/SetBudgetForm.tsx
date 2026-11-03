import { useState } from "react"
import { getCurrentMonth, getErrorMessage } from "../utils"

type SetBudgetFormProps = {
    onUnauthorized:()=>void
    token:string
    onBudgetSet:()=>void
}

function SetBudgetForm({token,onUnauthorized,onBudgetSet}:SetBudgetFormProps){
    const [monthlyLimit,setMonthlyLimit] = useState("")
    const [category,setCategory] = useState("")
    const [month,setMonth] = useState(getCurrentMonth)
    const [errorMessage,setErrorMessage] = useState("")

    async function handleSetBudget(){
        if (category ===""||monthlyLimit ===""||month ===""){
            setErrorMessage("Please fill in all fields.")
            return
        }
        try{
            const response = await fetch("http://127.0.0.1:8000/budget",{
            method:"PUT",
            headers:{"Content-Type": "application/json","Authorization":`Bearer ${token}`},
            body:JSON.stringify({monthly_limit:Number(monthlyLimit),category,month})
            })
            const data = await response.json()
            if (response.ok){
                onBudgetSet()
                setMonthlyLimit("")
                setCategory("")
                setErrorMessage("")
                
            }
            else{
                if(response.status === 401){
                    onUnauthorized()
                    return
                }
                setErrorMessage(getErrorMessage(data.detail))
            }
        }
        catch(error){
            console.error(error)
            setErrorMessage("Cannot connect to the server")
        }
    }

    return(
        <div>
            <input
                placeholder="Category"
                value = {category}
                onChange={(e)=>setCategory(e.target.value)}/>
            <input
                placeholder="Month"
                value = {month}
                type="month"
                onChange={(e)=>setMonth(e.target.value)}/>
            <input
                placeholder="Monthly Limit"
                value={monthlyLimit}
                type="number"
                onChange={(e)=>setMonthlyLimit(e.target.value)}/>
            <button onClick={handleSetBudget}>Set Budget</button>   
            {errorMessage && <p>{errorMessage}</p>}
        </div>
    )
}
export default SetBudgetForm