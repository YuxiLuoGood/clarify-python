import { useState } from "react"
import { type TransactionInput } from "../types"
import { getToday } from "../utils"
import CategorySelect from "./CategorySelect"

type TransactionFormProps = {
  initial?: TransactionInput // 编辑时传入原来的值；添加时不传
  submitLabel: string
  // 提交时调用。失败时它会抛出错误，表单把错误信息显示出来
  onSubmit: (input: TransactionInput) => Promise<void>
  onCancel?: () => void // 编辑时才有"取消"按钮
  className?: string
}

// 添加和编辑共用的交易表单。它只负责收集和检查输入，
// 真正发请求的事交给父组件，所以同一个表单可以用在两种场景
function TransactionForm({ initial, submitLabel, onSubmit, onCancel, className = "form-row" }: TransactionFormProps) {
  const [description, setDescription] = useState(initial?.description ?? "")
  const [amount, setAmount] = useState(initial ? String(initial.amount) : "")
  const [category, setCategory] = useState(initial?.category ?? "")
  const [date, setDate] = useState(initial?.date ?? getToday())
  const [errorMessage, setErrorMessage] = useState("")
  const [saving, setSaving] = useState(false)

  async function handleSubmit() {
    if (description.trim() === "" || amount === "" || category === "" || date === "") {
      setErrorMessage("Please fill in all fields.")
      return
    }
    setSaving(true)
    try {
      await onSubmit({ description: description.trim(), amount: Number(amount), category, date })
      setErrorMessage("")
      if (!initial) {
        // 添加模式：清空，方便接着记下一笔；日期保留
        setDescription("")
        setAmount("")
        setCategory("")
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong.")
    } finally {
      // finally 里的代码不管成功还是失败都会执行
      setSaving(false)
    }
  }

  return (
    <form
      className={className}
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit()
      }}
    >
      <input
        placeholder="Description"
        aria-label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      {/* step="0.01" 允许输入两位小数，否则浏览器会把 12.50 当成不合法 */}
      <input
        type="number"
        step="0.01"
        placeholder="Amount"
        aria-label="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <CategorySelect value={category} onChange={setCategory} emptyLabel="Category" />
      <input type="date" aria-label="Date" value={date} onChange={(e) => setDate(e.target.value)} />
      <button type="submit" disabled={saving}>
        {submitLabel}
      </button>
      {onCancel && (
        <button type="button" className="button-secondary" onClick={onCancel}>
          Cancel
        </button>
      )}
      {errorMessage && <p className="error">{errorMessage}</p>}
    </form>
  )
}

export default TransactionForm
