import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Productos() {
  const navigate = useNavigate()
  const [productos, setProductos] = useState([])
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [editandoId, setEditandoId] = useState(null)

  const [form, setForm] = useState({
    nombreProducto: '',
    precio: '',
    stock: '',
    idCategoria: '',
    idProveedor: ''
  })

  function cargarProductos() {
    fetch('http://localhost:3000/api/productos')
      .then(res => res.json())
      .then(data => setProductos(Array.isArray(data) ? data : []))
      .catch(() => setError('No se pudieron cargar los productos'))
  }

  useEffect(() => {
    cargarProductos()
  }, [])

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  function guardarProducto(e) {
    e.preventDefault()
    setMensaje('')
    setError('')

    const url = editandoId
      ? `http://localhost:3000/api/productos/${editandoId}`
      : 'http://localhost:3000/api/productos'

    const method = editandoId ? 'PUT' : 'POST'

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombreProducto: form.nombreProducto,
        precio: Number(form.precio),
        stock: Number(form.stock),
        idCategoria: Number(form.idCategoria),
        idProveedor: Number(form.idProveedor)
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error)
          return
        }

        setMensaje(editandoId ? 'Producto actualizado correctamente' : 'Producto creado correctamente')
        setEditandoId(null)
        setForm({
          nombreProducto: '',
          precio: '',
          stock: '',
          idCategoria: '',
          idProveedor: ''
        })
        cargarProductos()
      })
      .catch(() => setError('Error al guardar producto'))
  }

  function cargarEdicion(producto) {
    setEditandoId(producto.idproducto)

    setForm({
      nombreProducto: producto.nombreproducto,
      precio: producto.precio,
      stock: producto.stock,
      idCategoria: producto.idcategoria,
      idProveedor: producto.idproveedor
    })
  }

  function eliminarProducto(idProducto) {
    const confirmar = window.confirm('¿Seguro que deseas eliminar este producto?')

    if (!confirmar) return

    setMensaje('')
    setError('')

    fetch(`http://localhost:3000/api/productos/${idProducto}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error)
          return
        }

        setMensaje('Producto eliminado correctamente')
        cargarProductos()
      })
      .catch(() => setError('Error al eliminar producto'))
  }

  return (
    <div className="container">
      <div className="pageHeader">
        <div>
          <h1>Productos</h1>
          <p>Consulta y administra el inventario de la tienda.</p>
        </div>

        <button className="secondaryButton" onClick={() => navigate('/')}>
          ← Dashboard
        </button>
      </div>

      {mensaje && <p className="successMessage">{mensaje}</p>}
      {error && <p className="errorMessage">{error}</p>}

      <div className="panel">
        <h3>Agregar producto</h3>

        <form className="formGrid" onSubmit={guardarProducto}>
          <input
            name="nombreProducto"
            placeholder="Nombre del producto"
            value={form.nombreProducto}
            onChange={handleChange}
          />

          <input
            name="precio"
            type="number"
            step="0.01"
            placeholder="Precio"
            value={form.precio}
            onChange={handleChange}
          />

          <input
            name="stock"
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
          />

          <input
            name="idCategoria"
            type="number"
            placeholder="ID Categoría"
            value={form.idCategoria}
            onChange={handleChange}
          />

          <input
            name="idProveedor"
            type="number"
            placeholder="ID Proveedor"
            value={form.idProveedor}
            onChange={handleChange}
          />

        <button className="primaryButton" type="submit">
          {editandoId ? 'Actualizar producto' : 'Guardar producto'}
        </button>
        </form>
      </div>

      <br />

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
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>

            {productos.map(producto => (
              <tr key={producto.idproducto}>
                <td>{producto.idproducto}</td>
                <td><strong>{producto.nombreproducto}</strong></td>
                <td>Q{producto.precio}</td>
                <td>{producto.stock}</td>
                <td>{producto.idcategoria}</td>
                <td>{producto.idproveedor}</td>
                <td>
                  <span className={producto.stock < 20 ? 'badge danger' : 'badge success'}>
                    {producto.stock < 20 ? 'Bajo stock' : 'Disponible'}
                  </span>
                </td>

                <td className="actions">
                  <button 
                    className="secondaryButton"
                    onClick={() => cargarEdicion(producto)}
                  >
                    Editar
                  </button>

                  <button 
                    className="dangerButton"
                    onClick={() => eliminarProducto(producto.idproducto)}
                  >
                    Eliminar
                  </button>
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