"use client"

import { useState, useEffect } from "react"
import bookCatalog from "../data/books"

export default function BookCatalog() {
  const [books, setBooks] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterGenre, setFilterGenre] = useState("all")
  const [sortBy, setSortBy] = useState("title")
  const [sortOrder, setSortOrder] = useState("asc")
  const [viewMode, setViewMode] = useState("grid")

  // Load books from catalog and check availability from localStorage
  useEffect(() => {
    // Get currently rented books
    const currentRentals = JSON.parse(localStorage.getItem("currentRentals") || "[]")
    const rentedBookIds = currentRentals.map((rental) => rental.id)

    // Update availability based on current rentals
    const updatedCatalog = bookCatalog.map((book) => ({
      ...book,
      available: !rentedBookIds.includes(book.id),
    }))

    setBooks(updatedCatalog)
  }, [])

  // Get unique genres from books for filter dropdown
  const uniqueGenres = ["all", ...new Set(books.map((book) => book.genre))]

  // Handle renting a book
  const handleRentBook = (book) => {
    // Check if the book is available
    if (!book.available) {
      alert("此書已被借出。")
      return
    }

    // Get current date and calculate due date (14 days from now)
    const currentDate = new Date()
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 14)

    // Create rental object
    const rental = {
      id: book.id,
      bookTitle: book.title,
      author: book.author,
      coverImage: book.coverImage,
      rentDate: currentDate.toISOString().split("T")[0],
      dueDate: dueDate.toISOString().split("T")[0],
      renewals: 0,
    }

    // Add to current rentals in localStorage
    const currentRentals = JSON.parse(localStorage.getItem("currentRentals") || "[]")
    localStorage.setItem("currentRentals", JSON.stringify([...currentRentals, rental]))

    // Update book availability
    const updatedBooks = books.map((b) => (b.id === book.id ? { ...b, available: false } : b))
    setBooks(updatedBooks)

    alert(`您已成功借閱「${book.title}」。歸還日期為 ${dueDate.toLocaleDateString()}。`)
  }

  // Handle adding a book to wishlist
  const handleAddToWishlist = (book) => {
    // Create wishlist item
    const wishlistItem = {
      id: Date.now(),
      title: book.title,
      author: book.author,
      genre: book.genre,
      dateAdded: new Date().toISOString(),
      priority: "medium",
      notes: "",
    }

    // Add to wishlist in localStorage
    const wishlist = JSON.parse(localStorage.getItem("bookWishlist") || "[]")

    // Check if book is already in wishlist
    if (wishlist.some((item) => item.title === book.title)) {
      alert(`「${book.title}」已在您的願望清單中。`)
      return
    }

    localStorage.setItem("bookWishlist", JSON.stringify([...wishlist, wishlistItem]))
    alert(`「${book.title}」已添加到您的願望清單。`)
  }

  // Filter and sort books
  const filteredAndSortedBooks = [...books]
    .filter((book) => {
      // Apply search filter
      const matchesSearch =
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.description.toLowerCase().includes(searchTerm.toLowerCase())

      // Apply genre filter
      const matchesGenre = filterGenre === "all" || book.genre === filterGenre

      return matchesSearch && matchesGenre
    })
    .sort((a, b) => {
      // Apply sorting
      let comparison = 0
      if (sortBy === "title") {
        comparison = a.title.localeCompare(b.title)
      } else if (sortBy === "author") {
        comparison = a.author.localeCompare(b.author)
      } else if (sortBy === "publishYear") {
        comparison = a.publishYear - b.publishYear
      }

      return sortOrder === "asc" ? comparison : -comparison
    })

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.heading}>圖書目錄</h2>
        <div style={styles.headerActions}>
          <div style={styles.searchContainer}>
            <div style={styles.searchInputWrapper}>
              <input
                type="text"
                placeholder="搜尋書籍..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
              {searchTerm.length > 0 && (
                <button onClick={() => setSearchTerm("")} style={styles.clearSearchButton} aria-label="清除搜尋">
                  ✕
                </button>
              )}
            </div>

            {searchTerm.length > 0 && (
              <div style={styles.suggestionsContainer}>
                {books
                  .filter(
                    (book) =>
                      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      book.genre.toLowerCase().includes(searchTerm.toLowerCase()),
                  )
                  .slice(0, 5)
                  .map((book) => (
                    <div
                      key={book.id}
                      style={styles.suggestionItem}
                      onClick={() => {
                        setSearchTerm(book.title)
                        // Optionally scroll to the book
                        document.getElementById(`book-${book.id}`)?.scrollIntoView({ behavior: "smooth" })
                      }}
                    >
                      <div style={styles.suggestionImageContainer}>
                        <img src={book.coverImage || "/placeholder.svg"} alt="" style={styles.suggestionImage} />
                      </div>
                      <div style={styles.suggestionContent}>
                        <div style={styles.suggestionTitle}>{book.title}</div>
                        <div style={styles.suggestionAuthor}>作者: {book.author}</div>
                        <div style={styles.suggestionGenre}>{book.genre}</div>
                      </div>
                      <div style={styles.suggestionStatus}>
                        <span
                          style={{
                            ...styles.statusBadge,
                            ...(book.available ? styles.availableBadge : styles.unavailableBadge),
                            ...styles.smallBadge,
                          }}
                        >
                          {book.available ? "可借閱" : "已借出"}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={styles.filterBar}>
        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>類型:</label>
          <select value={filterGenre} onChange={(e) => setFilterGenre(e.target.value)} style={styles.filterSelect}>
            {uniqueGenres.map((genre) => (
              <option key={genre} value={genre}>
                {genre === "all" ? "所有類型" : genre}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>排序方式:</label>
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [newSortBy, newSortOrder] = e.target.value.split("-")
              setSortBy(newSortBy)
              setSortOrder(newSortOrder)
            }}
            style={styles.filterSelect}
          >
            <option value="title-asc">書名 (A-Z)</option>
            <option value="title-desc">書名 (Z-A)</option>
            <option value="author-asc">作者 (A-Z)</option>
            <option value="author-desc">作者 (Z-A)</option>
            <option value="publishYear-desc">出版年份 (新到舊)</option>
            <option value="publishYear-asc">出版年份 (舊到新)</option>
          </select>
        </div>

        <div style={styles.viewToggle}>
          <button
            onClick={() => setViewMode("grid")}
            style={{
              ...styles.viewButton,
              ...(viewMode === "grid" ? styles.activeViewButton : {}),
            }}
          >
            網格
          </button>
          <button
            onClick={() => setViewMode("list")}
            style={{
              ...styles.viewButton,
              ...(viewMode === "list" ? styles.activeViewButton : {}),
            }}
          >
            列表
          </button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div style={styles.bookGrid}>
          {filteredAndSortedBooks.map((book) => (
            <div key={book.id} id={`book-${book.id}`} style={styles.bookCard}>
              <div style={styles.bookCoverContainer}>
                <img src={book.coverImage || "/placeholder.svg"} alt={book.title} style={styles.bookCoverImage} />
                <div style={styles.statusBadgeContainer}>
                  <span
                    style={{
                      ...styles.statusBadge,
                      ...(book.available ? styles.availableBadge : styles.unavailableBadge),
                    }}
                  >
                    {book.available ? "可借閱" : "已借出"}
                  </span>
                </div>
              </div>

              <div style={styles.bookInfo}>
                <h3 style={styles.bookTitle}>{book.title}</h3>
                <p style={styles.bookAuthor}>作者: {book.author}</p>
                <p style={styles.bookGenre}>{book.genre}</p>
                <p style={styles.bookYear}>出版年份: {book.publishYear}</p>
                <p style={styles.bookDescription}>{book.description}</p>

                <div style={styles.bookActions}>
                  <button
                    onClick={() => handleRentBook(book)}
                    style={{
                      ...styles.actionButton,
                      ...styles.rentButton,
                      ...(book.available ? {} : styles.disabledButton),
                    }}
                    disabled={!book.available}
                  >
                    {book.available ? "借閱" : "已借出"}
                  </button>
                  <button
                    onClick={() => handleAddToWishlist(book)}
                    style={{ ...styles.actionButton, ...styles.wishlistButton }}
                  >
                    加入願望清單
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.bookList}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>封面</th>
                <th style={styles.tableHeader}>書名</th>
                <th style={styles.tableHeader}>作者</th>
                <th style={styles.tableHeader}>類型</th>
                <th style={styles.tableHeader}>年份</th>
                <th style={styles.tableHeader}>狀態</th>
                <th style={styles.tableHeader}>操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedBooks.map((book) => (
                <tr key={book.id} style={styles.tableRow}>
                  <td style={styles.tableCell}>
                    <img src={book.coverImage || "/placeholder.svg"} alt={book.title} style={styles.tableCoverImage} />
                  </td>
                  <td style={styles.tableCell}>{book.title}</td>
                  <td style={styles.tableCell}>{book.author}</td>
                  <td style={styles.tableCell}>{book.genre}</td>
                  <td style={styles.tableCell}>{book.publishYear}</td>
                  <td style={styles.tableCell}>
                    <span
                      style={{
                        ...styles.statusBadge,
                        ...(book.available ? styles.availableBadge : styles.unavailableBadge),
                      }}
                    >
                      {book.available ? "可借閱" : "已借出"}
                    </span>
                  </td>
                  <td style={styles.tableCell}>
                    <div style={styles.tableActions}>
                      <button
                        onClick={() => handleRentBook(book)}
                        style={{
                          ...styles.smallButton,
                          ...(book.available ? styles.rentButton : styles.disabledButton),
                        }}
                        disabled={!book.available}
                        title={book.available ? "借閱" : "已借出"}
                      >
                        📚
                      </button>
                      <button
                        onClick={() => handleAddToWishlist(book)}
                        style={{ ...styles.smallButton, ...styles.wishlistButton }}
                        title="加入願望清單"
                      >
                        ❤️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    padding: "20px",
    maxWidth: "800px",
    margin: "20px auto",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: "20px",
    borderBottom: "1px solid #eee",
    paddingBottom: "10px",
    gap: "10px",
  },
  heading: {
    margin: 0,
    color: "#333",
  },
  headerActions: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  searchContainer: {
    maxWidth: "250px",
    position: "relative",
  },
  searchInput: {
    padding: "8px 12px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
    width: "100%",
  },
  filterBar: {
    display: "flex",
    flexWrap: "wrap",
    gap: "15px",
    marginBottom: "20px",
    padding: "10px",
    backgroundColor: "#f5f5f5",
    borderRadius: "8px",
    alignItems: "center",
  },
  filterGroup: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  filterLabel: {
    fontSize: "14px",
    fontWeight: "bold",
  },
  filterSelect: {
    padding: "6px 10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
  },
  viewToggle: {
    display: "flex",
    marginLeft: "auto",
  },
  viewButton: {
    padding: "6px 12px",
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    cursor: "pointer",
    fontSize: "14px",
  },
  activeViewButton: {
    backgroundColor: "#e0e0e0",
    fontWeight: "bold",
  },
  bookGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
  },
  bookCard: {
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  bookCoverContainer: {
    height: "300px",
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
  },
  bookCoverImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  statusBadgeContainer: {
    position: "absolute",
    top: "10px",
    right: "10px",
  },
  statusBadge: {
    padding: "3px 8px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  availableBadge: {
    backgroundColor: "#4caf50",
    color: "white",
  },
  unavailableBadge: {
    backgroundColor: "#f44336",
    color: "white",
  },
  bookInfo: {
    padding: "15px",
    display: "flex",
    flexDirection: "column",
    flex: "1",
  },
  bookTitle: {
    margin: "0 0 5px 0",
    fontSize: "18px",
    fontWeight: "bold",
  },
  bookAuthor: {
    margin: "0 0 5px 0",
    color: "#666",
    fontStyle: "italic",
    fontSize: "14px",
  },
  bookGenre: {
    margin: "0 0 5px 0",
    color: "#666",
    fontSize: "14px",
    backgroundColor: "#f5f5f5",
    padding: "3px 8px",
    borderRadius: "4px",
    display: "inline-block",
  },
  bookYear: {
    margin: "0 0 10px 0",
    fontSize: "14px",
    color: "#666",
  },
  bookDescription: {
    margin: "0 0 15px 0",
    fontSize: "14px",
    color: "#333",
    lineHeight: "1.4",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
  },
  bookActions: {
    display: "flex",
    gap: "10px",
    marginTop: "auto",
  },
  actionButton: {
    padding: "8px 12px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    flex: "1",
    textAlign: "center",
  },
  rentButton: {
    backgroundColor: "#2196f3",
    color: "white",
  },
  wishlistButton: {
    backgroundColor: "#ff9800",
    color: "white",
  },
  disabledButton: {
    backgroundColor: "#ccc",
    cursor: "not-allowed",
  },
  bookList: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
  },
  tableHeader: {
    backgroundColor: "#f5f5f5",
    padding: "10px",
    textAlign: "left",
    borderBottom: "2px solid #ddd",
  },
  tableRow: {
    borderBottom: "1px solid #eee",
  },
  tableCell: {
    padding: "12px 10px",
    verticalAlign: "middle",
  },
  tableCoverImage: {
    width: "40px",
    height: "60px",
    objectFit: "cover",
    borderRadius: "4px",
  },
  tableActions: {
    display: "flex",
    gap: "5px",
  },
  smallButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    padding: "5px",
  },
  searchInputWrapper: {
    position: "relative",
    width: "100%",
  },
  clearSearchButton: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    color: "#999",
  },
  suggestionsContainer: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "4px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    zIndex: 10,
    maxHeight: "300px",
    overflowY: "auto",
    marginTop: "5px",
  },
  suggestionItem: {
    padding: "10px",
    borderBottom: "1px solid #eee",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    transition: "background-color 0.2s",
  },
  suggestionImageContainer: {
    width: "40px",
    height: "60px",
    flexShrink: 0,
  },
  suggestionImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "4px",
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionTitle: {
    fontWeight: "bold",
    fontSize: "14px",
    marginBottom: "2px",
  },
  suggestionAuthor: {
    fontSize: "12px",
    color: "#666",
    marginBottom: "2px",
  },
  suggestionGenre: {
    fontSize: "12px",
    color: "#666",
  },
  suggestionStatus: {
    flexShrink: 0,
  },
  smallBadge: {
    fontSize: "10px",
    padding: "2px 6px",
  },
}
