"use client"

import { useState, useEffect } from "react"
import "../styles/UserProfile.css"
import dummyBooks from "../data/books.js"

function UserProfile() {
  const [userData, setUserData] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState(null)
  const [activeTab, setActiveTab] = useState("profile")
  const [filteredGenre, setFilteredGenre] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  // State for wishlist and borrowed books
  const [wishlist, setWishlist] = useState([])
  const [borrowedBooks, setBorrowedBooks] = useState([])

  // Get the count of currently borrowed books (not returned)
  const activeBorrowedCount = borrowedBooks.filter((book) => book.status !== "已歸還").length

  useEffect(() => {
    // Load user data
    const storedData = localStorage.getItem("userProfileData")
    if (storedData) {
      const parsedData = JSON.parse(storedData)
      setUserData(parsedData)
      setEditedData(parsedData)
    }

    // Load wishlist
    const storedWishlist = localStorage.getItem("wishlist")
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist))
    }

    // Load borrowed books
    const storedBorrowedBooks = localStorage.getItem("borrowedBooks")
    if (storedBorrowedBooks) {
      setBorrowedBooks(JSON.parse(storedBorrowedBooks))
    }
  }, [])

  const handleEditToggle = () => {
    setIsEditing(!isEditing)
    if (!isEditing) {
      setEditedData({ ...userData })
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    if (type === "checkbox") {
      setEditedData({
        ...editedData,
        interests: {
          ...editedData.interests,
          [name]: checked,
        },
      })
    } else {
      setEditedData({
        ...editedData,
        [name]: value,
      })
    }
  }

  const handleSave = () => {
    // Update user data
    setUserData(editedData)
    // Save to localStorage
    localStorage.setItem("userProfileData", JSON.stringify(editedData))
    // Exit edit mode
    setIsEditing(false)
  }

  const addToWishlist = (book) => {
    if (!wishlist.some((item) => item.id === book.id)) {
      const updatedWishlist = [...wishlist, book]
      setWishlist(updatedWishlist)
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist))
    }
  }

  const removeFromWishlist = (bookId) => {
    const updatedWishlist = wishlist.filter((book) => book.id !== bookId)
    setWishlist(updatedWishlist)
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist))
  }

  // Check if a book is already borrowed by the user
  const isBookBorrowed = (bookId) => {
    return borrowedBooks.some((book) => book.id === bookId && book.status !== "已歸還")
  }

  // Check if a book is available to borrow
  const isBookAvailable = (book) => {
    return book.available && !isBookBorrowed(book.id) && activeBorrowedCount < 3
  }

  const borrowBook = (book) => {
    // Check if user has already borrowed 3 books
    if (activeBorrowedCount >= 3) {
      alert("您已借閱3本書，請先歸還部分書籍後再借閱新書。")
      return
    }

    // Check if user has already borrowed this book
    if (isBookBorrowed(book.id)) {
      alert("您已借閱此書，不能重複借閱。")
      return
    }

    if (book.available) {
      // Create a borrowed book entry with due date (5 days from now)
      const dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + 5)

      const borrowedBook = {
        ...book,
        borrowDate: new Date().toISOString().split("T")[0],
        dueDate: dueDate.toISOString().split("T")[0],
        status: "借閱中",
      }

      const updatedBorrowedBooks = [...borrowedBooks, borrowedBook]
      setBorrowedBooks(updatedBorrowedBooks)
      localStorage.setItem("borrowedBooks", JSON.stringify(updatedBorrowedBooks))

      // Update book availability in catalog
      const updatedCatalog = dummyBooks.map((item) => (item.id === book.id ? { ...item, available: false } : item))
      // In a real app, you would update this in a database
    }
  }

  const extendBorrowPeriod = (bookId) => {
    const updatedBorrowedBooks = borrowedBooks.map((book) => {
      if (book.id === bookId) {
        const newDueDate = new Date(book.dueDate)
        newDueDate.setDate(newDueDate.getDate() + 5)
        return {
          ...book,
          dueDate: newDueDate.toISOString().split("T")[0],
        }
      }
      return book
    })

    setBorrowedBooks(updatedBorrowedBooks)
    localStorage.setItem("borrowedBooks", JSON.stringify(updatedBorrowedBooks))
  }

  const returnBook = (bookId) => {
    // Update borrowed books list
    const updatedBorrowedBooks = borrowedBooks.map((book) =>
      book.id === bookId ? { ...book, status: "已歸還", returnDate: new Date().toISOString().split("T")[0] } : book,
    )

    setBorrowedBooks(updatedBorrowedBooks)
    localStorage.setItem("borrowedBooks", JSON.stringify(updatedBorrowedBooks))

    // In a real app, you would update book availability in the database
  }

  const getFilteredBooks = () => {
    let filtered = dummyBooks

    // Filter by genre if selected
    if (filteredGenre) {
      filtered = filtered.filter((book) => book.genre === filteredGenre)
    }

    // Filter by search query if present
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.description.toLowerCase().includes(query),
      )
    }

    return filtered
  }

  if (!userData) {
    return <div className="loading">載入中...</div>
  }

  return (
    <div className="user-profile-container">
      <div className="profile-header">
        <h1>圖書租借系統</h1>
        <div className="profile-tabs">
          <button className={activeTab === "profile" ? "active" : ""} onClick={() => setActiveTab("profile")}>
            個人資料
          </button>
          <button className={activeTab === "wishlist" ? "active" : ""} onClick={() => setActiveTab("wishlist")}>
            願望清單
          </button>
          <button className={activeTab === "borrowed" ? "active" : ""} onClick={() => setActiveTab("borrowed")}>
            借閱歷史
          </button>
          <button className={activeTab === "reminders" ? "active" : ""} onClick={() => setActiveTab("reminders")}>
            到期提醒
          </button>
          <button className={activeTab === "catalog" ? "active" : ""} onClick={() => setActiveTab("catalog")}>
            圖書目錄
          </button>
        </div>
      </div>

      <div className="profile-content">
        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="profile-section">
            <div className="section-header">
              <h2>個人資料</h2>
              <button className={isEditing ? "cancel-button" : "edit-button"} onClick={handleEditToggle}>
                {isEditing ? "取消" : "編輯資料"}
              </button>
              {isEditing && (
                <button className="save-button" onClick={handleSave}>
                  保存更改
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="edit-form">
                <div className="form-group">
                  <label htmlFor="fullName">姓名:</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={editedData.fullName}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">電子郵件:</label>
                  <input type="email" id="email" name="email" value={editedData.email} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">電話:</label>
                  <div className="phone-input">
                    <span className="phone-prefix">+886</span>
                    <input type="tel" id="phone" name="phone" value={editedData.phone} onChange={handleChange} />
                  </div>
                </div>



                <div className="form-group">
                  <label>閱讀偏好:</label>
                  <div className="checkbox-group">
                    {Object.keys(userData.interests).map((interest) => (
                      <div className="checkbox-item" key={interest}>
                        <input
                          type="checkbox"
                          id={`edit-${interest}`}
                          name={interest}
                          checked={editedData.interests[interest]}
                          onChange={handleChange}
                        />
                        <label htmlFor={`edit-${interest}`}>{getInterestLabel(interest)}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="profile-details">
                <div className="detail-item">
                  <span className="detail-label">姓名:</span>
                  <span className="detail-value">{userData.fullName}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">用戶名稱:</span>
                  <span className="detail-value">{userData.username}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">電子郵件:</span>
                  <span className="detail-value">{userData.email}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">電話:</span>
                  <span className="detail-value">+886 {userData.phone}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">出生日期:</span>
                  <span className="detail-value">{userData.birthdate || "未提供"}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">性別:</span>
                  <span className="detail-value">
                    {userData.gender === "male" ? "男" : userData.gender === "female" ? "女" : "未提供"}
                  </span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">閱讀偏好:</span>
                  <div className="interests-list">
                    {Object.keys(userData.interests)
                      .filter((key) => userData.interests[key])
                      .map((interest) => (
                        <span key={interest} className="interest-tag">
                          {getInterestLabel(interest)}
                        </span>
                      ))}
                    {!Object.values(userData.interests).some((v) => v) && (
                      <span className="no-interests">未選擇任何閱讀偏好</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Borrowing Status */}
            <div className="borrowing-status">
              <h3>借閱狀態</h3>
              <div className="status-info">
                <p>
                  目前已借閱: <span className="borrowed-count">{activeBorrowedCount}</span> / 3 本
                </p>
                <div className="progress-bar">
                  <div className="progress" style={{ width: `${(activeBorrowedCount / 3) * 100}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Wishlist Tab */}
        {activeTab === "wishlist" && (
          <div className="wishlist-section">
            <h2>願望清單</h2>

            <div className="book-catalog">
              <h3>可添加到願望清單的書籍</h3>
              <div className="book-list">
                {dummyBooks.map((book) => (
                  <div key={book.id} className="book-item">
                    <div className="book-cover">
                      <img
                        src={book.coverImage || "/placeholder.svg"}
                        alt={`Cover of ${book.title}`}
                        className="cover-image"
                      />
                    </div>
                    <div className="book-info">
                      <h4>{book.title}</h4>
                      <p>作者: {book.author}</p>
                      <p>類型: {book.genre}</p>
                      <p className={isBookAvailable(book) ? "available" : "unavailable"}>
                        {isBookBorrowed(book.id) ? (
                          <span className="already-borrowed">您已借閱此書</span>
                        ) : book.available ? (
                          activeBorrowedCount >= 3 ? (
                            "您已達借閱上限"
                          ) : (
                            "可借閱"
                          )
                        ) : (
                          "已借出"
                        )}
                      </p>
                    </div>
                    <div className="book-actions">
                      <button
                        onClick={() => addToWishlist(book)}
                        disabled={wishlist.some((item) => item.id === book.id)}
                        className="wishlist-button"
                      >
                        {wishlist.some((item) => item.id === book.id) ? "已加入願望清單" : "加入願望清單"}
                      </button>
                      {isBookAvailable(book) && (
                        <button onClick={() => borrowBook(book)} className="borrow-button">
                          借閱
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="my-wishlist">
              <h3>我的願望清單</h3>
              {wishlist.length > 0 ? (
                <div className="wishlist-items">
                  {wishlist.map((book) => (
                    <div key={book.id} className="wishlist-item">
                      <div className="book-cover">
                        <img
                          src={book.coverImage || "/placeholder.svg"}
                          alt={`Cover of ${book.title}`}
                          className="cover-image"
                        />
                      </div>
                      <div className="book-info">
                        <h4>{book.title}</h4>
                        <p className="book-author">作者: {book.author}</p>
                        <p className="book-genre">類型: {book.genre}</p>
                        <p className="book-year">出版年份: {book.publishYear}</p>
                        <p className={isBookAvailable(book) ? "available" : "unavailable"}>
                          {isBookBorrowed(book.id) ? (
                            <span className="already-borrowed">您已借閱此書</span>
                          ) : book.available ? (
                            activeBorrowedCount >= 3 ? (
                              "您已達借閱上限"
                            ) : (
                              "可借閱"
                            )
                          ) : (
                            "已借出"
                          )}
                        </p>
                      </div>
                      <div className="book-actions">
                        <button onClick={() => removeFromWishlist(book.id)} className="remove-button">
                          移除
                        </button>
                        {isBookAvailable(book) && (
                          <button onClick={() => borrowBook(book)} className="borrow-button">
                            借閱
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-message">您的願望清單是空的</p>
              )}
            </div>
          </div>
        )}

        {/* Borrowed Books Tab */}
        {activeTab === "borrowed" && (
          <div className="borrowed-section">
            <h2>借閱歷史</h2>
            <div className="borrowing-status">
              <p>
                目前已借閱: <span className="borrowed-count">{activeBorrowedCount}</span> / 3 本
              </p>
              <div className="progress-bar">
                <div className="progress" style={{ width: `${(activeBorrowedCount / 3) * 100}%` }}></div>
              </div>
            </div>

            {borrowedBooks.length > 0 ? (
              <div className="borrowed-list">
                <table className="borrowed-table">
                  <thead>
                    <tr>
                      <th>書名</th>
                      <th>作者</th>
                      <th>類型</th>
                      <th>借閱日期</th>
                      <th>到期日期</th>
                      <th>狀態</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {borrowedBooks.map((book) => (
                      <tr key={book.id} className={book.status === "已歸還" ? "returned" : ""}>
                        <td>{book.title}</td>
                        <td>{book.author}</td>
                        <td>{book.genre}</td>
                        <td>{book.borrowDate}</td>
                        <td>{book.status === "已歸還" ? book.returnDate : book.dueDate}</td>
                        <td className={`status ${book.status === "已歸還" ? "returned-status" : "borrowed-status"}`}>
                          {book.status}
                        </td>
                        <td>
                          {book.status !== "已歸還" && (
                            <div className="action-buttons">
                              <button onClick={() => extendBorrowPeriod(book.id)} className="extend-button">
                                延長
                              </button>
                              <button onClick={() => returnBook(book.id)} className="return-button">
                                歸還
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="empty-message">您沒有借閱記錄</p>
            )}
          </div>
        )}

        {/* Reminders Tab */}
        {activeTab === "reminders" && (
          <div className="reminders-section">
            <h2>到期提醒</h2>

            {borrowedBooks.filter((book) => book.status !== "已歸還").length > 0 ? (
              <div className="reminders-list">
                {borrowedBooks
                  .filter((book) => book.status !== "已歸還")
                  .map((book) => {
                    const dueDate = new Date(book.dueDate)
                    const today = new Date()
                    const daysLeft = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24))

                    let reminderClass = "normal-reminder"
                    if (daysLeft <= 1) {
                      reminderClass = "urgent-reminder"
                    } else if (daysLeft <= 3) {
                      reminderClass = "warning-reminder"
                    }

                    return (
                      <div key={book.id} className={`reminder-item ${reminderClass}`}>
                        <div className="reminder-info">
                          <h4>{book.title}</h4>
                          <p>作者: {book.author}</p>
                          <p>借閱日期: {book.borrowDate}</p>
                          <p>到期日期: {book.dueDate}</p>
                          <p className="days-left">
                            {daysLeft <= 0 ? "已逾期！請盡快歸還" : `還有 ${daysLeft} 天到期`}
                          </p>
                        </div>
                        <div className="reminder-actions">
                          <button onClick={() => extendBorrowPeriod(book.id)} className="extend-button">
                            延長借閱
                          </button>
                          <button onClick={() => returnBook(book.id)} className="return-button">
                            歸還
                          </button>
                        </div>
                      </div>
                    )
                  })}
              </div>
            ) : (
              <p className="empty-message">您沒有即將到期的書籍</p>
            )}
          </div>
        )}

        {/* Book Catalog Tab */}
        {activeTab === "catalog" && (
          <div className="catalog-section">
            <h2>圖書目錄</h2>
            <div className="borrowing-status">
              <p>
                目前已借閱: <span className="borrowed-count">{activeBorrowedCount}</span> / 3 本
              </p>
              <div className="progress-bar">
                <div className="progress" style={{ width: `${(activeBorrowedCount / 3) * 100}%` }}></div>
              </div>
            </div>

            <div className="search-bar">
              <input
                type="text"
                placeholder="搜尋書名、作者或描述..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="genre-filter">
              <label>按類型篩選:</label>
              <select onChange={(e) => setFilteredGenre(e.target.value)}>
                <option value="">全部</option>
                <option value="經典文學">經典文學</option>
                <option value="反烏托邦小說">反烏托邦小說</option>
                <option value="浪漫小說">浪漫小說</option>
                <option value="奇幻文學">奇幻文學</option>
                <option value="成長小說">成長小說</option>
                <option value="小說">小說</option>
                <option value="懸疑驚悚">懸疑驚悚</option>
                <option value="歷史小說">歷史小說</option>
                <option value="青少年小說">青少年小說</option>
                <option value="犯罪驚悚">犯罪驚悚</option>
                <option value="後啟示錄小說">後啟示錄小說</option>
                <option value="心理驚悚">心理驚悚</option>
                <option value="科幻小說">科幻小說</option>
                <option value="恐怖小說">恐怖小說</option>
                <option value="冒險小說">冒險小說</option>
              </select>
            </div>

            <div className="book-list">
              {getFilteredBooks().map((book) => (
                <div key={book.id} className="book-item">
                  <div className="book-cover">
                    <img
                      src={book.coverImage || "/placeholder.svg"}
                      alt={`Cover of ${book.title}`}
                      className="cover-image"
                    />
                  </div>
                  <div className="book-info">
                    <h4>{book.title}</h4>
                    <p className="book-author">作者: {book.author}</p>
                    <p className="book-genre">類型: {book.genre}</p>
                    <p className="book-year">出版年份: {book.publishYear}</p>
                    <p className="book-isbn">ISBN: {book.isbn}</p>
                    <p className={isBookAvailable(book) ? "available" : "unavailable"}>
                      {isBookBorrowed(book.id) ? (
                        <span className="already-borrowed">您已借閱此書</span>
                      ) : book.available ? (
                        activeBorrowedCount >= 3 ? (
                          "您已達借閱上限"
                        ) : (
                          "可借閱"
                        )
                      ) : (
                        "已借出"
                      )}
                    </p>
                    <div className="book-description">
                      <p>{book.description}</p>
                    </div>
                  </div>
                  <div className="book-actions">
                    <button
                      onClick={() => addToWishlist(book)}
                      disabled={wishlist.some((item) => item.id === book.id)}
                      className="wishlist-button"
                    >
                      {wishlist.some((item) => item.id === book.id) ? "已加入願望清單" : "加入願望清單"}
                    </button>
                    {isBookAvailable(book) && (
                      <button onClick={() => borrowBook(book)} className="borrow-button">
                        借閱
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Helper function to translate interest keys to Chinese labels
function getInterestLabel(interest) {
  const labels = {
    fiction: "小說",
    history: "歷史",
    science: "科學",
    art: "藝術",
    music: "音樂",
    travel: "旅遊",
    cooking: "烹飪",
    technology: "科技",
    philosophy: "哲學",
    biography: "傳記",
  }

  return labels[interest] || interest
}

export default UserProfile
