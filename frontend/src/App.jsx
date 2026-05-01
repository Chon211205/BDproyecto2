import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Productos from './pages/Productos'
import Reportes from './pages/Reportes'
import Clientes from './pages/Clientes'
import Ventas from './pages/Ventas'

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
        </div>
      </div>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/reportes" element={<Reportes />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/ventas" element={<Ventas />} />
        
      </Routes>
    </BrowserRouter>
  )
}

export default App