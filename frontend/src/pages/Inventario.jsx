import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Inventario() {
  const navigate = useNavigate()
  const [movimientos, setMovimientos] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('http://localhost:3000/api/inventario/movimientos')
      .then(res => res.json())
      .then(data => setMovimientos(Array.isArray(data) ? data : []))
      .catch(() => setError('No se pudieron cargar los movimientos de inventario'))
  }, [])

  return (
    <div className="container">
      <div className="pageHeader">
        <div>
          <h1>Inventario</h1>
          <p>Consulta el historial de entradas y salidas de productos.</p>
        </div>

        <button className="secondaryButton" onClick={() => navigate('/')}>
          ← Dashboard
        </button>
      </div>

      {error && <p className="errorMessage">{error}</p>}

      <div className="panel">
        <h3>Movimientos de inventario</h3>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Producto</th>
              <th>Tipo</th>
              <th>Cantidad</th>
              <th>Fecha</th>
            </tr>
          </thead>

          <tbody>
            {movimientos.map(movimiento => (
              <tr key={movimiento.idmovimiento}>
                <td>{movimiento.idmovimiento}</td>
                <td>{movimiento.nombreproducto}</td>
                <td>
                  <span className={movimiento.tipo === 'entrada' ? 'badge success' : 'badge danger'}>
                    {movimiento.tipo}
                  </span>
                </td>
                <td>{movimiento.cantidad}</td>
                <td>
                  {movimiento.fecha ? new Date(movimiento.fecha).toLocaleDateString() : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Inventario