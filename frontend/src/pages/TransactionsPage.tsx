import AddTransactionForm from "../components/AddTransactionForm"
import TransactionList from "../components/TransactionList"
import {type Transaction} from "../types"
import { useEffect} from "react"

type TransactionsPageProps = {
    loadTransactions:() =>void
    onUnauthorized:()=>void
    token:string
    transactions:Transaction[]
}

function TransactionsPage({loadTransactions,onUnauthorized,token,transactions}:TransactionsPageProps){
    useEffect(()=>{
        if (token===""){
            return
        }
        else{
            loadTransactions() 
        }
    },[token])
    return(
        <div>
            <AddTransactionForm token = {token} onAdded = {loadTransactions} onUnauthorized ={onUnauthorized}/>
            <TransactionList transactions={transactions}/>
        </div>
        
    )
}
export default TransactionsPage