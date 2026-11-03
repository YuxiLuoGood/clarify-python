import { useState } from "react"
import { getErrorMessage } from "../utils"

type AddTransactionFormProps = {
    onAdded:() =>void
    onUnauthorized:()=>void
    token:string
}

function AddTransactionForm({onAdded,token,onUnauthorized}:AddTransactionFormProps){
    const [description,setDescription] = useState("")
    const [amount,setAmount] = useState("")
    const [category,setCategory] = useState("")
    const [date,setDate] = useState("")
    const [errorMessage,setErrorMessage] = useState("")

    async function handleAddTransaction(){
    if (category ===""||amount ===""||description ===""||date ===""){
        setErrorMessage("Please fill in all fields.")
        return
    }
    try{
        const response = await fetch("http://127.0.0.1:8000/transaction",{
        method:"POST",
        headers:{"Content-Type": "application/json","Authorization":`Bearer ${token}`},
        body:JSON.stringify({description,amount:Number(amount),category,date})
        })
        const data = await response.json()
        if (response.ok){
            onAdded()
            setDescription("")
            setAmount("")
            setCategory("")
            setDate("")
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
                placeholder="Description"
                value={description}
                onChange={(e)=>setDescription(e.target.value)}
                />
            <input
                placeholder="Amount"
                value={amount}
                type="number"
                onChange={(e)=>setAmount(e.target.value)}/>
            <input
                placeholder="Category"
                value = {category}
                onChange={(e)=>setCategory(e.target.value)}/>
            <input
                placeholder="Date"
                value = {date}
                type="date"
                onChange={(e)=>setDate(e.target.value)}/>
            <button onClick={handleAddTransaction}>Add Transaction</button>   
            {errorMessage && <p>{errorMessage}</p>}
        </div>
    )
    
}
export default AddTransactionForm