import { useEffect, useState } from "react"
import {type Transaction} from "./types"
import TransactionList from "./components/TransactionList"
import { getErrorMessage,getCurrentMonth } from "./utils"
import LoginForm from "./components/LoginForm"
import AddTransactionForm from "./components/AddTransactionForm"
import TotalSummary from "./components/TotalSummary"
import BudgetStatusList from "./components/BudgetStatusList"
import SetBudgetForm from "./components/SetBudgetForm"







function App() {

  const [errorMessage,setErrorMessage] = useState("")
  const [token,setToken] = useState(()=>localStorage.getItem("token")??"")
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [selectedMonth,setSelectedMonth] = useState(getCurrentMonth)
  const [budgetVersion, setBudgetVersion] = useState(0)
  


  function handleUnauthorized(){
    setToken("")
    setErrorMessage("Session expired. Please log in again.")
  }

  function handleLogout(){
    setToken("")
    setTransactions([])
    setErrorMessage("")
  }

  async function loadTransactions(){
    try{
      const response = await fetch("http://127.0.0.1:8000/transaction",{
        method: "GET",
        headers:{"Authorization":`Bearer ${token}`}
      })
      const data = await response.json()
      if(response.ok){
        setTransactions(data)
        setErrorMessage("")
      }
      else{
        setErrorMessage(getErrorMessage(data.detail))
        if (response.status === 401){
          handleUnauthorized()
        }
      }
    }
    catch(error){
      console.error(error)
      setErrorMessage("Cannot connect to the server.")
    }
  }




  useEffect(()=>{
    if (token===""){
      localStorage.removeItem("token")
    }
    else{
      localStorage.setItem("token",token)
    }
  },[token])

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
      {token ? (
        <div>
          <AddTransactionForm token = {token} onAdded = {loadTransactions} onUnauthorized ={handleUnauthorized}/>
          <TransactionList transactions={transactions}/>
          <div>
            <button onClick={handleLogout}>log out</button>
          </div>
          <h2>Set Budget</h2>
          <SetBudgetForm token = {token} onUnauthorized ={handleUnauthorized} onBudgetSet={() => setBudgetVersion((v) => v + 1)}/>
          <h2>Monthly Overview</h2>
          <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} />
          <TotalSummary transactions={transactions} onUnauthorized = {handleUnauthorized} token = {token} selectedMonth={selectedMonth}/>
          <BudgetStatusList transactions={transactions} onUnauthorized={handleUnauthorized} token={token} selectedMonth={selectedMonth} budgetVersion={budgetVersion}/>
        </div>

      ):(
          <LoginForm onLogin={setToken}/>
      )}
      {errorMessage && <p>{errorMessage}</p>}
    </div>
    
  )


}

export default App
