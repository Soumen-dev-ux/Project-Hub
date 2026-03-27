import { Navigate } from 'react-router-dom';

const TOKEN_KEY = 'admin_token';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}
