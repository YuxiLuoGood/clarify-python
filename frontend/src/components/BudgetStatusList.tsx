import { type BudgetStatus, type Transaction } from "../types";
import { useEffect, useState } from "react"
import { getErrorMessage} from "../utils"

type BudgetStatusListProps = {
    onUnauthorized:()=>void
    token:string
    transactions:Transaction[]
    selectedMonth:string
    budgetVersion:number
}

function BudgetStatusList({onUnauthorized,token,transactions,selectedMonth,budgetVersion}:BudgetStatusListProps){
    const [errorMessage,setErrorMessage] = useState("")
    const [budgetStatus,setBudgetStatus] = useState<BudgetStatus[]>([])
    async function loadBudgetStatus(){
        if (selectedMonth ===""){
            setErrorMessage("Please fill in specific date.")
            return
        }
        try{
            const params = new URLSearchParams({month: selectedMonth})
            const response = await fetch(`http://127.0.0.1:8000/budget/status?${params}`,{
            method:"GET",
            headers:{"Authorization":`Bearer ${token}`},
            })
            const data = await response.json()
            if (response.ok){
                setBudgetStatus(data)
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
    useEffect(()=>{
        if(token === ""){
            return
        }
        else{
            loadBudgetStatus()
        }
    },[token,selectedMonth,transactions,budgetVersion])

    return(
        <div>
            <ul>
                {budgetStatus.map((t)=>(
                    <li key={t.category}>
                        category: {t.category}
                        spent:{t.spent}
                        remaining:{t.remaining}
                        monthly limit:{t.monthly_limit}
                    </li>     
                    )
                )}
            </ul>
            {errorMessage&&<p>{errorMessage}</p>}
        </div>
    )

}
export default BudgetStatusList