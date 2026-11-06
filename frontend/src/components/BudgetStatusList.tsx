import { useEffect, useState } from "react"
import { API_URL } from "../api"
import { getGroupKey, isFixedCategory } from "../categories"
import { type BudgetStatus } from "../types"
import { type MonthProgress, formatMoney, getErrorMessage, getMonthProgress } from "../utils"

type BudgetStatusListProps = {
  token: string
  selectedMonth: string
  onUnauthorized: () => void
  refreshKey?: number // 可选：父组件改变它，列表就重新加载
}

// 按"到今天为止的花钱速度"预测这个月会不会超支
function getPace(spent: number, limit: number, month: string, progress: MonthProgress) {
  // 只预测当前月；已经超支的不用预测；还没花钱的没有速度可言
  if (!progress.isCurrent || limit <= 0 || spent === 0 || spent > limit) {
    return { ahead: false, message: "" }
  }
  const dailyRate = spent / progress.daysElapsed
  const projected = dailyRate * progress.daysInMonth
  if (projected <= limit) {
    return { ahead: false, message: "On pace for the month." }
  }
  // 按现在的速度，第几天会花完预算
  const crossDay = Math.ceil(limit / dailyRate)
  const [year, monthNumber] = month.split("-").map(Number)
  const crossDate = new Date(year, monthNumber - 1, crossDay).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
  return { ahead: true, message: `At this pace, you'll go over around ${crossDate}.` }
}

function BudgetStatusList({ token, selectedMonth, onUnauthorized, refreshKey = 0 }: BudgetStatusListProps) {
  const [budgetStatus, setBudgetStatus] = useState<BudgetStatus[]>([])
  const [errorMessage, setErrorMessage] = useState("")

  async function loadBudgetStatus() {
    try {
      const params = new URLSearchParams({ month: selectedMonth })
      const response = await fetch(`${API_URL}/budget/status?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (response.status === 401) {
        onUnauthorized()
        return
      }
      if (!response.ok) {
        setErrorMessage(getErrorMessage(data.detail))
        return
      }
      setBudgetStatus(data)
      setErrorMessage("")
    } catch (error) {
      console.error(error)
      setErrorMessage("Cannot connect to the server.")
    }
  }

  useEffect(() => {
    if (selectedMonth === "") {
      return
    }
    loadBudgetStatus()
  }, [token, selectedMonth, refreshKey])

  if (selectedMonth === "") {
    return null
  }

  const progress = getMonthProgress(selectedMonth)
  const showMarker = progress.isCurrent

  return (
    <div>
      {budgetStatus.length === 0 ? (
        <p className="empty">No budgets set for this month yet.</p>
      ) : (
        <>
          {showMarker && (
            <p className="meter-legend">
              The thin line on each bar marks where you'd be today if you spent evenly through the
              month.
            </p>
          )}
          <ul className="budgets">
            {budgetStatus.map((b) => {
              const percent = b.monthly_limit > 0 ? Math.min((b.spent / b.monthly_limit) * 100, 100) : 100
              const isSavings = getGroupKey(b.category) === "savings"

              // 储蓄类反过来：存得比目标多是好事，不显示红色，也不做超支预测
              if (isSavings) {
                return (
                  <li key={b.category} className="budget savings">
                    <div className="budget-head">
                      <span className="budget-name">{b.category}</span>
                      <span className="budget-left">
                        {b.remaining > 0 ? `${formatMoney(b.remaining)} to go` : "Goal reached"}
                      </span>
                    </div>
                    <div className="meter-wrap">
                      <div className="meter">
                        <div className="meter-fill" style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                    <p className="budget-sub">
                      {formatMoney(b.spent)} of {formatMoney(b.monthly_limit)} saved
                    </p>
                  </li>
                )
              }

              const over = b.remaining < 0
              // 房租这类固定账单通常月初一次付清，按平均速度预测会误报，所以跳过
              const tracksPace = !isFixedCategory(b.category)
              const pace = tracksPace
                ? getPace(b.spent, b.monthly_limit, selectedMonth, progress)
                : { ahead: false, message: "" }
              const statusClass = over ? "budget over" : pace.ahead ? "budget ahead" : "budget"

              return (
                <li key={b.category} className={statusClass}>
                  <div className="budget-head">
                    <span className="budget-name">{b.category}</span>
                    <span className="budget-left">
                      {over
                        ? `${formatMoney(Math.abs(b.remaining))} over`
                        : `${formatMoney(b.remaining)} left`}
                    </span>
                  </div>
                  <div className="meter-wrap">
                    <div className="meter">
                      <div className="meter-fill" style={{ width: `${percent}%` }} />
                    </div>
                    {showMarker && tracksPace && (
                      <div className="meter-marker" style={{ left: `${progress.fraction * 100}%` }} />
                    )}
                  </div>
                  <p className="budget-sub">
                    {formatMoney(b.spent)} of {formatMoney(b.monthly_limit)} spent
                  </p>
                  {pace.message && <p className="budget-pace">{pace.message}</p>}
                </li>
              )
            })}
          </ul>
        </>
      )}
      {errorMessage && <p className="error">{errorMessage}</p>}
    </div>
  )
}

export default BudgetStatusList
