// frontend/src/layouts/AdminLayout.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
  const { user } = useAuth();

  // Si no hay usuario o el usuario no es admin, redirige al inicio
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Si es admin, muestra la página correspondiente
  return <Outlet />;
}