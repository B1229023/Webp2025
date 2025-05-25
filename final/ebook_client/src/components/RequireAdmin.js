// src/components/RequireAdmin.jsx
import { Navigate } from 'react-router-dom';

function RequireAdmin({ children }) {
  const user = JSON.parse(localStorage.getItem('loggedInUser'));
  const role = user?.role;

  if (role !== 'admin') {
    alert('您不是管理員，無法進入');
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default RequireAdmin;
