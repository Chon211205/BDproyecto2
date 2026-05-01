import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function DetalleVenta() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [detalleVenta, setDetalleVenta] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`http://localhost:3000/api/ventas/${id}/detalle`)
      .then(res => res.json())
      .then(data => {
        setDetalleVenta(Array.isArray(data) ? data : [])
      })
      .catch(() => {
        setError('No se pudo cargar el detalle de la venta')
      })
  }, [id])

  const totalDetalle = detalleVenta.reduce((total, detalle) => {
    return total + Number(detalle.subtotal)
  }, 0)

  return (
    <div className="container">
      <div className="pageHeader">
        <div>
          <h1>Detalle de venta #{id}</h1>
          <p>Productos incluidos en esta venta.</p>
        </div>

        <button className="secondaryButton" onClick={() => navigate('/ventas')}>
          ← Volver a ventas
        </button>
      </div>

      {error && <p className="errorMessage">{error}</p>}

      <div className="cards">
        <div className="card">
          <span>Venta</span>
          <h2>#{id}</h2>
          <p>Detalle registrado</p>
        </div>

        <div className="card">
          <span>Productos</span>
          <h2>{detalleVenta.length}</h2>
          <p>Productos en la venta</p>
        </div>

        <div className="card">
          <span>Total detalle</span>
          <h2>Q{totalDetalle.toFixed(2)}</h2>
          <p>Suma de subtotales</p>
        </div>
      </div>

      <div className="panel">
        <h3>Productos vendidos</h3>

        <table>
          <thead>
            <tr>
              <th>ID Detalle</th>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio unitario</th>
              <th>Subtotal</th>
            </tr>
          </thead>

          <tbody>
            {detalleVenta.map(detalle => (
              <tr key={detalle.iddetalle}>
                <td>{detalle.iddetalle}</td>
                <td>
                  <strong>{detalle.nombreproducto}</strong>
                </td>
                <td>{detalle.cantidad}</td>
                <td>Q{detalle.preciounitario}</td>
                <td>Q{detalle.subtotal}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {detalleVenta.length === 0 && !error && (
          <p>No hay productos registrados para esta venta.</p>
        )}
      </div>
    </div>
  )
}

export default DetalleVenta