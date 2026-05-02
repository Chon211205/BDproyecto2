import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Ventas() {
  const navigate = useNavigate()
  const [ventas, setVentas] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('http://localhost:3000/api/ventas')
      .then(res => res.json())
      .then(data => setVentas(Array.isArray(data) ? data : []))
      .catch(() => setError('No se pudieron cargar las ventas'))
  }, [])

  return (
    <div className="container">
      <div className="pageHeader">
        <div>
          <h1>Ventas</h1>
          <p>Consulta las ventas registradas y revisa el detalle de cada venta.</p>
        </div>

        <div className="actions">
          <button className="secondaryButton" onClick={() => navigate('/')}>
            ← Dashboard
          </button>

          <button
            className="primaryButton"
            onClick={() => navigate('/ventas/registrar')}
          >
            + Registrar venta
          </button>
        </div>
      </div>

      {error && <p className="errorMessage">{error}</p>}

      <div className="panel">
        <h3>Ventas registradas</h3>

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
              <th>Detalle</th>
            </tr>
          </thead>

          <tbody>
            {ventas.map(venta => (
              <tr key={venta.idventa}>
                <td>#{venta.idventa}</td>

                <td>
                  {venta.fecha
                    ? new Date(venta.fecha).toLocaleDateString()
                    : '-'}
                </td>

                <td>{venta.cliente}</td>
                <td>{venta.empleado}</td>
                <td>Q{venta.total}</td>
                <td>{venta.metodopago || 'Sin pago'}</td>
                <td>{venta.montopagado ? `Q${venta.montopagado}` : 'Pendiente'}</td>

                <td>
                  <button
                    className="secondaryButton"
                    onClick={() => navigate(`/ventas/${venta.idventa}/detalle`)}
                  >
                    Ver detalle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {ventas.length === 0 && !error && (
          <p>No hay ventas registradas.</p>
        )}
      </div>
    </div>
  )
}

export default Ventas