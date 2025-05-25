

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/Registration.css"

function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
  })
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError("密碼不匹配")
      return
    }

    if (formData.password.length < 6) {
      setError("密碼必須至少為6個字符")
      return
    }

    // Store basic account info
    localStorage.setItem(
      "accountData",
      JSON.stringify({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      }),
    )

    // Navigate to the personal information page
    navigate("/edit-profile")
  }

  return (
    <div className="registration-container">
      <h1>圖書租借系統</h1>
      <h2>註冊帳號</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="registration-form">
        <div className="form-group">
          <label htmlFor="username">用戶名稱 :</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            placeholder="請輸入用戶名稱"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">電子郵件 :</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="請輸入電子郵件"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">密碼 :</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="請輸入密碼"
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">確認密碼 :</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            placeholder="請再次輸入密碼"
          />
        </div>

        <button type="submit" className="submit-button">
          下一步：填寫個人資料
        </button>
      </form>

      <div className="login-link">
        已有帳號？ <a href="/login">登入</a>
      </div>
    </div>
  )
}

export default Register
