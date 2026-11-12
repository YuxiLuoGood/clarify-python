import { useState } from "react"
import { API_URL } from "../api"
import { getErrorMessage } from "../utils"
import CategorySelect from "./CategorySelect"

type SetBudgetFormProps = {
  token: string
  month: string
  onMonthChange: (month: string) => void
  onBudgetSet: () => void
  onUnauthorized: () => void
}

// 月份由 BudgetsPage 管理，因为页面下方的预算状态也要用同一个月份
function SetBudgetForm({ token, month, onMonthChange, onBudgetSet, onUnauthorized }: SetBudgetFormProps) {
  const [category, setCategory] = useState("")
  const [monthlyLimit, setMonthlyLimit] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  async function handleSetBudget() {
    if (category === "" || monthlyLimit === "" || month === "") {
      setErrorMessage("Please fill in all fields.")
      return
    }
    try {
      const response = await fetch(`${API_URL}/budget`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ category, monthly_limit: Number(monthlyLimit), month }),
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
      onBudgetSet()
      // 月份保留：用户通常会接着给同一个月设下一个类别
      setCategory("")
      setMonthlyLimit("")
      setErrorMessage("")
    } catch (error) {
      console.error(error)
      setErrorMessage("Cannot connect to the server.")
    }
  }

  return (
    <form
      className="form-row"
      onSubmit={(e) => {
        e.preventDefault()
        handleSetBudget()
      }}
    >
      <CategorySelect value={category} onChange={setCategory} emptyLabel="Category" />
      <input
        type="month"
        aria-label="Month"
        value={month}
        onChange={(e) => onMonthChange(e.target.value)}
      />
      <input
        type="number"
        step="0.01"
        min="0"
        placeholder="Monthly limit"
        value={monthlyLimit}
        onChange={(e) => setMonthlyLimit(e.target.value)}
      />
      <button type="submit">Set budget</button>
      {errorMessage && <p className="error">{errorMessage}</p>}
    </form>
  )
}

export default SetBudgetForm
