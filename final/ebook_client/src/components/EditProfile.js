"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/EditProfile.css"

function EditProfile() {
  const navigate = useNavigate()
  const [userData, setUserData] = useState({
    fullName: "",
    phone: "",
    birthdate: "",
    gender: "",
    road: "",
    district: "",
    city: "",
    interests: {
      fiction: false,
      history: false,
      science: false,
      art: false,
      music: false,
      travel: false,
      cooking: false,
      technology: false,
      philosophy: false,
      biography: false,
    },
  })

  useEffect(() => {
    // Check if user has completed the first step
    const accountData = localStorage.getItem("accountData")
    if (!accountData) {
      navigate("/register")
    }
  }, [navigate])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    if (type === "checkbox") {
      setUserData({
        ...userData,
        interests: {
          ...userData.interests,
          [name]: checked,
        },
      })
    } else {
      setUserData({
        ...userData,
        [name]: value,
      })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Get account data from first step
    const accountData = JSON.parse(localStorage.getItem("accountData"))

    // Combine account data with personal info
    const completeUserData = {
      ...accountData,
      ...userData,
    }

    // Store the complete user data
    localStorage.setItem("userProfileData", JSON.stringify(completeUserData))

     const users = JSON.parse(localStorage.getItem("users") || "[]");
       users.push({
        username: accountData.username,
        password: accountData.password,  // 這部分要從 accountData 中取得
        email: accountData.email,
        fullName: userData.fullName,
        phone: userData.phone,
        birthdate: userData.birthdate,
        gender: userData.gender,
        address: completeUserData.address,
        interests: userData.interests,
  });
  localStorage.setItem("users", JSON.stringify(users));

  // ✅ 清除暫存的 accountData
  localStorage.removeItem("accountData");

  // 儲存完整個人資料（可選，用於之後顯示）
  localStorage.setItem("userProfileData", JSON.stringify(completeUserData));

    // Navigate to the user profile page
    navigate("/user-profile")
  }

  return (
    <div className="edit-profile-container">
      <h1>圖書租借系統</h1>
      <h2>填寫個人資料</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>個人資料</h3>

          <div className="form-group">
            <label htmlFor="fullName">姓名 *</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={userData.fullName}
              onChange={handleChange}
              required
              placeholder="請輸入您的姓名"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">電話 *</label>
            <div className="phone-input">
              <span className="phone-prefix">+886</span>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={userData.phone}
                onChange={handleChange}
                required
                placeholder="請輸入電話號碼"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="birthdate">出生日期</label>
            <input type="date" id="birthdate" name="birthdate" value={userData.birthdate} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>性別</label>
            <div className="radio-group">
              <input
                type="radio"
                id="male"
                name="gender"
                value="male"
                checked={userData.gender === "male"}
                onChange={handleChange}
              />
              <label htmlFor="male">男</label>

              <input
                type="radio"
                id="female"
                name="gender"
                value="female"
                checked={userData.gender === "female"}
                onChange={handleChange}
              />
              <label htmlFor="female">女</label>
            </div>
          </div>
        </div>

        
        <div className="form-section">
          <h3>閱讀偏好</h3>

          <div className="checkbox-group">
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="fiction"
                name="fiction"
                checked={userData.interests.fiction}
                onChange={handleChange}
              />
              <label htmlFor="fiction">小說</label>
            </div>

            <div className="checkbox-item">
              <input
                type="checkbox"
                id="history"
                name="history"
                checked={userData.interests.history}
                onChange={handleChange}
              />
              <label htmlFor="history">歷史</label>
            </div>

            <div className="checkbox-item">
              <input
                type="checkbox"
                id="science"
                name="science"
                checked={userData.interests.science}
                onChange={handleChange}
              />
              <label htmlFor="science">科學</label>
            </div>

            <div className="checkbox-item">
              <input type="checkbox" id="art" name="art" checked={userData.interests.art} onChange={handleChange} />
              <label htmlFor="art">藝術</label>
            </div>

            <div className="checkbox-item">
              <input
                type="checkbox"
                id="music"
                name="music"
                checked={userData.interests.music}
                onChange={handleChange}
              />
              <label htmlFor="music">音樂</label>
            </div>

            <div className="checkbox-item">
              <input
                type="checkbox"
                id="travel"
                name="travel"
                checked={userData.interests.travel}
                onChange={handleChange}
              />
              <label htmlFor="travel">旅遊</label>
            </div>

            <div className="checkbox-item">
              <input
                type="checkbox"
                id="cooking"
                name="cooking"
                checked={userData.interests.cooking}
                onChange={handleChange}
              />
              <label htmlFor="cooking">烹飪</label>
            </div>

            <div className="checkbox-item">
              <input
                type="checkbox"
                id="technology"
                name="technology"
                checked={userData.interests.technology}
                onChange={handleChange}
              />
              <label htmlFor="technology">科技</label>
            </div>

            <div className="checkbox-item">
              <input
                type="checkbox"
                id="philosophy"
                name="philosophy"
                checked={userData.interests.philosophy}
                onChange={handleChange}
              />
              <label htmlFor="philosophy">哲學</label>
            </div>

            <div className="checkbox-item">
              <input
                type="checkbox"
                id="biography"
                name="biography"
                checked={userData.interests.biography}
                onChange={handleChange}
              />
              <label htmlFor="biography">傳記</label>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button">
            完成註冊
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditProfile
