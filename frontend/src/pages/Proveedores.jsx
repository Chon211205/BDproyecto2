import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ConfirmModal from '../components/ConfirmModal'

function Proveedores() {
  const navigate = useNavigate()
  const [proveedores, setProveedores] = useState([])
  const [editandoId, setEditandoId] = useState(null)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [modalEliminar, setModalEliminar] = useState(false)
  const [elementoEliminar, setElementoEliminar] = useState(null)

  const [form, setForm] = useState({
    nombreProveedor: '',
    telefonoProveedor: '',
    correoProveedor: ''
  })

  function cargarProveedores() {
    fetch('http://localhost:3000/api/proveedores')
      .then(res => res.json())
      .then(data => setProveedores(Array.isArray(data) ? data : []))
      .catch(() => setError('No se pudieron cargar los proveedores'))
  }

  function abrirFormularioNuevo() {
    setMostrarFormulario(true)
    setMensaje('')
    setError('')

    setForm({
      nombreProveedor: '',
      telefonoProveedor: '',
      correoProveedor: ''
    })
  }

  function abrirModalEliminar(proveedor) {
    setElementoEliminar(proveedor)
    setModalEliminar(true)
  }

  function cerrarModalEliminar() {
    setElementoEliminar(null)
    setModalEliminar(false)
  }

  function confirmarEliminarProveedor() {
    if (!elementoEliminar) return

    setMensaje('')
    setError('')

    fetch(`http://localhost:3000/api/proveedores/${elementoEliminar.idproveedor}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error)
          cerrarModalEliminar()
          return
        }

        setMensaje('Proveedor eliminado correctamente')
        cerrarModalEliminar()
        cargarProveedores()
      })
      .catch(() => {
        setError('Error al eliminar proveedor')
        cerrarModalEliminar()
      })
  }

  function cancelarFormulario() {
    setMostrarFormulario(false)
    setMensaje('')
    setError('')

    setForm({
      nombreProveedor: '',
      telefonoProveedor: '',
      correoProveedor: ''
    })
  }

  useEffect(() => {
    cargarProveedores()
  }, [])

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  function cargarEdicion(proveedor) {
    setEditandoId(proveedor.idproveedor)

    setForm({
      nombreProveedor: proveedor.nombreproveedor,
      telefonoProveedor: proveedor.telefonoproveedor,
      correoProveedor: proveedor.correoproveedor
    })
  }

  function guardarProveedor(e) {
    e.preventDefault()
    setMensaje('')
    setError('')

    const url = editandoId
      ? `http://localhost:3000/api/proveedores/${editandoId}`
      : 'http://localhost:3000/api/proveedores'

    const method = editandoId ? 'PUT' : 'POST'

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error)
          return
        }

        setMensaje(editandoId ? 'Proveedor actualizado correctamente' : 'Proveedor creado correctamente')
        setMostrarFormulario(false)
        setEditandoId(null)
        setForm({
          nombreProveedor: '',
          telefonoProveedor: '',
          correoProveedor: ''
        })
        cargarProveedores()
      })
      .catch(() => setError('Error al guardar proveedor'))
  }

  function eliminarProveedor(idProveedor) {
    const confirmar = window.confirm('¿Seguro que deseas eliminar este proveedor?')

    if (!confirmar) return

    setMensaje('')
    setError('')

    fetch(`http://localhost:3000/api/proveedores/${idProveedor}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error)
          return
        }

        setMensaje('Proveedor eliminado correctamente')
        cargarProveedores()
      })
      .catch(() => setError('Error al eliminar proveedor'))
  }

  function cancelarEdicion() {
    setEditandoId(null)
    setForm({
      nombreProveedor: '',
      telefonoProveedor: '',
      correoProveedor: ''
    })
    setMensaje('')
    setError('')
  }

  const proveedoresFiltrados = proveedores.filter(proveedor =>
    proveedor.nombreproveedor?.toLowerCase().includes(busqueda.toLowerCase()) ||
    proveedor.telefonoproveedor?.toLowerCase().includes(busqueda.toLowerCase()) ||
    proveedor.correoproveedor?.toLowerCase().includes(busqueda.toLowerCase())
  )


  return (
    <div className="container">
      <div className="pageHeader">
        <div>
          <h1>Proveedores</h1>
          <p>Administra los proveedores asociados a los productos.</p>
        </div>

        <div className="actions">
          <button className="secondaryButton" onClick={() => navigate('/')}>
            ← Dashboard
          </button>

          <button className="primaryButton" onClick={abrirFormularioNuevo}>
            + Agregar proveedor
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
                <h3>Agregar proveedor</h3>
                <p>Registra un nuevo proveedor para los productos de la tienda.</p>
              </div>

              <button className="secondaryButton" onClick={cancelarFormulario}>
                Cancelar
              </button>
            </div>

            <form className="formGrid" onSubmit={guardarProveedor}>
              <input
                name="nombreProveedor"
                placeholder="Nombre del proveedor"
                value={form.nombreProveedor}
                onChange={handleChange}
              />

              <input
                name="telefonoProveedor"
                placeholder="Teléfono"
                value={form.telefonoProveedor}
                onChange={handleChange}
              />

              <input
                name="correoProveedor"
                type="email"
                placeholder="Correo"
                value={form.correoProveedor}
                onChange={handleChange}
              />

              <button className="primaryButton" type="submit">
                Guardar proveedor
              </button>
            </form>
          </div>

          <br />
        </>
      )}

      <div className="toolbar">
        <input
          type="text"
          placeholder="Buscar proveedor, teléfono o correo..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <button
          className="secondaryButton"
          onClick={() => setBusqueda('')}
        >
          Limpiar
        </button>
      </div>

      <div className="panel">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Proveedor</th>
              <th>Teléfono</th>
              <th>Correo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {proveedoresFiltrados.map(proveedor => (
              <tr key={proveedor.idproveedor}>
                <td>{proveedor.idproveedor}</td>

                <td>
                  <strong>{proveedor.nombreproveedor}</strong>
                </td>

                <td>{proveedor.telefonoproveedor}</td>
                <td>{proveedor.correoproveedor}</td>

                <td>
                  <span className="badge success">Activo</span>
                </td>

                <td className="actions">
                  <button
                    className="secondaryButton"
                    onClick={() => navigate(`/proveedores/${proveedor.idproveedor}/editar`)}
                  >
                    Editar
                  </button>

                  <button
                    className="dangerButton"
                    onClick={() => abrirModalEliminar(proveedor)}
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
          titulo="Eliminar proveedor"
          mensaje={`¿Seguro que deseas eliminar el proveedor "${elementoEliminar.nombreproveedor}"? Esta acción no se puede deshacer.`}
          onConfirmar={confirmarEliminarProveedor}
          onCancelar={cerrarModalEliminar}
        />
      )}

    </div>
  )
}

export default Proveedores