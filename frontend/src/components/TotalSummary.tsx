import { type Summary, type Transaction } from "../types";
import { useEffect, useState } from "react"
import { getErrorMessage} from "../utils"

type TotalSummaryProps = {
    onUnauthorized:()=>void
    token:string
    transactions:Transaction[]
    selectedMonth:string
}

function TotalSummary({onUnauthorized,token,transactions,selectedMonth}:TotalSummaryProps){
    const [inputCategory,setInputCategory] = useState("")
    const [selectedCategory,setSelectedCategory] = useState("")
    const [errorMessage,setErrorMessage] = useState("")
    const [summary,setSummary] = useState<Summary[]>([])

    async function loadSummary(){
    if (selectedMonth ===""){
        setErrorMessage("Please fill in specific date.")
        return
    }
    try{
        const params = new URLSearchParams({month: selectedMonth})
        if (selectedCategory!== ""){
            params.append("category",selectedCategory)
        }
        const response = await fetch(`http://127.0.0.1:8000/summary?${params}`,{
        method:"GET",
        headers:{"Authorization":`Bearer ${token}`},
        })
        const data = await response.json()
        if (response.ok){
            setSummary(data)
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
        loadSummary()
    }
    
},[token,selectedMonth,selectedCategory,transactions])

return(
    <div>

        <input placeholder = {"Category"} value = {inputCategory} onChange = {(e)=>setInputCategory(e.target.value)}/>
        <button onClick={()=>{setSelectedCategory(inputCategory)}}>Query</button>
        <ul>
            {summary.map((t) => (
            <li key={t.category}>
                category: {t.category}
                total:{t.total}
            </li>
            ))}
        </ul>
        {errorMessage&&<p>{errorMessage}</p>}
    </div>
)

}

export default TotalSummary