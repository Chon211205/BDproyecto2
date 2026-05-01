import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Reportes() {
  const navigate = useNavigate()
  const [ventasClientes, setVentasClientes] = useState([])
  const [productosVendidos, setProductosVendidos] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    async function cargarReportes() {
      try {
        const resVentas = await fetch('http://localhost:3000/api/reportes/ventas-clientes')
        const dataVentas = await resVentas.json()

        const resProductos = await fetch('http://localhost:3000/api/reportes/productos-mas-vendidos')
        const dataProductos = await resProductos.json()

        console.log('Ventas:', dataVentas)
        console.log('Productos vendidos:', dataProductos)

        setVentasClientes(Array.isArray(dataVentas) ? dataVentas : [])
        setProductosVendidos(Array.isArray(dataProductos) ? dataProductos : [])
      } catch (err) {
        console.error(err)
        setError('No se pudieron cargar los reportes')
      }
    }

    cargarReportes()
  }, [])

  return (
    <div className="container">
      <div className="pageHeader">
        <div>
          <h1>Reportes</h1>
          <p>Datos generados desde PostgreSQL usando consultas SQL.</p>
        </div>

        <button className="secondaryButton" onClick={() => navigate('/')}>
          ← Dashboard
        </button>
      </div>

      {error && <p>{error}</p>}

      <div className="panel">
        <h3>Ventas con cliente y empleado</h3>

        <table>
          <thead>
            <tr>
              <th>ID Venta</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Empleado</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            {ventasClientes.map((venta) => (
              <tr key={venta.idventa}>
                <td>#{venta.idventa}</td>
                <td>{venta.fecha ? new Date(venta.fecha).toLocaleDateString() : '-'}</td>
                <td>{venta.cliente}</td>
                <td>{venta.empleado}</td>
                <td>Q{venta.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <br />

      <div className="panel">
        <h3>Productos más vendidos</h3>

        <table>
          <thead>
            <tr>
              <th>ID Producto</th>
              <th>Producto</th>
              <th>Total vendido</th>
            </tr>
          </thead>

          <tbody>
            {productosVendidos.map((producto) => (
              <tr key={producto.idproducto}>
                <td>{producto.idproducto}</td>
                <td>{producto.nombreproducto}</td>
                <td>{producto.totalvendido}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Reportes