import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Empleados() {
  const navigate = useNavigate()
  const [empleados, setEmpleados] = useState([])
  const [editandoId, setEditandoId] = useState(null)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [filtroPuesto, setFiltroPuesto] = useState('')

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

  function abrirFormularioNuevo() {
    setMostrarFormulario(true)
    setMensaje('')
    setError('')

    setForm({
      nombreEmpleado: '',
      apellidoEmpleado: '',
      puesto: ''
    })
  }

  function cancelarFormulario() {
    setMostrarFormulario(false)
    setMensaje('')
    setError('')

    setForm({
      nombreEmpleado: '',
      apellidoEmpleado: '',
      puesto: ''
    })
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
        setMostrarFormulario(false)
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

  const empleadosFiltrados = empleados.filter(empleado => {
    const coincideBusqueda =
      empleado.nombreempleado?.toLowerCase().includes(busqueda.toLowerCase()) ||
      empleado.apellidoempleado?.toLowerCase().includes(busqueda.toLowerCase()) ||
      empleado.puesto?.toLowerCase().includes(busqueda.toLowerCase())

    const coincidePuesto =
      filtroPuesto === '' || empleado.puesto === filtroPuesto

    return coincideBusqueda && coincidePuesto
  })

  return (
    <div className="container">
      <div className="pageHeader">
        <div>
          <h1>Empleados</h1>
          <p>Administra el personal que atiende las ventas de la tienda.</p>
        </div>

        <div className="actions">
          <button className="secondaryButton" onClick={() => navigate('/')}>
            ← Dashboard
          </button>

          <button className="primaryButton" onClick={abrirFormularioNuevo}>
            + Agregar empleado
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
                <h3>Agregar empleado</h3>
                <p>Registra un nuevo empleado dentro del sistema.</p>
              </div>

              <button className="secondaryButton" onClick={cancelarFormulario}>
                Cancelar
              </button>
            </div>

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

              <select
                name="puesto"
                value={form.puesto}
                onChange={handleChange}
              >
                <option value="">Seleccionar puesto</option>
                <option value="Cajero">Cajero</option>
                <option value="Vendedor">Vendedor</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Administrador">Administrador</option>
                <option value="Bodeguero">Bodeguero</option>
              </select>

              <button className="primaryButton" type="submit">
                Guardar empleado
              </button>
            </form>
          </div>

          <br />
        </>
      )}

      <div className="toolbar">
        <input
          type="text"
          placeholder="Buscar empleado o puesto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <select
          value={filtroPuesto}
          onChange={(e) => setFiltroPuesto(e.target.value)}
        >
          <option value="">Todos los puestos</option>
          <option value="Cajero">Cajero</option>
          <option value="Vendedor">Vendedor</option>
          <option value="Supervisor">Supervisor</option>
          <option value="Administrador">Administrador</option>
          <option value="Bodeguero">Bodeguero</option>
        </select>
      </div>

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
            {empleadosFiltrados.map(empleado => (
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
                    onClick={() => navigate(`/empleados/${empleado.idempleado}/editar`)}
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