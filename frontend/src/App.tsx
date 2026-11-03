import { useEffect, useState } from "react"
import {type Transaction} from "./types"
import { getErrorMessage } from "./utils"
import { Routes, Route, NavLink, Navigate } from "react-router"
import TransactionsPage from "./pages/TransactionsPage"
import OverviewPages from "./pages/OverviewPage"
import BudgetsPage from "./pages/BudgetsPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"







function App() {

  const [errorMessage,setErrorMessage] = useState("")
  const [token,setToken] = useState(()=>localStorage.getItem("token")??"")
  const [transactions, setTransactions] = useState<Transaction[]>([])
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
  function handleBudgetSet(){
    setBudgetVersion((v)=>v+1)
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


  return(
    <div>
      {token ? (
        <div>
          <nav>
            <NavLink to="/overview">Overview</NavLink>
            <NavLink to="/transactions">Transactions</NavLink>
            <NavLink to="/budgets">Budget Setting</NavLink>
            <button onClick={handleLogout}>Log out</button>
          </nav>
          <Routes>
            <Route path="/transactions" element={<TransactionsPage token={token} loadTransactions={loadTransactions} onUnauthorized={handleUnauthorized}  transactions={transactions}/>} />
            <Route path="/overview" element={<OverviewPages token={token} budgetVersion={budgetVersion} onUnauthorized={handleUnauthorized}  transactions={transactions}/>} />
            <Route path="/budgets" element={<BudgetsPage token={token} setBudgetVersion={handleBudgetSet} handleUnauthorized={handleUnauthorized}/>}/>
            <Route path="*" element={<Navigate to="/overview" replace />} />
          </Routes>
        </div>

      ):(
          <div>
            <Routes>
              <Route path="/login" element={<LoginPage onLogin={setToken}/>}/>
              <Route path="/register" element={<RegisterPage onRegister={setToken}/>}/>
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
          
      )}
      {errorMessage && <p>{errorMessage}</p>}
    </div>
    
  )


}

export default App
