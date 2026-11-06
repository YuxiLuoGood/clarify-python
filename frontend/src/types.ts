export type Transaction = {
  id: number
  description: string
  amount: number
  category: string
  date: string
}

export type ValidationError = {
  loc: (string | number)[]
  msg: string
}

export type Summary = {
  category: string
  total: number
}

export type BudgetStatus = {
  category: string
  monthly_limit: number
  spent: number
  remaining: number
}

// 添加或修改交易时发给后端的数据：和 Transaction 一样，只是没有 id。
// Omit<类型, "字段"> 的意思是"去掉这个字段之后的类型"
export type TransactionInput = Omit<Transaction, "id">