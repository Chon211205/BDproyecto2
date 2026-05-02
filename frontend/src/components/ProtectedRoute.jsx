import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children }) {
  const usuarioActivo = localStorage.getItem('usuarioActivo')

  if (!usuarioActivo) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute