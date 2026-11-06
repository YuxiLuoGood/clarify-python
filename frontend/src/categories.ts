// 固定的类别列表，按 50/30/20 法则分成三组。
// 记账、设预算、引导页用的都是这一份，类别名永远对得上。

export type GroupKey = "needs" | "wants" | "savings"

export type CategoryGroup = {
  key: GroupKey
  label: string
  hint: string
  // weight：在引导页里，这个类别分到本组金额的比例，同一组加起来是 1
  // fixed：每月一次性支付的固定账单（比如房租），不适合按"平均每天花多少"来预测
  categories: { name: string; weight: number; fixed?: boolean }[]
}

export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    key: "needs",
    label: "Needs",
    hint: "Rent, groceries and bills",
    categories: [
      { name: "Rent", weight: 0.55, fixed: true },
      { name: "Groceries", weight: 0.2 },
      { name: "Utilities", weight: 0.1, fixed: true },
      { name: "Transport", weight: 0.1 },
      { name: "Health", weight: 0.05 },
    ],
  },
  {
    key: "wants",
    label: "Wants",
    hint: "Dining, shopping and fun",
    categories: [
      { name: "Dining", weight: 0.35 },
      { name: "Shopping", weight: 0.3 },
      { name: "Entertainment", weight: 0.2 },
      { name: "Travel", weight: 0.15 },
    ],
  },
  {
    key: "savings",
    label: "Savings",
    hint: "Money you keep for later",
    categories: [
      { name: "Savings", weight: 0.5 },
      { name: "Investing", weight: 0.5 },
    ],
  },
]

// Record<GroupKey, number> 的意思是：一个对象，键是三个组名，值是数字
export type Shares = Record<GroupKey, number>

export const DEFAULT_SHARES: Shares = { needs: 50, wants: 30, savings: 20 }

export type SplitPart = {
  key: GroupKey
  label: string
  hint: string
  percent: number
  amount: number
}

export function roundCents(value: number): number {
  return Math.round(value * 100) / 100
}

// 把一笔收入按比例分成三份
export function splitIncome(income: number, shares: Shares = DEFAULT_SHARES): SplitPart[] {
  return CATEGORY_GROUPS.map((group) => ({
    key: group.key,
    label: group.label,
    hint: group.hint,
    percent: shares[group.key],
    amount: roundCents((income * shares[group.key]) / 100),
  }))
}

// 查一个类别属于哪一组，找不到返回 undefined
export function getGroupKey(category: string): GroupKey | undefined {
  return CATEGORY_GROUPS.find((group) => group.categories.some((c) => c.name === category))?.key
}

export function isFixedCategory(category: string): boolean {
  return CATEGORY_GROUPS.some((group) =>
    group.categories.some((c) => c.name === category && c.fixed === true),
  )
}
