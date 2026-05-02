import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Reportes() {
  const navigate = useNavigate()

  const [ventasClientes, setVentasClientes] = useState([])
  const [productosVendidos, setProductosVendidos] = useState([])
  const [ventasPorCliente, setVentasPorCliente] = useState([])
  const [productosPromedio, setProductosPromedio] = useState([])
  const [error, setError] = useState('')
  const [clientesDirecciones, setClientesDirecciones] = useState([])
  const [movimientosProducto, setMovimientosProducto] = useState([])
  const [clientesCompras, setClientesCompras] = useState([])
  const [productosSinVentas, setProductosSinVentas] = useState([])
  const [vistaVentas, setVistaVentas] = useState([])

  useEffect(() => {
    async function cargarReportes() {
      try {
        const resVentas = await fetch('http://localhost:3000/api/reportes/ventas-clientes')
        const dataVentas = await resVentas.json()

        const resVendidos = await fetch('http://localhost:3000/api/reportes/productos-mas-vendidos')
        const dataVendidos = await resVendidos.json()

        const resCliente = await fetch('http://localhost:3000/api/reportes/ventas-por-cliente')
        const dataCliente = await resCliente.json()

        const resPromedio = await fetch('http://localhost:3000/api/reportes/productos-precio-promedio')
        const dataPromedio = await resPromedio.json()

        const resDirecciones = await fetch('http://localhost:3000/api/reportes/clientes-direcciones')
        const dataDirecciones = await resDirecciones.json()

        const resMovimientos = await fetch('http://localhost:3000/api/reportes/movimientos-producto')
        const dataMovimientos = await resMovimientos.json()

        const resClientesCompras = await fetch('http://localhost:3000/api/reportes/clientes-con-compras')
        const dataClientesCompras = await resClientesCompras.json()

        const resSinVentas = await fetch('http://localhost:3000/api/reportes/productos-sin-ventas')
        const dataSinVentas = await resSinVentas.json()

        const resVistaVentas = await fetch('http://localhost:3000/api/reportes/vista-ventas-completas')
        const dataVistaVentas = await resVistaVentas.json()

setVistaVentas(Array.isArray(dataVistaVentas) ? dataVistaVentas : [])

setProductosSinVentas(Array.isArray(dataSinVentas) ? dataSinVentas : [])

setClientesCompras(Array.isArray(dataClientesCompras) ? dataClientesCompras : [])

        setVentasClientes(Array.isArray(dataVentas) ? dataVentas : [])
        setProductosVendidos(Array.isArray(dataVendidos) ? dataVendidos : [])
        setVentasPorCliente(Array.isArray(dataCliente) ? dataCliente : [])
        setProductosPromedio(Array.isArray(dataPromedio) ? dataPromedio : [])
        setClientesDirecciones(Array.isArray(dataDirecciones) ? dataDirecciones : [])
        setMovimientosProducto(Array.isArray(dataMovimientos) ? dataMovimientos : [])
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
          <p>Consultas SQL visibles en la UI con datos reales de PostgreSQL.</p>
        </div>

        <button className="secondaryButton" onClick={() => navigate('/')}>
          ← Dashboard
        </button>
      </div>

      {error && <p className="errorMessage">{error}</p>}

      <div className="cards">
        <div className="card">
          <span>JOIN</span>
          <h2>{ventasClientes.length}</h2>
          <p>Ventas con cliente</p>
        </div>

        <div className="card">
          <span>CTE</span>
          <h2>{productosVendidos.length}</h2>
          <p>Productos vendidos</p>
        </div>

        <div className="card">
          <span>GROUP BY</span>
          <h2>{ventasPorCliente.length}</h2>
          <p>Ventas por cliente</p>
        </div>

        <div className="card">
          <span>SUBQUERY</span>
          <h2>{productosPromedio.length}</h2>
          <p>Precio sobre promedio</p>
        </div>
      
        <div className="card">
          <span>SUBQUERY</span>
          <h2>{clientesCompras.length}</h2>
          <p>Clientes con compras</p>
        </div>

        <div className="card">
          <span>SUBQUERY</span>
          <h2>{productosSinVentas.length}</h2>
          <p>Productos sin ventas</p>
        </div>

        <div className="card">
          <span>JOIN</span>
          <h2>{clientesDirecciones.length}</h2>
          <p>Clientes con dirección</p>
        </div>
    
        <div className="card">
          <span>AGREGACIÓN</span>
          <h2>{movimientosProducto.length}</h2>
          <p>Movimientos por producto</p>
        </div>

        <div className="card">
          <span>VIEW</span>
          <h2>{vistaVentas.length}</h2>
          <p>Ventas completas</p>
        </div>


      </div>




      <div className="panel">
        <h3>Reporte 1: Ventas con cliente y empleado (JOIN)</h3>
        <p>Este reporte combina las tablas venta, cliente y empleado.</p>

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
            {ventasClientes.map(venta => (
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
        <h3>Reporte 2: Productos más vendidos (CTE)</h3>
        <p>Este reporte calcula la cantidad total vendida por producto.</p>

        <table>
          <thead>
            <tr>
              <th>ID Producto</th>
              <th>Producto</th>
              <th>Total vendido</th>
            </tr>
          </thead>

          <tbody>
            {productosVendidos.map(producto => (
              <tr key={producto.idproducto}>
                <td>{producto.idproducto}</td>
                <td>{producto.nombreproducto}</td>
                <td>{producto.totalvendido}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <br />

      <div className="panel">
        <h3>Reporte 3: Ventas agrupadas por cliente (GROUP BY + HAVING)</h3>
        <p>Este reporte muestra los clientes con compras mayores a Q30.</p>

        <table>
          <thead>
            <tr>
              <th>ID Cliente</th>
              <th>Cliente</th>
              <th>Cantidad ventas</th>
              <th>Total comprado</th>
            </tr>
          </thead>

          <tbody>
            {ventasPorCliente.map(cliente => (
              <tr key={cliente.idcliente}>
                <td>{cliente.idcliente}</td>
                <td>{cliente.cliente}</td>
                <td>{cliente.cantidadventas}</td>
                <td>Q{cliente.totalcomprado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <br />

      <div className="panel">
        <h3>Reporte 4: Productos con precio mayor al promedio (Subquery)</h3>
        <p>Este reporte usa una subconsulta para comparar precios contra el promedio general.</p>

        <table>
          <thead>
            <tr>
              <th>ID Producto</th>
              <th>Producto</th>
              <th>Precio</th>
            </tr>
          </thead>

          <tbody>
            {productosPromedio.map(producto => (
              <tr key={producto.idproducto}>
                <td>{producto.idproducto}</td>
                <td>{producto.nombreproducto}</td>
                <td>Q{producto.precio}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <br />

      <div className="panel">
        <h3>Reporte 5: Clientes con dirección registrada (JOIN)</h3>
        <p>
          Este reporte combina las tablas cliente y direccion_cliente para mostrar
          la ubicación registrada de cada cliente.
        </p>

        <table>
          <thead>
            <tr>
              <th>ID Cliente</th>
              <th>Cliente</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Dirección</th>
              <th>Ciudad</th>
            </tr>
          </thead>

          <tbody>
            {clientesDirecciones.map(cliente => (
              <tr key={cliente.idcliente}>
                <td>{cliente.idcliente}</td>
                <td>{cliente.cliente}</td>
                <td>{cliente.correocliente}</td>
                <td>{cliente.telefonocliente}</td>
                <td>{cliente.direccioncliente}</td>
                <td>{cliente.ciudad}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <br/>

      <div className="panel">
        <h3>Reporte 6: Movimientos de inventario por producto</h3>
        <p>
          Este reporte calcula las entradas, salidas y balance de inventario por cada producto.
        </p>

        <table>
          <thead>
            <tr>
              <th>ID Producto</th>
              <th>Producto</th>
              <th>Total entradas</th>
              <th>Total salidas</th>
              <th>Balance</th>
            </tr>
          </thead>

          <tbody>
            {movimientosProducto.map(producto => (
              <tr key={producto.idproducto}>
                <td>{producto.idproducto}</td>
                <td>{producto.nombreproducto}</td>
                <td>{producto.totalentradas}</td>
                <td>{producto.totalsalidas}</td>
                <td>
                  <span className={Number(producto.balance) >= 0 ? 'badge success' : 'badge danger'}>
                    {producto.balance}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>     

      <br />

      <div className="panel">
        <h3>Reporte: Clientes que realizaron compras (Subquery IN)</h3>
        <p>
          Este reporte muestra los clientes cuyo ID aparece dentro de la tabla venta.
        </p>

        <table>
          <thead>
            <tr>
              <th>ID Cliente</th>
              <th>Cliente</th>
              <th>Correo</th>
              <th>Teléfono</th>
            </tr>
          </thead>

          <tbody>
            {clientesCompras.map(cliente => (
              <tr key={cliente.idcliente}>
                <td>{cliente.idcliente}</td>
                <td>
                  {cliente.nombrecliente} {cliente.apellidocliente}
                </td>
                <td>{cliente.correocliente}</td>
                <td>{cliente.telefonocliente}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <br />

      <div className="panel">
        <h3>Reporte: Productos sin ventas (Subquery NOT IN)</h3>
        <p>
          Este reporte muestra los productos que todavía no aparecen en ningún detalle de venta.
        </p>

        <table>
          <thead>
            <tr>
              <th>ID Producto</th>
              <th>Producto</th>
              <th>Precio</th>
              <th>Stock</th>
            </tr>
          </thead>

          <tbody>
            {productosSinVentas.map(producto => (
              <tr key={producto.idproducto}>
                <td>{producto.idproducto}</td>
                <td>{producto.nombreproducto}</td>
                <td>Q{producto.precio}</td>
                <td>{producto.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <br />

      <div className="panel">
        <h3>Reporte: Vista de ventas completas (VIEW)</h3>
        <p>
          Este reporte utiliza una VIEW de PostgreSQL para mostrar ventas con cliente,
          empleado, método de pago y monto pagado.
        </p>

        <table>
          <thead>
            <tr>
              <th>ID Venta</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Empleado</th>
              <th>Total</th>
              <th>Método de pago</th>
              <th>Monto pagado</th>
            </tr>
          </thead>

          <tbody>
            {vistaVentas.map(venta => (
              <tr key={venta.idventa}>
                <td>#{venta.idventa}</td>
                <td>{venta.fecha ? new Date(venta.fecha).toLocaleDateString() : '-'}</td>
                <td>{venta.cliente}</td>
                <td>{venta.empleado}</td>
                <td>Q{venta.total}</td>
                <td>{venta.metodopago || 'Sin pago'}</td>
                <td>{venta.montopagado ? `Q${venta.montopagado}` : 'Pendiente'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}

export default Reportes