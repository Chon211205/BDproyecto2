import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function EditarProducto() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    nombreProducto: '',
    precio: '',
    stock: '',
    idCategoria: '',
    idProveedor: ''
  })

  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [categorias, setCategorias] = useState([])
  const [proveedores, setProveedores] = useState([])

  useEffect(() => {
    fetch(`http://localhost:3000/api/productos/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error)
          return
        }

    fetch('http://localhost:3000/api/categorias')
      .then(res => res.json())
      .then(data => setCategorias(Array.isArray(data) ? data : []))
      .catch(() => setError('No se pudieron cargar las categorías'))

    fetch('http://localhost:3000/api/proveedores')
      .then(res => res.json())
      .then(data => setProveedores(Array.isArray(data) ? data : []))
      .catch(() => setError('No se pudieron cargar los proveedores'))

        setForm({
          nombreProducto: data.nombreproducto,
          precio: data.precio,
          stock: data.stock,
          idCategoria: data.idcategoria,
          idProveedor: data.idproveedor
        })
      })
      .catch(() => setError('No se pudo cargar el producto'))
  }, [id])

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  function actualizarProducto(e) {
    e.preventDefault()
    setMensaje('')
    setError('')

    fetch(`http://localhost:3000/api/productos/${id}`, {
      method: 'PUT',
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

        setMensaje('Producto actualizado correctamente')

        setTimeout(() => {
          navigate('/productos')
        }, 800)
      })
      .catch(() => setError('Error al actualizar producto'))
  }

  return (
    <div className="container">
      <div className="pageHeader">
        <div>
          <h1>Editar producto</h1>
          <p>Modifica la información del producto seleccionado.</p>
        </div>

        <button className="secondaryButton" onClick={() => navigate('/productos')}>
          ← Volver a productos
        </button>
      </div>

      {mensaje && <p className="successMessage">{mensaje}</p>}
      {error && <p className="errorMessage">{error}</p>}

      <div className="panel">
        <h3>Formulario de edición</h3>

        <form className="formGrid" onSubmit={actualizarProducto}>
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

          <select
            name="idCategoria"
            value={form.idCategoria}
            onChange={handleChange}
          >
            <option value="">Seleccionar categoría</option>
            {categorias.map(categoria => (
              <option key={categoria.idcategoria} value={categoria.idcategoria}>
                {categoria.nombrecategoria}
              </option>
            ))}
          </select>

          <select
            name="idProveedor"
            value={form.idProveedor}
            onChange={handleChange}
          >
            <option value="">Seleccionar proveedor</option>
            {proveedores.map(proveedor => (
              <option key={proveedor.idproveedor} value={proveedor.idproveedor}>
                {proveedor.nombreproveedor}
              </option>
            ))}
          </select>

          <button className="primaryButton" type="submit">
            Actualizar producto
          </button>
        </form>
      </div>
    </div>
  )
}

export default EditarProducto