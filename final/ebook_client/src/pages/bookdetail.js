import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBooksFromStorage } from '../utils/bookStorage';

function BookDetail() {
  const { id } = useParams();
  const bookId = parseInt(id, 10);
  const [book, setBook] = useState(null);

  useEffect(() => {
    const books = getBooksFromStorage();
    const foundBook = books.find((b) => b.id === bookId);
    setBook(foundBook || null);
  }, [bookId]);

  if (!book) {
    return (
      <div style={{ padding: '50px' }}>
        <h2>找不到這本書 📕</h2>
        <Link to="/books">回書籍清單</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '50px' }}>
      <h2>{book.title}</h2>
      <p><strong>作者：</strong>{book.author}</p>
      <p><strong>出版社：</strong>{book.publisher}</p>
      <p><strong>ISBN：</strong>{book.isbn}</p>
      <p><strong>出版日期：</strong>{book.publishdate}</p>
      <p><strong>分類：</strong>{book.genre}</p>
      <p><strong>索書號：</strong>{book.call_number}</p>
      <p><strong>內容簡介：</strong>{book.description}</p>
      {book.coverImage && (
        <img src={book.coverImage} alt={book.title} style={{ width: '200px', marginTop: '10px' }} />
      )}

      <Link to="/books">← 回書籍清單</Link>
    </div>
  );
}

export default BookDetail;
