import React from 'react';
import { Link } from 'react-router-dom';

function BookCard({ book }) {
  return (
    <div
      style={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '12px',
      }}
    >
      <h3>{book.title}</h3>
      <p><strong>作者：</strong>{book.author}</p>
      <p><strong>出版社：</strong>{book.publisher}</p>
      <p><strong>ISBN：</strong>{book.isbn}</p>
      {/*<p><strong>內容簡介：</strong>{book.description}</p>*/}
      <img
        src={book.coverImage}
        alt={book.title}
        style={{ width: '100px', height: '150px', objectFit: 'cover', marginBottom: '8px' }}
      />
      <Link to={`/books/${book.id}`}>查看詳細</Link>
    </div>
  );
}

export default BookCard;
