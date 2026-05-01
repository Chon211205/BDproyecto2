import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Empleados() {
  const navigate = useNavigate()
  const [empleados, setEmpleados] = useState([])
  const [editandoId, setEditandoId] = useState(null)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    nombreEmpleado: '',
    apellidoEmpleado: '',
    puesto: ''
  })

  function cargarEmpleados() {
    fetch('http://localhost:3000/api/empleados')
      .then(res => res.json())
      .then(data => setEmpleados(Array.isArray(data) ? data : []))
      .catch(() => setError('No se pudieron cargar los empleados'))
  }

  useEffect(() => {
    cargarEmpleados()
  }, [])

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  function cargarEdicion(empleado) {
    setEditandoId(empleado.idempleado)

    setForm({
      nombreEmpleado: empleado.nombreempleado,
      apellidoEmpleado: empleado.apellidoempleado,
      puesto: empleado.puesto
    })
  }

  function guardarEmpleado(e) {
    e.preventDefault()
    setMensaje('')
    setError('')

    const url = editandoId
      ? `http://localhost:3000/api/empleados/${editandoId}`
      : 'http://localhost:3000/api/empleados'

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

        setMensaje(editandoId ? 'Empleado actualizado correctamente' : 'Empleado creado correctamente')
        setEditandoId(null)
        setForm({
          nombreEmpleado: '',
          apellidoEmpleado: '',
          puesto: ''
        })
        cargarEmpleados()
      })
      .catch(() => setError('Error al guardar empleado'))
  }

  function eliminarEmpleado(idEmpleado) {
    const confirmar = window.confirm('¿Seguro que deseas eliminar este empleado?')

    if (!confirmar) return

    setMensaje('')
    setError('')

    fetch(`http://localhost:3000/api/empleados/${idEmpleado}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error)
          return
        }

        setMensaje('Empleado eliminado correctamente')
        cargarEmpleados()
      })
      .catch(() => setError('Error al eliminar empleado'))
  }

  function cancelarEdicion() {
    setEditandoId(null)
    setForm({
      nombreEmpleado: '',
      apellidoEmpleado: '',
      puesto: ''
    })
    setMensaje('')
    setError('')
  }

  return (
    <div className="container">
      <div className="pageHeader">
        <div>
          <h1>Empleados</h1>
          <p>Administra el personal que atiende las ventas de la tienda.</p>
        </div>

        <button className="secondaryButton" onClick={() => navigate('/')}>
          ← Dashboard
        </button>
      </div>

      {mensaje && <p className="successMessage">{mensaje}</p>}
      {error && <p className="errorMessage">{error}</p>}

      <div className="panel">
        <h3>{editandoId ? 'Editar empleado' : 'Agregar empleado'}</h3>

        <form className="formGrid" onSubmit={guardarEmpleado}>
          <input
            name="nombreEmpleado"
            placeholder="Nombre"
            value={form.nombreEmpleado}
            onChange={handleChange}
          />

          <input
            name="apellidoEmpleado"
            placeholder="Apellido"
            value={form.apellidoEmpleado}
            onChange={handleChange}
          />

          <input
            name="puesto"
            placeholder="Puesto"
            value={form.puesto}
            onChange={handleChange}
          />

          <button className="primaryButton" type="submit">
            {editandoId ? 'Actualizar empleado' : 'Guardar empleado'}
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
              <th>Nombre completo</th>
              <th>Puesto</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {empleados.map(empleado => (
              <tr key={empleado.idempleado}>
                <td>{empleado.idempleado}</td>
                <td>
                  <strong>
                    {empleado.nombreempleado} {empleado.apellidoempleado}
                  </strong>
                </td>
                <td>{empleado.puesto}</td>
                <td>
                  <span className="badge success">Activo</span>
                </td>
                <td className="actions">
                  <button
                    className="secondaryButton"
                    onClick={() => cargarEdicion(empleado)}
                  >
                    Editar
                  </button>

                  <button
                    className="dangerButton"
                    onClick={() => eliminarEmpleado(empleado.idempleado)}
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

export default Empleados