import { useState } from "react"
import { useNavigate } from "react-router"
import { API_URL, loginRequest } from "../api"
import { getErrorMessage, MIN_PASSWORD_LENGTH } from "../utils"

type RegisterFormProps = {
  income: string // 右边工资分配器里的收入，注册成功后带到引导页
  onRegister: (token: string) => void
}

function RegisterForm({ income, onRegister }: RegisterFormProps) {
  const navigate = useNavigate()
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  async function handleRegister() {
    if (userName.trim() === "") {
      setErrorMessage("Please enter a username.")
      return
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setErrorMessage(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`)
      return
    }

    // 第一步：注册
    let response: Response
    try {
      response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_name: userName, password: password }),
      })
    } catch (error) {
      console.error(error)
      setErrorMessage("Cannot connect to the server.")
      return
    }

    const data = await response.json()
    if (!response.ok) {
      setErrorMessage(getErrorMessage(data.detail))
      return
    }

    // 第二步：自动登录。能走到这里，说明账号已经创建好了
    try {
      const token = await loginRequest(userName, password)
      onRegister(token)
      // 新用户先去引导页，用刚才输入的收入生成第一个月的预算
      navigate("/setup", { state: { income } })
    } catch {
      navigate("/login", { state: { message: "Account created. Please log in." } })
    }
  }

  return (
    <form
      className="auth-form"
      onSubmit={(e) => {
        e.preventDefault()
        handleRegister()
      }}
    >
      <input
        placeholder="Username"
        autoComplete="username"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <input
        type="password"
        placeholder={`Password (at least ${MIN_PASSWORD_LENGTH} characters)`}
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Create account</button>
      {errorMessage && <p className="error">{errorMessage}</p>}
    </form>
  )
}

export default RegisterForm
