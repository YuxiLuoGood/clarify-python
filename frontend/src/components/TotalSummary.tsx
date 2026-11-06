import { useEffect, useState } from "react"
import { API_URL } from "../api"
import { type Summary } from "../types"
import { formatMoney, getErrorMessage } from "../utils"
import CategorySelect from "./CategorySelect"

type TotalSummaryProps = {
  token: string
  selectedMonth: string
  onUnauthorized: () => void
}

function TotalSummary({ token, selectedMonth, onUnauthorized }: TotalSummaryProps) {
  // 下拉框选一次只触发一次变化，不像文字输入框每打一个字都变，
  // 所以可以直接放进依赖数组，不再需要 Query 按钮
  const [selectedCategory, setSelectedCategory] = useState("")
  const [summary, setSummary] = useState<Summary[]>([])
  const [errorMessage, setErrorMessage] = useState("")

  async function loadSummary() {
    try {
      const params = new URLSearchParams({ month: selectedMonth })
      if (selectedCategory !== "") {
        params.append("category", selectedCategory)
      }
      const response = await fetch(`${API_URL}/summary?${params}`, {
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
      setSummary(data)
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
    loadSummary()
  }, [token, selectedMonth, selectedCategory])

  return (
    <div>
      <div className="section-header">
        <h3>Spending by category</h3>
        <CategorySelect
          value={selectedCategory}
          onChange={setSelectedCategory}
          emptyLabel="All categories"
        />
      </div>
      {summary.length === 0 ? (
        <p className="empty">No spending recorded for this month.</p>
      ) : (
        <ul className="rows">
          {summary.map((s) => (
            <li key={s.category} className="row">
              <span className="row-main">{s.category}</span>
              <span className="amount">{formatMoney(s.total)}</span>
            </li>
          ))}
        </ul>
      )}
      {errorMessage && <p className="error">{errorMessage}</p>}
    </div>
  )
}

export default TotalSummary
