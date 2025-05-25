import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './pages/login'; //login檔案在pages資料夾中
import Register from './pages/Registration';
import BookList from './pages/booklist';
import BookDetail from './pages/bookdetail';
import EditProfile from './components/EditProfile';
import UserProfile from "./components/UserProfile";
import CreateBook from './components/CreateBook';
import AdminDashboard from './pages/AdminDashboard';
import { getBooksFromStorage, saveBooksToStorage } from './utils/bookStorage';
import dummyBooks from './data/books';
import RequireAdmin from './components/RequireAdmin';
if (!getBooksFromStorage().length) {
  saveBooksToStorage(dummyBooks);
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Route 指定「路徑 / 」時，要渲染 Login 元件，設定首頁為登入頁 */}
        <Route path="/login" element={<Login />} />{/*登入的路徑頁面*/}
        <Route path="/register" element={<Register />} /> {/*註冊的路徑頁面*/}
        <Route path="/books" element={<BookList />} />{/*書籍清單列表的路徑頁面*/}
        <Route path="/books/:id" element={<BookDetail />} /> {/*書籍詳細資料的路徑頁面*/}
        <Route path="/edit-profile" element={<EditProfile/>}/>
        <Route path="/user-profile" element={<UserProfile/>}/>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/create" element={<CreateBook />} />
       {/* <Route path="/admin/edit/:id" element={<EditBook />} />*/}
        
      </Routes>
    </Router>
  );
}

export default App;

       
       
       // <Route path="/books/:id" element={<BookDetail />} />