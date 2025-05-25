// src/utils/bookStorage.js
//使用瀏覽器內建的localStorage，處理書籍資料的儲存與讀取

const BOOKS_KEY = 'bookData';

export function getBooksFromStorage() { //讀取資料 getBooksFromStorage()
  const data = localStorage.getItem(BOOKS_KEY); //把字串取出來
  return data ? JSON.parse(data) : []; //有資料就用 JSON.parse() 轉回陣列
}

export function saveBooksToStorage(books) { //儲存資料：saveBooksToStorage(books)
  localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
}
