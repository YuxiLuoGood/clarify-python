import { useState } from "react"
import { loginRequest } from "../api"

type LoginFormProps = {
  onLogin: (token: string) => void
}

function LoginForm({ onLogin }: LoginFormProps) {
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  async function handleLogin() {
    try {
      const token = await loginRequest(userName, password)
      onLogin(token)
    } catch (error) {
      console.error(error)
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong.")
    }
  }

  return (
    // 用 <form>：用户在输入框里按回车也能提交
    // preventDefault() 阻止浏览器默认的"提交后刷新整个页面"
    <form
      className="auth-form"
      onSubmit={(e) => {
        e.preventDefault()
        handleLogin()
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
        placeholder="Password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Log in</button>
      {errorMessage && <p className="error">{errorMessage}</p>}
    </form>
  )
}

export default LoginForm
