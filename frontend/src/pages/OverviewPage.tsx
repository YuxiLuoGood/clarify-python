import { useState } from "react"
import BudgetStatusList from "../components/BudgetStatusList"
import TotalSummary from "../components/TotalSummary"
import { getCurrentMonth } from "../utils"

type OverviewPageProps = {
  token: string
  onUnauthorized: () => void
}

function OverviewPage({ token, onUnauthorized }: OverviewPageProps) {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth)

  return (
    <div>
      <div className="page-header">
        <h2>Monthly overview</h2>
        <input
          type="month"
          aria-label="Month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        />
      </div>

      {selectedMonth === "" ? (
        <p className="empty">Pick a month to see your overview.</p>
      ) : (
        <>
          <section className="section">
            <TotalSummary token={token} selectedMonth={selectedMonth} onUnauthorized={onUnauthorized} />
          </section>
          <section className="section">
            <div className="section-header">
              <h3>Budgets</h3>
            </div>
            <BudgetStatusList token={token} selectedMonth={selectedMonth} onUnauthorized={onUnauthorized} />
          </section>
        </>
      )}
    </div>
  )
}

export default OverviewPage
