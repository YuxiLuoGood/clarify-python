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
  user_id:number
  category: string
  total:number
}

export type BudgetStatus = {
  remaining:number
  spent:number
  monthly_limit:number
  category:string

}
