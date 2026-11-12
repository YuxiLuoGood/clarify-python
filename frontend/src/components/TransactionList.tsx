import { useState } from "react"
import { type Transaction, type TransactionInput } from "../types"
import { formatMoney } from "../utils"
import TransactionForm from "./TransactionForm"

type TransactionListProps = {
  transactions: Transaction[]
  onSave: (id: number, input: TransactionInput) => Promise<void>
  onDelete: (id: number) => void
}

function TransactionList({ transactions, onSave, onDelete }: TransactionListProps) {
  // 一次只编辑一条：记住正在编辑的那条交易的 id，没有在编辑时是 null。
  // 这个 state 只有列表自己用，所以放在列表里，而不是放在页面里
  const [editingId, setEditingId] = useState<number | null>(null)

  // 注意：JavaScript 里空数组 [] 当作条件是 true，所以要看长度
  if (transactions.length === 0) {
    return <p className="empty">No transactions yet. Add your first one above.</p>
  }

  return (
    <ul className="rows">
      {transactions.map((t) =>
        t.id === editingId ? (
          <li key={t.id} className="row editing">
            <TransactionForm
              className="form-row inline"
              initial={t}
              submitLabel="Save"
              onSubmit={async (input) => {
                // 保存成功才退出编辑；失败时 onSave 会抛出错误，表单留着并显示错误
                await onSave(t.id, input)
                setEditingId(null)
              }}
              onCancel={() => setEditingId(null)}
            />
          </li>
        ) : (
          <li key={t.id} className="row">
            <span className="row-main">{t.description}</span>
            <span className="row-sub">{t.category}</span>
            <span className="row-sub">{t.date}</span>
            <span className="amount">{formatMoney(t.amount)}</span>
            <span className="row-actions">
              <button
                type="button"
                className="text-button"
                aria-label={`Edit ${t.description}`}
                onClick={() => setEditingId(t.id)}
              >
                Edit
              </button>
              <button
                type="button"
                className="text-button danger"
                aria-label={`Delete ${t.description}`}
                onClick={() => onDelete(t.id)}
              >
                Delete
              </button>
            </span>
          </li>
        ),
      )}
    </ul>
  )
}

export default TransactionList