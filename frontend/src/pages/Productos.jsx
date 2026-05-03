import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ConfirmModal from '../components/ConfirmModal'

function Productos() {
  const navigate = useNavigate()
  const [productos, setProductos] = useState([])
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [editandoId, setEditandoId] = useState(null)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [categorias, setCategorias] = useState([])
  const [proveedores, setProveedores] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState('')
  const [filtroProveedor, setFiltroProveedor] = useState('')
  const [filtroStock, setFiltroStock] = useState('')
  const [modalEliminar, setModalEliminar] = useState(false)
  const [elementoEliminar, setElementoEliminar] = useState(null)


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

  function abrirFormularioNuevo() {
    setEditandoId(null)
    setMostrarFormulario(true)
    setMensaje('')
    setError('')

    setForm({
      nombreProducto: '',
      precio: '',
      stock: '',
      idCategoria: '',
      idProveedor: ''
    })
  }

  function abrirModalEliminar(producto) {
    setElementoEliminar(producto)
    setModalEliminar(true)
  }

  function cerrarModalEliminar() {
    setElementoEliminar(null)
    setModalEliminar(false)
  }

  function confirmarEliminarProducto() {
    if (!elementoEliminar) return

    setMensaje('')
    setError('')

    fetch(`http://localhost:3000/api/productos/${elementoEliminar.idproducto}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error)
          cerrarModalEliminar()
          return
        }

        setMensaje('Producto eliminado correctamente')
        cerrarModalEliminar()
        cargarProductos()
      })
      .catch(() => {
        setError('Error al eliminar producto')
        cerrarModalEliminar()
      })
  }

  useEffect(() => {
    cargarProductos()

    fetch('http://localhost:3000/api/categorias')
      .then(res => res.json())
      .then(data => setCategorias(Array.isArray(data) ? data : []))
      .catch(() => setError('No se pudieron cargar las categorías'))

    fetch('http://localhost:3000/api/proveedores')
      .then(res => res.json())
      .then(data => setProveedores(Array.isArray(data) ? data : []))
      .catch(() => setError('No se pudieron cargar los proveedores'))
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
        setMostrarFormulario(false)
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
    setMostrarFormulario(true)
    setMensaje('')
    setError('')

    setForm({
      nombreProducto: producto.nombreproducto,
      precio: producto.precio,
      stock: producto.stock,
      idCategoria: producto.idcategoria,
      idProveedor: producto.idproveedor
    })
  }

  function cancelarFormulario() {
    setEditandoId(null)
    setMostrarFormulario(false)
    setMensaje('')
    setError('')

    setForm({
      nombreProducto: '',
      precio: '',
      stock: '',
      idCategoria: '',
      idProveedor: ''
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

  const productosFiltrados = productos.filter(producto => {
    const coincideBusqueda =
      producto.nombreproducto?.toLowerCase().includes(busqueda.toLowerCase()) ||
      producto.nombrecategoria?.toLowerCase().includes(busqueda.toLowerCase()) ||
      producto.nombreproveedor?.toLowerCase().includes(busqueda.toLowerCase())

    const coincideCategoria =
      filtroCategoria === '' || String(producto.idcategoria) === filtroCategoria

    const coincideProveedor =
      filtroProveedor === '' || String(producto.idproveedor) === filtroProveedor

    const coincideStock =
      filtroStock === '' ||
      (filtroStock === 'disponible' && producto.stock >= 20) ||
      (filtroStock === 'bajo' && producto.stock < 20)

    return coincideBusqueda && coincideCategoria && coincideProveedor && coincideStock
  })

  return (
    <div className="container">
      <div className="pageHeader">
        <div>
          <h1>Productos</h1>
          <p>Consulta y administra el inventario de la tienda.</p>
        </div>

        <div className="actions">
          <button className="secondaryButton" onClick={() => navigate('/')}>
            ← Dashboard
          </button>

          <button className="primaryButton" onClick={abrirFormularioNuevo}>
            + Agregar producto
          </button>
        </div>
      </div>

      {mensaje && <p className="successMessage">{mensaje}</p>}
      {error && <p className="errorMessage">{error}</p>}

      {mostrarFormulario && (
        <>
          <div className="panel">
            <div className="pageHeader">
              <div>
                <h3>{editandoId ? 'Editar producto' : 'Agregar producto'}</h3>
                <p>
                  {editandoId
                    ? 'Modifica los datos del producto seleccionado.'
                    : 'Registra un nuevo producto en el inventario.'}
                </p>
              </div>

              <button className="secondaryButton" onClick={cancelarFormulario}>
                Cancelar
              </button>
            </div>

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
                {editandoId ? 'Actualizar producto' : 'Guardar producto'}
              </button>
            </form>
          </div>

          <br />
        </>
      )}

      <div className="toolbar">
        <input
          type="text"
          placeholder="Buscar producto, categoría o proveedor..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <select
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          {categorias.map(categoria => (
            <option key={categoria.idcategoria} value={categoria.idcategoria}>
              {categoria.nombrecategoria}
            </option>
          ))}
        </select>

        <select
          value={filtroProveedor}
          onChange={(e) => setFiltroProveedor(e.target.value)}
        >
          <option value="">Todos los proveedores</option>
          {proveedores.map(proveedor => (
            <option key={proveedor.idproveedor} value={proveedor.idproveedor}>
              {proveedor.nombreproveedor}
            </option>
          ))}
        </select>

        <select
          value={filtroStock}
          onChange={(e) => setFiltroStock(e.target.value)}
        >
          <option value="">Todo el stock</option>
          <option value="disponible">Disponible</option>
          <option value="bajo">Bajo stock</option>
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
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
              {productosFiltrados.map(producto => (
              <tr key={producto.idproducto}>
                <td>{producto.idproducto}</td>
                <td>
                  <strong>{producto.nombreproducto}</strong>
                </td>
                <td>Q{producto.precio}</td>
                <td>{producto.stock}</td>
                <td>{producto.nombrecategoria}</td>
                <td>{producto.nombreproveedor}</td>
                <td>
                  <span className={producto.stock < 20 ? 'badge danger' : 'badge success'}>
                    {producto.stock < 20 ? 'Bajo stock' : 'Disponible'}
                  </span>
                </td>

                <td className="actions">
                  
                <button
                  className="secondaryButton"
                  onClick={() => navigate(`/productos/${producto.idproducto}/editar`)}
                >
                  Editar
                </button>

                  <button
                    className="dangerButton"
                    onClick={() => abrirModalEliminar(producto)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalEliminar && elementoEliminar && (
        <ConfirmModal
          titulo="Eliminar producto"
          mensaje={`¿Seguro que deseas eliminar el producto "${elementoEliminar.nombreproducto}"? Esta acción no se puede deshacer.`}
          onConfirmar={confirmarEliminarProducto}
          onCancelar={cerrarModalEliminar}
        />
      )}
      
    </div>
  )
}

export default Productos