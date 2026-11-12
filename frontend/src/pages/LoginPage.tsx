import { useState } from "react"
import { Link, useLocation } from "react-router"
import IncomeSplitter from "../components/IncomeSplitter"
import LoginForm from "../components/LoginForm"

type LoginPageProps = {
  onLogin: (token: string) => void
}

function LoginPage({ onLogin }: LoginPageProps) {
  const location = useLocation()
  const message = (location.state as { message?: string } | null)?.message
  // 预先填一个示例收入，访客一打开页面就能看到分配的效果
  const [income, setIncome] = useState("4000")

  return (
    <div className="auth">
      <div className="auth-layout">
        <div className="auth-panel">
          <h1>Clarify</h1>
          <p className="auth-tagline">See where your money goes, month by month!</p>
          <h2>Log in</h2>
          {message && <p className="notice">{message}</p>}
          <LoginForm onLogin={onLogin} />
          <p className="auth-switch">
            Don't have an account? <Link to="/register">Create one</Link>
          </p>
        </div>

        <aside className="auth-aside">
          <IncomeSplitter income={income} onIncomeChange={setIncome} />
          {/* Link 也可以带 state，注册页会读出这个收入 */}
          <Link className="button-link" to="/register" state={{ income }}>
            Start with this split
          </Link>
        </aside>
      </div>
    </div>
  )
}

export default LoginPage
