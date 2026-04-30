import { useEffect, useState } from 'react'
import { getProductos } from '../services/api'

function Productos() {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getProductos()
      .then(data => {
        setProductos(data)
        setCargando(false)
      })
      .catch(() => {
        setError('No se pudieron cargar los productos')
        setCargando(false)
      })
  }, [])

  if (cargando) return <p>Cargando productos...</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      <h1>Productos</h1>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Producto</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Categoría</th>
            <th>Proveedor</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(producto => (
            <tr key={producto.idproducto}>
              <td>{producto.idproducto}</td>
              <td>{producto.nombreproducto}</td>
              <td>Q{producto.precio}</td>
              <td>{producto.stock}</td>
              <td>{producto.idcategoria}</td>
              <td>{producto.idproveedor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Productos