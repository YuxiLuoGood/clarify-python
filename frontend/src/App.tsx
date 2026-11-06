import { useEffect, useState } from "react"
import { Navigate, NavLink, Route, Routes, useNavigate } from "react-router"
import BudgetsPage from "./pages/BudgetsPage"
import LoginPage from "./pages/LoginPage"
import OverviewPage from "./pages/OverviewPage"
import RegisterPage from "./pages/RegisterPage"
import SetupPage from "./pages/SetupPage"
import TransactionsPage from "./pages/TransactionsPage"

// App 现在只管两件事：是否登录，以及显示哪个页面。
// 每个页面的数据都由页面自己加载，切换页面时会重新加载最新数据。
function App() {
  const navigate = useNavigate()
  const [token, setToken] = useState(() => localStorage.getItem("token") ?? "")

  useEffect(() => {
    if (token === "") {
      localStorage.removeItem("token")
    } else {
      localStorage.setItem("token", token)
    }
  }, [token])

  function handleUnauthorized() {
    setToken("")
    navigate("/login", { state: { message: "Session expired. Please log in again." } })
  }

  function handleLogout() {
    setToken("")
  }

  // 没登录：只能看到登录页和注册页，其他网址都跳到登录页
  if (token === "") {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={setToken} />} />
        <Route path="/register" element={<RegisterPage onRegister={setToken} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  // <>...</> 叫 Fragment：把多个元素包在一起返回，但不会在页面上多出一层 div
  return (
    <>
      <nav className="topbar">
        <span className="brand">Clarify</span>
        <div className="nav-links">
          <NavLink to="/overview">Overview</NavLink>
          <NavLink to="/transactions">Transactions</NavLink>
          <NavLink to="/budgets">Budgets</NavLink>
        </div>
        <button className="button-secondary" onClick={handleLogout}>
          Log out
        </button>
      </nav>
      <main className="page">
        <Routes>
          <Route path="/overview" element={<OverviewPage token={token} onUnauthorized={handleUnauthorized} />} />
          <Route path="/transactions" element={<TransactionsPage token={token} onUnauthorized={handleUnauthorized} />} />
          <Route path="/budgets" element={<BudgetsPage token={token} onUnauthorized={handleUnauthorized} />} />
          {/* 引导页不放在导航栏里：注册后自动进入，或者从 Budgets 页的链接进入 */}
          <Route path="/setup" element={<SetupPage token={token} onUnauthorized={handleUnauthorized} />} />
          <Route path="*" element={<Navigate to="/overview" replace />} />
        </Routes>
      </main>
    </>
  )
}

export default App
