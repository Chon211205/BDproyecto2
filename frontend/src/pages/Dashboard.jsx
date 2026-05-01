import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const navigate = useNavigate()

  const [resumen, setResumen] = useState({
    totalproductos: 0,
    totalclientes: 0,
    totalventas: 0,
    totalvendido: 0
  })

  const [productosDestacados, setProductosDestacados] = useState([])
  const [ultimasVentas, setUltimasVentas] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    async function cargarDashboard() {
      try {
        const resResumen = await fetch('http://localhost:3000/api/reportes/dashboard')
        const dataResumen = await resResumen.json()

        const resProductos = await fetch('http://localhost:3000/api/reportes/dashboard/productos-destacados')
        const dataProductos = await resProductos.json()

        const resVentas = await fetch('http://localhost:3000/api/reportes/dashboard/ultimas-ventas')
        const dataVentas = await resVentas.json()

        setResumen(dataResumen)
        setProductosDestacados(Array.isArray(dataProductos) ? dataProductos : [])
        setUltimasVentas(Array.isArray(dataVentas) ? dataVentas : [])
      } catch (error) {
        console.error(error)
        setError('No se pudieron cargar los datos del dashboard')
      }
    }

    cargarDashboard()
  }, [])

  return (
    <div className="container">
      <div className="hero">
        <div>
          <h1>Panel de gestión</h1>
          <p>Controla tu inventario y ventas fácilmente</p>
        </div>
      </div>

      {error && <p className="errorMessage">{error}</p>}

      <div className="cards">
        <div className="card clickable" onClick={() => navigate('/productos')}>
          <span>Inventario</span>
          <h2>{resumen.totalproductos}</h2>
          <p>Productos registrados</p>
        </div>

        <div className="card clickable" onClick={() => navigate('/categorias')}>
          <span>Clasificación</span>
          <h2>Categorías</h2>
          <p>Organizar productos</p>
        </div>

        <div className="card clickable" onClick={() => navigate('/proveedores')}>
          <span>Suministro</span>
          <h2>Proveedores</h2>
          <p>Gestionar proveedores</p>
        </div>

        <div className="card clickable" onClick={() => navigate('/clientes')}>
          <span>Clientes</span>
          <h2>{resumen.totalclientes}</h2>
          <p>Clientes registrados</p>
        </div>

        <div className="card clickable" onClick={() => navigate('/direcciones')}>
          <span>Ubicación</span>
          <h2>Direcciones</h2>
          <p>Direcciones de clientes</p>
        </div>

        <div className="card clickable" onClick={() => navigate('/empleados')}>
          <span>Personal</span>
          <h2>Empleados</h2>
          <p>Gestionar empleados</p>
        </div>

        <div className="card clickable" onClick={() => navigate('/ventas')}>
          <span>Operaciones</span>
          <h2>{resumen.totalventas}</h2>
          <p>Ventas registradas</p>
        </div>

        <div className="card clickable" onClick={() => navigate('/reportes')}>
          <span>Total vendido</span>
          <h2>Q{Number(resumen.totalvendido).toFixed(2)}</h2>
          <p>Ver reportes SQL</p>
        </div>
      </div>

      <div className="grid">
        <div className="panel">
          <h3>Productos destacados</h3>

          {productosDestacados.map(producto => (
            <div className="item" key={producto.idproducto}>
              <div>
                <strong>{producto.nombreproducto}</strong>
                <p>{producto.nombrecategoria}</p>
              </div>
              <span>Q{producto.precio}</span>
            </div>
          ))}
        </div>

        <div className="panel">
          <h3>Últimas ventas</h3>

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              {ultimasVentas.map(venta => (
                <tr key={venta.idventa}>
                  <td>#{venta.idventa}</td>
                  <td>{venta.cliente}</td>
                  <td>Q{venta.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard