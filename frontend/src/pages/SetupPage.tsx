import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router"
import { API_URL } from "../api"
import SplitBar from "../components/SplitBar"
import {
  CATEGORY_GROUPS,
  DEFAULT_SHARES,
  type GroupKey,
  type Shares,
  roundCents,
  splitIncome,
} from "../categories"
import { formatMoney, getCurrentMonth } from "../utils"

type SetupPageProps = {
  token: string
  onUnauthorized: () => void
}

// 引导页：输入收入、调整 50/30/20 的比例，一键生成这个月每个类别的预算。
// 只用到已有的 PUT /budget 接口，后端不用改。
function SetupPage({ token, onUnauthorized }: SetupPageProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const incomeFromSignup = (location.state as { income?: string } | null)?.income

  const [income, setIncome] = useState(() => incomeFromSignup ?? "")
  const [month, setMonth] = useState(getCurrentMonth)
  const [shares, setShares] = useState<Shares>(DEFAULT_SHARES)
  const [saving, setSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  // 下面这些都是"根据 state 算出来的值"，不需要单独存成 state
  const incomeValue = Math.max(0, Number(income) || 0)
  const parts = splitIncome(incomeValue, shares)
  const total = shares.needs + shares.wants + shares.savings
  const plan = CATEGORY_GROUPS.map((group) => {
    const groupAmount = (incomeValue * shares[group.key]) / 100
    return {
      key: group.key,
      label: group.label,
      items: group.categories.map((c) => ({ name: c.name, amount: roundCents(groupAmount * c.weight) })),
    }
  })
  const canSave = incomeValue > 0 && total === 100 && month !== "" && !saving

  function updateShare(key: GroupKey, value: number) {
    // [key]: value 的意思是"用变量 key 的值作为属性名"
    setShares((prev) => ({ ...prev, [key]: value }))
  }

  async function handleCreateBudgets() {
    if (!canSave) {
      return
    }
    setSaving(true)
    setErrorMessage("")

    // flatMap：把三组各自的类别列表摊平成一个列表
    const items = plan.flatMap((group) => group.items).filter((item) => item.amount > 0)

    try {
      // Promise.all：同时发出所有请求，等它们全部回来
      const responses = await Promise.all(
        items.map((item) =>
          fetch(`${API_URL}/budget`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ category: item.name, monthly_limit: item.amount, month }),
          }),
        ),
      )
      if (responses.some((r) => r.status === 401)) {
        onUnauthorized()
        return
      }
      const failed = responses.filter((r) => !r.ok).length
      if (failed > 0) {
        setErrorMessage(
          `${failed} of ${items.length} budgets couldn't be saved. Try again, or set them on the Budgets page.`,
        )
        setSaving(false)
        return
      }
      navigate("/overview")
    } catch (error) {
      console.error(error)
      setErrorMessage("Cannot connect to the server. Try again in a moment.")
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2>Plan your month</h2>
      </div>
      <p className="page-intro">
        Start from your income. Clarify splits it 50/30/20 and turns each part into category
        budgets. You can fine-tune any of them later on the Budgets page.
      </p>

      <div className="planner">
        <div className="planner-controls">
          <div className="planner-fields">
            <label className="field">
              <span className="field-label">Monthly income</span>
              <span className="money-input">
                <span aria-hidden="true">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  inputMode="decimal"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                />
              </span>
            </label>
            <label className="field">
              <span className="field-label">Month</span>
              <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
            </label>
          </div>

          {CATEGORY_GROUPS.map((group) => (
            <label key={group.key} className={`split-control ${group.key}`}>
              <span className="split-control-name">{group.label}</span>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={shares[group.key]}
                onChange={(e) => updateShare(group.key, Number(e.target.value))}
              />
              <span className="split-control-value">{shares[group.key]}%</span>
            </label>
          ))}

          <p className={total === 100 ? "split-total" : "split-total off"}>
            {total === 100
              ? "Your split adds up to 100%."
              : `Your split adds up to ${total}%. Adjust it to 100% to continue.`}
          </p>
        </div>

        <SplitBar parts={parts} />

        <div className="plan-groups">
          {plan.map((group) => (
            <section key={group.key} className="plan-group">
              <h3>{group.label}</h3>
              <ul className="rows">
                {group.items.map((item) => (
                  <li key={item.name} className="row">
                    <span className="row-main">{item.name}</span>
                    <span className="amount">{formatMoney(item.amount)}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="form-actions">
          <button type="button" disabled={!canSave} onClick={handleCreateBudgets}>
            {saving ? "Creating budgets…" : "Create my budgets"}
          </button>
          <Link to="/overview">Skip for now</Link>
        </div>
        {errorMessage && <p className="error">{errorMessage}</p>}
      </div>
    </div>
  )
}

export default SetupPage
