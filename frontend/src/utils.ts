import { type ValidationError } from "./types"

export function getErrorMessage(detail: string | ValidationError[]): string {
  if (Array.isArray(detail)) {
    return detail
      .map((d) => `${d.loc[d.loc.length-1]}:${d.msg}`)
      .join("; ")
  }
  return detail
}

export function getCurrentMonth():string{
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth()+1).padStart(2,"0")
  return `${year}-${month}`
}