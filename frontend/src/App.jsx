import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'

import Topbar from './components/Topbar'
import ProtectedRoute from './components/ProtectedRoute'

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

  return (
    <>
      {mostrarTopbar && <Topbar />}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/productos"
          element={
            <ProtectedRoute>
              <Productos />
            </ProtectedRoute>
          }
        />

        <Route
          path="/productos/:id/editar"
          element={
            <ProtectedRoute>
              <EditarProducto />
            </ProtectedRoute>
          }
        />

        <Route
          path="/clientes"
          element={
            <ProtectedRoute>
              <Clientes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/clientes/:id/editar"
          element={
            <ProtectedRoute>
              <EditarCliente />
            </ProtectedRoute>
          }
        />

        <Route
          path="/categorias"
          element={
            <ProtectedRoute>
              <Categorias />
            </ProtectedRoute>
          }
        />

        <Route
          path="/categorias/:id/editar"
          element={
            <ProtectedRoute>
              <EditarCategoria />
            </ProtectedRoute>
          }
        />

        <Route
          path="/proveedores"
          element={
            <ProtectedRoute>
              <Proveedores />
            </ProtectedRoute>
          }
        />

        <Route
          path="/proveedores/:id/editar"
          element={
            <ProtectedRoute>
              <EditarProveedor />
            </ProtectedRoute>
          }
        />

        <Route
          path="/direcciones"
          element={
            <ProtectedRoute>
              <Direcciones />
            </ProtectedRoute>
          }
        />

        <Route
          path="/direcciones/:id/editar"
          element={
            <ProtectedRoute>
              <EditarDireccion />
            </ProtectedRoute>
          }
        />

        <Route
          path="/empleados"
          element={
            <ProtectedRoute>
              <Empleados />
            </ProtectedRoute>
          }
        />

        <Route
          path="/empleados/:id/editar"
          element={
            <ProtectedRoute>
              <EditarEmpleado />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ventas"
          element={
            <ProtectedRoute>
              <Ventas />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ventas/:id/detalle"
          element={
            <ProtectedRoute>
              <DetalleVenta />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ventas/registrar"
          element={
            <ProtectedRoute>
              <RegistrarVenta />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reportes"
          element={
            <ProtectedRoute>
              <Reportes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/inventario"
          element={
            <ProtectedRoute>
              <Inventario />
            </ProtectedRoute>
          }
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