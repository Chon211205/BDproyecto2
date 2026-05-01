import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Productos() {
  const [productos, setProductos] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetch('http://localhost:3000/api/productos')
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(err => console.error(err))
  }, [])

  return (
    <div className="container">

      <div className="pageHeader">
        <div>
          <h1>Productos</h1>
          <p>Consulta y administra el inventario de la tienda.</p>
        </div>

        <div className="actions">
          <button 
            className="secondaryButton"
            onClick={() => navigate('/')}
          >
            ← Dashboard
          </button>

          <button className="primaryButton">
            + Agregar producto
          </button>
        </div>
      </div>

      <div className="toolbar">
        <input type="text" placeholder="Buscar producto..." />

        <select>
          <option>Todas las categorías</option>
          <option>Bebidas</option>
          <option>Snacks</option>
          <option>Lácteos</option>
          <option>Granos</option>
        </select>
      </div>

      <div className="panel">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Producto</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Categoría</th>
              <th>Proveedor</th>
              <th>Estado</th>
            </tr>
          </thead>

          <tbody>
            {productos.map(producto => (
              <tr key={producto.idproducto}>
                <td>{producto.idproducto}</td>

                <td>
                  <strong>{producto.nombreproducto}</strong>
                </td>

                <td>Q{producto.precio}</td>

                <td>{producto.stock}</td>

                <td>{producto.idcategoria}</td>

                <td>{producto.idproveedor}</td>

                <td>
                  <span className={producto.stock < 20 ? 'badge danger' : 'badge success'}>
                    {producto.stock < 20 ? 'Bajo stock' : 'Disponible'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}

export default Productos