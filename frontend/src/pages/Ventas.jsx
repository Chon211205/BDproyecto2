import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Ventas() {
  const navigate = useNavigate()
  const [ventas, setVentas] = useState([])

  useEffect(() => {
    fetch('http://localhost:3000/api/ventas')
      .then(res => res.json())
      .then(data => setVentas(Array.isArray(data) ? data : []))
      .catch(err => console.error(err))
  }, [])

  return (
    <div className="container">
      <div className="pageHeader">
        <div>
          <h1>Ventas</h1>
          <p>Consulta las ventas registradas en la tienda.</p>
        </div>

        <button className="secondaryButton" onClick={() => navigate('/')}>
          ← Dashboard
        </button>
      </div>

      <div className="panel">
        <table>
          <thead>
            <tr>
              <th>ID Venta</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Empleado</th>
              <th>Método de pago</th>
              <th>Monto pagado</th>
            </tr>
          </thead>

          <tbody>
            {ventas.map(venta => (
              <tr key={venta.idventa}>
                <td>#{venta.idventa}</td>
                <td>{new Date(venta.fecha).toLocaleDateString()}</td>
                <td>{venta.cliente}</td>
                <td>{venta.empleado}</td>
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

export default Ventas