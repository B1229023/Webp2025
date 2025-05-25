import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
//import dummyBooks from '../data/books';
import BookCard from '../components/BookCard';
import { getBooksFromStorage } from '../utils/bookStorage';

function BookList() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('請先登入');
      navigate('/');
    }

    // 載入書籍資料
    //setBooks(dummyBooks);
    const storedBooks = getBooksFromStorage();
    setBooks(storedBooks);
  }, [navigate]);
     
  //搜尋
    const filteredBooks = books.filter(
        (book) =>
            book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(searchTerm.toLowerCase())
        );

    return (
        <div style={{ maxWidth: '800px', margin: 'auto', paddingTop: '50px' }}>
            <h2>📚 書籍清單</h2>
            <input
                type="text"
                placeholder="搜尋書名或作者"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '8px', marginBottom: '20px' }}
            />
            
            {filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} />
            ))}
        </div>
    );
}

export default BookList;
