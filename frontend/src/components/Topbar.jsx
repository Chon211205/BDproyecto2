import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ROUTE_ROLES, getUsuarioActivo, hasRole } from '../auth/permissions'

const NAV_LINKS = [
  { path: '/', label: 'Dashboard' },
  { path: '/productos', label: 'Productos' },
  { path: '/clientes', label: 'Clientes' },
  { path: '/ventas', label: 'Ventas' },
  { path: '/inventario', label: 'Inventario' },
  { path: '/reportes', label: 'Reportes' }
]

function Topbar() {
  const location = useLocation()
  const navigate = useNavigate()

  const usuarioActivo = getUsuarioActivo()

  function isActive(path) {
    return location.pathname === path
  }

  function cerrarSesion() {
    localStorage.removeItem('usuarioActivo')
    navigate('/login')
  }

  return (
    <header className="topbar">
      <div className="topbarLogo">
        <span className="logoIcon">UVG</span>
        <div>
          <h2>UVGestore</h2>
          <p>Sistema de gestión</p>
        </div>
      </div>

      <nav className="topbarLinks">
        {NAV_LINKS
          .filter(link => hasRole(usuarioActivo, ROUTE_ROLES[link.path]))
          .map(link => (
            <Link className={isActive(link.path) ? 'activeLink' : ''} to={link.path} key={link.path}>
              {link.label}
            </Link>
          ))}
      </nav>

      {usuarioActivo && (
        <div className="topbarSession">
          <span>{usuarioActivo.nombreUsuario}</span>
          <span>{usuarioActivo.rol}</span>

          <button className="logoutButton" onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        </div>
      )}
    </header>
  )
}

export default Topbar
