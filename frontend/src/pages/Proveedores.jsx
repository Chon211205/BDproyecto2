import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Proveedores() {
  const navigate = useNavigate()
  const [proveedores, setProveedores] = useState([])
  const [editandoId, setEditandoId] = useState(null)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

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

  return (
    <div className="container">
      <div className="pageHeader">
        <div>
          <h1>Proveedores</h1>
          <p>Administra los proveedores asociados a los productos.</p>
        </div>

        <button className="secondaryButton" onClick={() => navigate('/')}>
          ← Dashboard
        </button>
      </div>

      {mensaje && <p className="successMessage">{mensaje}</p>}
      {error && <p className="errorMessage">{error}</p>}

      <div className="panel">
        <h3>{editandoId ? 'Editar proveedor' : 'Agregar proveedor'}</h3>

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
            {editandoId ? 'Actualizar proveedor' : 'Guardar proveedor'}
          </button>

          {editandoId && (
            <button
              className="secondaryButton"
              type="button"
              onClick={cancelarEdicion}
            >
              Cancelar
            </button>
          )}
        </form>
      </div>

      <br />

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
            {proveedores.map(proveedor => (
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
                    onClick={() => cargarEdicion(proveedor)}
                  >
                    Editar
                  </button>

                  <button
                    className="dangerButton"
                    onClick={() => eliminarProveedor(proveedor.idproveedor)}
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

export default Proveedores