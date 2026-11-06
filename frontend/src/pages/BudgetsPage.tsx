import { useState } from "react"
import { Link } from "react-router"
import BudgetStatusList from "../components/BudgetStatusList"
import SetBudgetForm from "../components/SetBudgetForm"
import { getCurrentMonth } from "../utils"

type BudgetsPageProps = {
  token: string
  onUnauthorized: () => void
}

// 表单和预算状态同时出现在这个页面上，
// 所以"哪个月"和"刷新信号"放在它们共同的父组件，也就是这个页面里
function BudgetsPage({ token, onUnauthorized }: BudgetsPageProps) {
  const [month, setMonth] = useState(getCurrentMonth)
  const [version, setVersion] = useState(0)

  return (
    <div>
      <div className="page-header">
        <h2>Budgets</h2>
      </div>
      <p className="page-intro">
        When your income arrives, split it before you spend: about 50% for needs, 30% for wants,
        and 20% for savings. <Link to="/setup">Plan a month from your income</Link>
      </p>
      <SetBudgetForm
        token={token}
        month={month}
        onMonthChange={setMonth}
        onBudgetSet={() => setVersion((v) => v + 1)}
        onUnauthorized={onUnauthorized}
      />
      <section className="section">
        <div className="section-header">
          <h3>Budget status</h3>
        </div>
        <BudgetStatusList
          token={token}
          selectedMonth={month}
          refreshKey={version}
          onUnauthorized={onUnauthorized}
        />
      </section>
    </div>
  )
}

export default BudgetsPage
