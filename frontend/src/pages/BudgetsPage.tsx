import SetBudgetForm from "../components/SetBudgetForm"


type BudgetsPageProps={
    handleUnauthorized:()=>void
    token:string
    setBudgetVersion:()=>void
}

function BudgetsPage({handleUnauthorized,token,setBudgetVersion}:BudgetsPageProps){
    return(
        <div>
            <h2>Set Budget</h2>
            <SetBudgetForm token = {token} onUnauthorized ={handleUnauthorized} onBudgetSet={setBudgetVersion}/>
        </div>

    )
}
export default BudgetsPage