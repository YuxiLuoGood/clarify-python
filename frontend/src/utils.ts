import { type ValidationError } from "./types"

export const MIN_PASSWORD_LENGTH = 6

export function getErrorMessage(detail: string | ValidationError[]): string {
  if (Array.isArray(detail)) {
    return detail
      .map((d) => `${d.loc[d.loc.length - 1]}: ${d.msg}`)
      .join("; ")
  }
  return detail
}

// 用用户电脑上的当地时间，不用 toISOString()（那是 UTC 时间）
export function getCurrentMonth(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  return `${year}-${month}`
}

export function getToday(): string {
  const now = new Date()
  const day = String(now.getDate()).padStart(2, "0")
  return `${getCurrentMonth()}-${day}`
}

const moneyFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })

export function formatMoney(value: number): string {
  return moneyFormatter.format(value)
}

export type MonthProgress = {
  daysInMonth: number
  daysElapsed: number
  fraction: number // 这个月已经过去了多少，0 到 1
  isCurrent: boolean
}

// 计算某个月（"2026-11" 这种格式）过去了多少
export function getMonthProgress(month: string): MonthProgress {
  const [year, monthNumber] = month.split("-").map(Number)
  // 第 0 天会被 JavaScript 理解成"上个月的最后一天"，用来算一个月有几天
  const daysInMonth = new Date(year, monthNumber, 0).getDate()
  const current = getCurrentMonth()

  // "YYYY-MM" 格式的字符串可以直接比较大小，因为年和月都是固定位数
  if (month < current) {
    return { daysInMonth, daysElapsed: daysInMonth, fraction: 1, isCurrent: false }
  }
  if (month > current) {
    return { daysInMonth, daysElapsed: 0, fraction: 0, isCurrent: false }
  }
  const daysElapsed = new Date().getDate()
  return { daysInMonth, daysElapsed, fraction: daysElapsed / daysInMonth, isCurrent: true }
}
