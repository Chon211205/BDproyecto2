import { Link, useLocation } from 'react-router-dom'

function Topbar() {
  const location = useLocation()

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
    </header>
  )
}

export default Topbar