import { getErrorMessage } from "./utils"

// 后端地址只写在这一个地方。
// 部署时在 frontend/.env 里写 VITE_API_URL=线上地址，本地开发用默认值。
export const API_URL: string = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000"

// 令牌失效时抛出这种错误，调用的地方用 instanceof 认出它，再决定退出登录
export class UnauthorizedError extends Error {}

type RequestOptions = {
  method?: string
  body?: unknown
}

// 带令牌的通用请求。所有失败都变成异常抛出，成功时返回后端的数据：
// 连不上服务器 → Error，令牌失效 → UnauthorizedError，其他错误 → 带后端说明的 Error
// <T> 是"泛型"：调用时告诉它返回的数据是什么类型，比如 authRequest<Transaction[]>(...)
export async function authRequest<T = unknown>(
  path: string,
  token: string,
  options: RequestOptions = {},
): Promise<T> {
  const hasBody = options.body !== undefined

  let response: Response
  try {
    response = await fetch(`${API_URL}${path}`, {
      method: options.method ?? "GET",
      headers: hasBody
        ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
        : { Authorization: `Bearer ${token}` },
      body: hasBody ? JSON.stringify(options.body) : undefined,
    })
  } catch {
    throw new Error("Cannot connect to the server.")
  }

  if (response.status === 401) {
    throw new UnauthorizedError("Session expired.")
  }

  const data = await response.json()
  if (!response.ok) {
    throw new Error(getErrorMessage(data.detail))
  }
  return data as T
}

export async function loginRequest(userName: string, password: string): Promise<string> {
  let response: Response
  try {
    response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_name: userName, password: password }),
    })
  } catch {
    throw new Error("Cannot connect to the server.")
  }

  const data = await response.json()
  if (!response.ok) {
    throw new Error(getErrorMessage(data.detail))
  }
  return data.access_token
}