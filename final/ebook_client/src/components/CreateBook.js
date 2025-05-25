import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateBook() {
  const navigate = useNavigate();
  const [book, setBook] = useState({
    title: '',
    author: '',
    publisher: '',
    isbn: '',
    intro: '',
    image: '',
  });

  const handleChange = (e) => {
    setBook({
      ...book,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 取得現有書籍資料（模擬後端）
    const existingBooks = JSON.parse(localStorage.getItem('books')) || [];

    // 設定新的 ID 並新增
    const newBook = {
      ...book,
      id: existingBooks.length > 0 ? existingBooks[existingBooks.length - 1].id + 1 : 1,
    };

    const updatedBooks = [...existingBooks, newBook];
    localStorage.setItem('books', JSON.stringify(updatedBooks));

    alert('書籍新增成功！');
    navigate('/admin');
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', paddingTop: '50px' }}>
      <h2>📘 新增書籍</h2>
      <form onSubmit={handleSubmit}>
        <label>書名：</label>
        <input name="title" value={book.title} onChange={handleChange} required /><br />

        <label>作者：</label>
        <input name="author" value={book.author} onChange={handleChange} required /><br />

        <label>出版社：</label>
        <input name="publisher" value={book.publisher} onChange={handleChange} /><br />

        <label>ISBN：</label>
        <input name="isbn" value={book.isbn} onChange={handleChange} /><br />

        <label>簡介：</label>
        <textarea name="intro" value={book.intro} onChange={handleChange} /><br />

        <label>圖片網址：</label>
        <input name="image" value={book.image} onChange={handleChange} /><br /><br />

        <button type="submit">✅ 新增書籍</button>
      </form>
    </div>
  );
}

export default CreateBook;
