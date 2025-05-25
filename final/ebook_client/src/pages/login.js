import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';


function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const { username, password } = formData;

        // ✅ 硬寫管理員帳號
    if (username === 'admin' && password === '1234') {
      const adminUser = { username: 'admin', role: 'admin' };
      localStorage.setItem('loggedInUser', JSON.stringify(adminUser));
      navigate('/admin'); // 登入後導向後台
      return;
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u) => u.username === username && u.password === password);
    

    if (user) {
      localStorage.setItem('loggedInUser', JSON.stringify(user));

      // 依角色導向
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/books');
      }
    } else {
      setError('帳號或密碼錯誤');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', paddingTop: '100px' }}>
      <h2>登入</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label>帳號：</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} />
        </div>
        <div>
          <label>密碼：</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} />
        </div>
        <button type="submit">登入</button>
      </form>
      <p>沒有帳號？ <Link to="/register">前往註冊</Link></p>
    </div>
  );
}

export default Login;
