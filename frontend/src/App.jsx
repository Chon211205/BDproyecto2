import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'

import Topbar from './components/Topbar'
import ProtectedRoute from './components/ProtectedRoute'
import { ROUTE_ROLES, WRITE_ROLES } from './auth/permissions'

import Login from './pages/Login'
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
import Register from './pages/Register'

function AppContent() {
  const location = useLocation()
  const usuarioActivo = localStorage.getItem('usuarioActivo')
  const mostrarTopbar = location.pathname !== '/login' && usuarioActivo
  const protectedPage = (children, roles) => (
    <ProtectedRoute roles={roles}>
      {children}
    </ProtectedRoute>
  )

  return (
    <>
      {mostrarTopbar && <Topbar />}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={protectedPage(<Dashboard />, ROUTE_ROLES['/'])}
        />

        <Route
          path="/productos"
          element={protectedPage(<Productos />, ROUTE_ROLES['/productos'])}
        />

        <Route
          path="/productos/:id/editar"
          element={protectedPage(<EditarProducto />, WRITE_ROLES.productos)}
        />

        <Route
          path="/clientes"
          element={protectedPage(<Clientes />, ROUTE_ROLES['/clientes'])}
        />

        <Route
          path="/clientes/:id/editar"
          element={protectedPage(<EditarCliente />, WRITE_ROLES.clientes)}
        />

        <Route
          path="/categorias"
          element={protectedPage(<Categorias />, ROUTE_ROLES['/categorias'])}
        />

        <Route
          path="/categorias/:id/editar"
          element={protectedPage(<EditarCategoria />, WRITE_ROLES.categorias)}
        />

        <Route
          path="/proveedores"
          element={protectedPage(<Proveedores />, ROUTE_ROLES['/proveedores'])}
        />

        <Route
          path="/proveedores/:id/editar"
          element={protectedPage(<EditarProveedor />, WRITE_ROLES.proveedores)}
        />

        <Route
          path="/direcciones"
          element={protectedPage(<Direcciones />, ROUTE_ROLES['/direcciones'])}
        />

        <Route
          path="/direcciones/:id/editar"
          element={protectedPage(<EditarDireccion />, WRITE_ROLES.direcciones)}
        />

        <Route
          path="/empleados"
          element={protectedPage(<Empleados />, ROUTE_ROLES['/empleados'])}
        />

        <Route
          path="/empleados/:id/editar"
          element={protectedPage(<EditarEmpleado />, WRITE_ROLES.empleados)}
        />

        <Route
          path="/ventas"
          element={protectedPage(<Ventas />, ROUTE_ROLES['/ventas'])}
        />

        <Route
          path="/ventas/:id/detalle"
          element={protectedPage(<DetalleVenta />, ROUTE_ROLES['/ventas'])}
        />

        <Route
          path="/ventas/registrar"
          element={protectedPage(<RegistrarVenta />, ROUTE_ROLES['/ventas/registrar'])}
        />

        <Route
          path="/reportes"
          element={protectedPage(<Reportes />, ROUTE_ROLES['/reportes'])}
        />

        <Route
          path="/inventario"
          element={protectedPage(<Inventario />, ROUTE_ROLES['/inventario'])}
        />
        
      </Routes>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
