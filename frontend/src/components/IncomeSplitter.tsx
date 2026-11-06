import { splitIncome } from "../categories"
import SplitBar from "./SplitBar"

type IncomeSplitterProps = {
  income: string
  onIncomeChange: (income: string) => void
}

// 登录页和注册页右边的"工资分配器"，不需要登录就能玩
function IncomeSplitter({ income, onIncomeChange }: IncomeSplitterProps) {
  // Number("") 是 0，Number("abc") 是 NaN；|| 0 把 NaN 也变成 0
  // Math.max(0, ...) 防止输入负数
  const amount = Math.max(0, Number(income) || 0)

  return (
    <div>
      <h2>Split your next paycheck</h2>
      <p className="aside-intro">
        When income arrives, divide it before you spend: 50% for needs, 30% for wants and 20% for
        savings.
      </p>
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
            onChange={(e) => onIncomeChange(e.target.value)}
          />
        </span>
      </label>
      <SplitBar parts={splitIncome(amount)} />
    </div>
  )
}

export default IncomeSplitter
