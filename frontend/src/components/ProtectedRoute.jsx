import { Navigate } from 'react-router-dom'
import { getUsuarioActivo, hasRole } from '../auth/permissions'

function ProtectedRoute({ children, roles }) {
  const usuarioActivo = getUsuarioActivo()

  if (!usuarioActivo) {
    return <Navigate to="/login" replace />
  }

  if (roles && !hasRole(usuarioActivo, roles)) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
