import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Direcciones() {
  const navigate = useNavigate()

  const [direcciones, setDirecciones] = useState([])
  const [clientes, setClientes] = useState([])
  const [editandoId, setEditandoId] = useState(null)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    direccionCliente: '',
    ciudad: '',
    idCliente: ''
  })

  function cargarDirecciones() {
    fetch('http://localhost:3000/api/direcciones')
      .then(res => res.json())
      .then(data => setDirecciones(Array.isArray(data) ? data : []))
      .catch(() => setError('No se pudieron cargar las direcciones'))
  }

  function cargarClientes() {
    fetch('http://localhost:3000/api/clientes')
      .then(res => res.json())
      .then(data => setClientes(Array.isArray(data) ? data : []))
      .catch(() => setError('No se pudieron cargar los clientes'))
  }

  useEffect(() => {
    cargarDirecciones()
    cargarClientes()
  }, [])

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  function cargarEdicion(direccion) {
    setEditandoId(direccion.iddireccion)

    setForm({
      direccionCliente: direccion.direccioncliente,
      ciudad: direccion.ciudad,
      idCliente: direccion.idcliente
    })
  }

  function guardarDireccion(e) {
    e.preventDefault()
    setMensaje('')
    setError('')

    const url = editandoId
      ? `http://localhost:3000/api/direcciones/${editandoId}`
      : 'http://localhost:3000/api/direcciones'

    const method = editandoId ? 'PUT' : 'POST'

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        direccionCliente: form.direccionCliente,
        ciudad: form.ciudad,
        idCliente: Number(form.idCliente)
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error)
          return
        }

        setMensaje(editandoId ? 'Dirección actualizada correctamente' : 'Dirección creada correctamente')
        setEditandoId(null)
        setForm({
          direccionCliente: '',
          ciudad: '',
          idCliente: ''
        })
        cargarDirecciones()
      })
      .catch(() => setError('Error al guardar dirección'))
  }

  function eliminarDireccion(idDireccion) {
    const confirmar = window.confirm('¿Seguro que deseas eliminar esta dirección?')

    if (!confirmar) return

    setMensaje('')
    setError('')

    fetch(`http://localhost:3000/api/direcciones/${idDireccion}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error)
          return
        }

        setMensaje('Dirección eliminada correctamente')
        cargarDirecciones()
      })
      .catch(() => setError('Error al eliminar dirección'))
  }

  function cancelarEdicion() {
    setEditandoId(null)
    setForm({
      direccionCliente: '',
      ciudad: '',
      idCliente: ''
    })
    setMensaje('')
    setError('')
  }

  return (
    <div className="container">
      <div className="pageHeader">
        <div>
          <h1>Direcciones</h1>
          <p>Administra las direcciones registradas para los clientes.</p>
        </div>

        <button className="secondaryButton" onClick={() => navigate('/')}>
          ← Dashboard
        </button>
      </div>

      {mensaje && <p className="successMessage">{mensaje}</p>}
      {error && <p className="errorMessage">{error}</p>}

      <div className="panel">
        <h3>{editandoId ? 'Editar dirección' : 'Agregar dirección'}</h3>

        <form className="formGrid" onSubmit={guardarDireccion}>
          <input
            name="direccionCliente"
            placeholder="Dirección"
            value={form.direccionCliente}
            onChange={handleChange}
          />

          <input
            name="ciudad"
            placeholder="Ciudad"
            value={form.ciudad}
            onChange={handleChange}
          />

          <select
            name="idCliente"
            value={form.idCliente}
            onChange={handleChange}
          >
            <option value="">Seleccionar cliente</option>

            {clientes.map(cliente => (
              <option key={cliente.idcliente} value={cliente.idcliente}>
                {cliente.nombrecliente} {cliente.apellidocliente}
              </option>
            ))}
          </select>

          <button className="primaryButton" type="submit">
            {editandoId ? 'Actualizar dirección' : 'Guardar dirección'}
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
              <th>Cliente</th>
              <th>Dirección</th>
              <th>Ciudad</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {direcciones.map(direccion => (
              <tr key={direccion.iddireccion}>
                <td>{direccion.iddireccion}</td>
                <td>{direccion.cliente}</td>
                <td>{direccion.direccioncliente}</td>
                <td>{direccion.ciudad}</td>

                <td className="actions">
                  <button
                    className="secondaryButton"
                    onClick={() => cargarEdicion(direccion)}
                  >
                    Editar
                  </button>

                  <button
                    className="dangerButton"
                    onClick={() => eliminarDireccion(direccion.iddireccion)}
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

export default Direcciones