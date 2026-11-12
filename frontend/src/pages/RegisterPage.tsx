import { useState } from "react"
import { Link, useLocation } from "react-router"
import IncomeSplitter from "../components/IncomeSplitter"
import RegisterForm from "../components/RegisterForm"

type RegisterPageProps = {
  onRegister: (token: string) => void
}

function RegisterPage({ onRegister }: RegisterPageProps) {
  const location = useLocation()
  // 如果是从登录页点 "Start with this split" 过来的，沿用用户刚才输入的收入
  const incomeFromLogin = (location.state as { income?: string } | null)?.income
  const [income, setIncome] = useState(() => incomeFromLogin ?? "4000")

  return (
    <div className="auth">
      <div className="auth-layout">
        <div className="auth-panel">
          <h1>Clarify</h1>
          <p className="auth-tagline">See where your money goes, month by month.</p>
          <h2>Create an account</h2>
          <RegisterForm income={income} onRegister={onRegister} />
          <p className="auth-switch">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>

        <aside className="auth-aside">
          <IncomeSplitter income={income} onIncomeChange={setIncome} />
          <p className="aside-note">
            After you sign up, Clarify turns this split into budgets for your first month.
          </p>
        </aside>
      </div>
    </div>
  )
}

export default RegisterPage
