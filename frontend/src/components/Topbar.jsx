import { Link, useLocation, useNavigate } from 'react-router-dom'

function Topbar() {
  const location = useLocation()
  const navigate = useNavigate()

  const usuarioGuardado = localStorage.getItem('usuarioActivo')
  const usuarioActivo = usuarioGuardado ? JSON.parse(usuarioGuardado) : null

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

      {usuarioActivo && (
        <div className="topbarSession">
          <span>{usuarioActivo.nombreUsuario}</span>

          <button className="logoutButton" onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        </div>
      )}
    </header>
  )
}

export default Topbar