import { type SplitPart } from "../categories"
import { formatMoney } from "../utils"

type SplitBarProps = {
  parts: SplitPart[]
}

// 一根分成三段的条，下面是每一段的名称、比例和金额。
// 登录页、注册页、引导页都用它。
function SplitBar({ parts }: SplitBarProps) {
  const description = parts.map((p) => `${p.label} ${p.percent}%`).join(", ")

  return (
    <div>
      <div className="split-bar" role="img" aria-label={description}>
        {parts.map((p) => (
          <div key={p.key} className={`split-segment ${p.key}`} style={{ flexBasis: `${p.percent}%` }} />
        ))}
      </div>
      <ul className="split-legend">
        {parts.map((p) => (
          <li key={p.key} className="split-item">
            <span className={`split-dot ${p.key}`} />
            <span className="split-name">
              {p.label}
              <span className="split-percent">{p.percent}%</span>
              <span className="split-hint">{p.hint}</span>
            </span>
            <span className="split-amount">{formatMoney(p.amount)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SplitBar
