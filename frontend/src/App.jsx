import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Topbar from './components/Topbar'

import Dashboard from './pages/Dashboard'
import Productos from './pages/Productos'
import EditarProducto from './pages/EditarProducto'
import Clientes from './pages/Clientes'
import EditarCliente from './pages/EditarCliente'
import Categorias from './pages/Categorias'
import EditarCategoria from './pages/EditarCategoria'
import Proveedores from './pages/Proveedores'
import EditarProveedor from './pages/EditarProveedor'
import Direcciones from './pages/Direcciones'
import EditarDireccion from './pages/EditarDireccion'
import Empleados from './pages/Empleados'
import EditarEmpleado from './pages/EditarEmpleado'
import Ventas from './pages/Ventas'
import DetalleVenta from './pages/DetalleVenta'
import RegistrarVenta from './pages/RegistrarVenta'
import Reportes from './pages/Reportes'
import Inventario from './pages/Inventario'

function App() {
  return (
    <BrowserRouter>
      <Topbar />

      <Routes>
        <Route path="/" element={<Dashboard />} />

        <Route path="/productos" element={<Productos />} />
        <Route path="/productos/:id/editar" element={<EditarProducto />} />

        <Route path="/clientes" element={<Clientes />} />
        <Route path="/clientes/:id/editar" element={<EditarCliente />} />

        <Route path="/categorias" element={<Categorias />} />
        <Route path="/categorias/:id/editar" element={<EditarCategoria />} />

        <Route path="/proveedores" element={<Proveedores />} />
        <Route path="/proveedores/:id/editar" element={<EditarProveedor />} />

        <Route path="/direcciones" element={<Direcciones />} />
        <Route path="/direcciones/:id/editar" element={<EditarDireccion />} />

        <Route path="/empleados" element={<Empleados />} />
        <Route path="/empleados/:id/editar" element={<EditarEmpleado />} />

        <Route path="/ventas" element={<Ventas />} />
        <Route path="/ventas/:id/detalle" element={<DetalleVenta />} />
        <Route path="/ventas/registrar" element={<RegistrarVenta />} />

        <Route path="/reportes" element={<Reportes />} />
        <Route path="/inventario" element={<Inventario />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App