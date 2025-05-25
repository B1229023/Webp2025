import React, { useEffect, useState } from 'react';
import { getBooksFromStorage, saveBooksToStorage } from '../utils/bookStorage';

function AdminDashboard() {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    genre: '',
    publishdate: '',
    publisher: '',
    description: '',
    coverImage: '',
    available: true,
    isbn: '',
    call_number: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    setBooks(getBooksFromStorage());
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewBook((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddBook = () => {
    const id = Date.now();
    const updatedBooks = [...books, { id, ...newBook }];
    saveBooksToStorage(updatedBooks);
    setBooks(updatedBooks);
    resetForm();
  };

  const handleDeleteBook = (id) => {
    const updatedBooks = books.filter((book) => book.id !== id);
    saveBooksToStorage(updatedBooks);
    setBooks(updatedBooks);
  };

  const handleEditBook = (book) => {
    setNewBook(book);
    setIsEditing(true);
    setEditId(book.id);
  };

  const handleUpdateBook = () => {
    const updatedBooks = books.map((book) =>
      book.id === editId ? { ...newBook, id: editId } : book
    );
    saveBooksToStorage(updatedBooks);
    setBooks(updatedBooks);
    setIsEditing(false);
    setEditId(null);
    resetForm();
  };

  const resetForm = () => {
    setNewBook({
      title: '',
      author: '',
      genre: '',
      publishdate: '',
      publisher: '',
      description: '',
      coverImage: '',
      available: true,
      isbn: '',
      call_number: '',
    });
  };

  return (
    <div style={{ padding: '50px', maxWidth: '800px', margin: 'auto' }}>
      <h2>📚 管理書籍</h2>

      <h3>{isEditing ? '✏️ 編輯書籍' : '➕ 新增書籍'}</h3>
      <input name="title" placeholder="書名" value={newBook.title} onChange={handleInputChange} />
      <input name="author" placeholder="作者" value={newBook.author} onChange={handleInputChange} />
      <input name="genre" placeholder="分類/類別" value={newBook.genre} onChange={handleInputChange} />
      <input name="publishdate" placeholder="出版日期" value={newBook.publishdate} onChange={handleInputChange} />
      <input name="publisher" placeholder="出版社" value={newBook.publisher} onChange={handleInputChange} />
      <textarea name="description" placeholder="簡介" value={newBook.description} onChange={handleInputChange} />
      <input name="coverImage" placeholder="圖片網址" value={newBook.coverImage} onChange={handleInputChange} />
      <input name="isbn" placeholder="ISBN" value={newBook.isbn} onChange={handleInputChange} />
      <input name="call_number" placeholder="索書號" value={newBook.call_number} onChange={handleInputChange} />
      <br />

      {isEditing ? (
        <button onClick={handleUpdateBook}>更新</button>
      ) : (
        <button onClick={handleAddBook}>新增</button>
      )}

      <hr />
      <h3>📖 所有書籍</h3>
      <ul>
        {books.map((book) => (
          <li key={book.id} style={{ marginBottom: '20px' }}>
            <strong>{book.title}</strong> - {book.author} -{' '}
          
            <div>
              {book.coverImage && (
                <img
                  src={book.coverImage}
                  alt={book.title}
                  style={{ width: '100px', marginTop: '5px' }}
                />
              )}
            </div>
            <div style={{ marginTop: '5px' }}>
              <button onClick={() => handleEditBook(book)}>編輯</button>
              <button onClick={() => handleDeleteBook(book.id)} style={{ marginLeft: '5px' }}>
                刪除
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminDashboard;
