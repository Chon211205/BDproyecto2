import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Clientes() {
  const navigate = useNavigate()
  const [clientes, setClientes] = useState([])
  const [editandoId, setEditandoId] = useState(null)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    nombreCliente: '',
    apellidoCliente: '',
    correoCliente: '',
    telefonoCliente: ''
  })

  function cargarClientes() {
    fetch('http://localhost:3000/api/clientes')
      .then(res => res.json())
      .then(data => setClientes(Array.isArray(data) ? data : []))
      .catch(() => setError('No se pudieron cargar los clientes'))
  }

  useEffect(() => {
    cargarClientes()
  }, [])

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  function cargarEdicion(cliente) {
    setEditandoId(cliente.idcliente)

    setForm({
      nombreCliente: cliente.nombrecliente,
      apellidoCliente: cliente.apellidocliente,
      correoCliente: cliente.correocliente,
      telefonoCliente: cliente.telefonocliente
    })
  }

  function guardarCliente(e) {
    e.preventDefault()
    setMensaje('')
    setError('')

    const url = editandoId
      ? `http://localhost:3000/api/clientes/${editandoId}`
      : 'http://localhost:3000/api/clientes'

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

        setMensaje(editandoId ? 'Cliente actualizado correctamente' : 'Cliente creado correctamente')
        setEditandoId(null)
        setForm({
          nombreCliente: '',
          apellidoCliente: '',
          correoCliente: '',
          telefonoCliente: ''
        })
        cargarClientes()
      })
      .catch(() => setError('Error al guardar cliente'))
  }

  function eliminarCliente(idCliente) {
    const confirmar = window.confirm('¿Seguro que deseas eliminar este cliente?')

    if (!confirmar) return

    setMensaje('')
    setError('')

    fetch(`http://localhost:3000/api/clientes/${idCliente}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error)
          return
        }

        setMensaje('Cliente eliminado correctamente')
        cargarClientes()
      })
      .catch(() => setError('Error al eliminar cliente'))
  }

  return (
    <div className="container">
      <div className="pageHeader">
        <div>
          <h1>Clientes</h1>
          <p>Administra los clientes registrados en la tienda.</p>
        </div>

        <button className="secondaryButton" onClick={() => navigate('/')}>
          ← Dashboard
        </button>
      </div>

      {mensaje && <p className="successMessage">{mensaje}</p>}
      {error && <p className="errorMessage">{error}</p>}

      <div className="panel">
        <h3>{editandoId ? 'Editar cliente' : 'Agregar cliente'}</h3>

        <form className="formGrid" onSubmit={guardarCliente}>
          <input
            name="nombreCliente"
            placeholder="Nombre"
            value={form.nombreCliente}
            onChange={handleChange}
          />

          <input
            name="apellidoCliente"
            placeholder="Apellido"
            value={form.apellidoCliente}
            onChange={handleChange}
          />

          <input
            name="correoCliente"
            type="email"
            placeholder="Correo"
            value={form.correoCliente}
            onChange={handleChange}
          />

          <input
            name="telefonoCliente"
            placeholder="Teléfono"
            value={form.telefonoCliente}
            onChange={handleChange}
          />

          <button className="primaryButton" type="submit">
            {editandoId ? 'Actualizar cliente' : 'Guardar cliente'}
          </button>
        </form>
      </div>

      <br />

      <div className="panel">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre completo</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Dirección</th>
              <th>Ciudad</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {clientes.map(cliente => (
              <tr key={cliente.idcliente}>
                <td>{cliente.idcliente}</td>

                <td>
                  <strong>
                    {cliente.nombrecliente} {cliente.apellidocliente}
                  </strong>
                </td>

                <td>{cliente.correocliente}</td>
                <td>{cliente.telefonocliente}</td>
                <td>{cliente.direccioncliente || 'Sin dirección'}</td>
                <td>{cliente.ciudad || 'No registrada'}</td>

                <td>
                  <span className="badge success">Activo</span>
                </td>

                <td className="actions">
                  <button
                    className="secondaryButton"
                    onClick={() => cargarEdicion(cliente)}
                  >
                    Editar
                  </button>

                  <button
                    className="dangerButton"
                    onClick={() => eliminarCliente(cliente.idcliente)}
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

export default Clientes