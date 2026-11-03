import {useState } from "react"
import {getCurrentMonth } from "../utils"
import {type Transaction} from "../types"
import TotalSummary from "../components/TotalSummary"
import BudgetStatusList from "../components/BudgetStatusList"


type OverviewPageProps = {
    transactions:Transaction[]
    onUnauthorized:()=>void
    token:string
    budgetVersion:number

}

function OverviewPages({transactions,onUnauthorized,token,budgetVersion}:OverviewPageProps){
    const [selectedMonth,setSelectedMonth] = useState(getCurrentMonth)
    return(
        <div>
            <h2>Monthly Overview</h2>
            <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} />
            <TotalSummary transactions={transactions} onUnauthorized = {onUnauthorized} token = {token} selectedMonth={selectedMonth}/>
            <BudgetStatusList transactions={transactions} onUnauthorized={onUnauthorized} token={token} selectedMonth={selectedMonth} budgetVersion={budgetVersion}/>
        </div>
    )
}
export default OverviewPages