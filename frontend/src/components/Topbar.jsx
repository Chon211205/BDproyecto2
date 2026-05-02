import { Link, useLocation, useNavigate } from 'react-router-dom'

function Topbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const usuarioActivo = localStorage.getItem('usuarioActivo')

  function cerrarSesion() {
    localStorage.removeItem('usuarioActivo')
    navigate('/login')
  }

  function isActive(path) {
    return location.pathname === path
  }

  return (
    <header className="topbar">
      <div className="topbarLogo">
        <span className="logoIcon">🛒</span>
        <div>
          <h2>UVGestor</h2>
          <p>Sistema de gestión</p>
        </div>
      </div>

      <nav className="topbarLinks">
        <Link className={isActive('/') ? 'activeLink' : ''} to="/">
          Dashboard
        </Link>

        <Link className={isActive('/productos') ? 'activeLink' : ''} to="/productos">
          Productos
        </Link>

        <Link className={isActive('/clientes') ? 'activeLink' : ''} to="/clientes">
          Clientes
        </Link>

        <Link className={isActive('/ventas') ? 'activeLink' : ''} to="/ventas">
          Ventas
        </Link>

        <Link className={isActive('/reportes') ? 'activeLink' : ''} to="/reportes">
          Reportes
        </Link>
      </nav>

      <div className="topbarSession">
        <span>{usuarioActivo}</span>

        <button className="logoutButton" onClick={cerrarSesion}>
          Cerrar sesión
        </button>
      </div>
    </header>
  )
}

export default Topbar