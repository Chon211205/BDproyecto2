import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Productos from './pages/Productos'
import Reportes from './pages/Reportes'
import Clientes from './pages/Clientes'
import Ventas from './pages/Ventas'
import Categorias from './pages/Categorias'
import Proveedores from './pages/Proveedores'
import Empleados from './pages/Empleados'
import Direcciones from './pages/Direcciones'
import Inventario from './pages/Inventario'

function App() {
  return (
    <BrowserRouter>
      <div className="navbar">
        <div className="logo">UVGESTORE</div>

        <div className="nav-links">
          <Link to="/">Dashboard</Link>
          <Link to="/productos">Productos</Link>
          <Link to="/reportes">Reportes</Link>
          <Link to="/clientes">Clientes</Link>
          <Link to="/ventas">Ventas</Link>
          <Link to="/categorias">Categorías</Link>
          <Link to="/proveedores">Proveedores</Link>
          <Link to="/empleados">Empleados</Link>
          <Link to="/direcciones">Direcciones</Link>
          <Link to="/inventario">Inventario</Link>
        </div>
      </div>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/reportes" element={<Reportes />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/ventas" element={<Ventas />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/proveedores" element={<Proveedores />} />
        <Route path="/empleados" element={<Empleados />} />
        <Route path="/direcciones" element={<Direcciones />} />
        <Route path="/inventario" element={<Inventario />} />
        
        
      </Routes>
    </BrowserRouter>
  )
}

export default App