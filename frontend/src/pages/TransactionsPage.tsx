import { useEffect, useState } from "react"
import { authRequest, UnauthorizedError } from "../api"
import TransactionForm from "../components/TransactionForm"
import TransactionList from "../components/TransactionList"
import { type Transaction, type TransactionInput } from "../types"

type TransactionsPageProps = {
  token: string
  onUnauthorized: () => void
}

// 交易数据只有这个页面在用，所以数据和增删改查的请求都放在这里
function TransactionsPage({ token, onUnauthorized }: TransactionsPageProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [errorMessage, setErrorMessage] = useState("")

  async function loadTransactions() {
    try {
      const data = await authRequest<Transaction[]>("/transaction", token)
      setTransactions(data)
      setErrorMessage("")
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        onUnauthorized()
        return
      }
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong.")
    }
  }

  useEffect(() => {
    loadTransactions()
  }, [token])

  // 添加和保存：令牌失效就退出登录；其他错误继续往上抛，交给表单显示在输入框旁边
  async function handleAdd(input: TransactionInput) {
    try {
      await authRequest("/transaction", token, { method: "POST", body: input })
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        onUnauthorized()
        return
      }
      throw error
    }
    await loadTransactions()
  }

  async function handleSave(id: number, input: TransactionInput) {
    try {
      await authRequest(`/transaction/${id}`, token, { method: "PUT", body: input })
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        onUnauthorized()
        return
      }
      throw error
    }
    await loadTransactions()
  }

  async function handleDelete(id: number) {
    // 删除不能撤销，先让用户确认一次
    if (!window.confirm("Delete this transaction? This can't be undone.")) {
      return
    }
    try {
      await authRequest(`/transaction/${id}`, token, { method: "DELETE" })
      await loadTransactions()
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        onUnauthorized()
        return
      }
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong.")
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2>Transactions</h2>
      </div>
      <TransactionForm submitLabel="Add transaction" onSubmit={handleAdd} />
      {errorMessage && <p className="error">{errorMessage}</p>}
      <TransactionList transactions={transactions} onSave={handleSave} onDelete={handleDelete} />
    </div>
  )
}

export default TransactionsPage
