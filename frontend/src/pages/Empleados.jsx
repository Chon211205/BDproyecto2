import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ConfirmModal from '../components/ConfirmModal'

function Empleados() {
  const navigate = useNavigate()

  const [empleados, setEmpleados] = useState([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [modalEliminar, setModalEliminar] = useState(false)
  const [elementoEliminar, setElementoEliminar] = useState(null)

  const [busqueda, setBusqueda] = useState('')
  const [filtroPuesto, setFiltroPuesto] = useState('')

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

  function guardarEmpleado(e) {
    e.preventDefault()
    setMensaje('')
    setError('')

    fetch('http://localhost:3000/api/empleados', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error)
          return
        }

        setMensaje('Empleado creado correctamente')
        setMostrarFormulario(false)

        setForm({
          nombreEmpleado: '',
          apellidoEmpleado: '',
          puesto: ''
        })

        cargarEmpleados()
      })
      .catch(() => setError('Error al guardar empleado'))
  }

  function abrirModalEliminar(empleado) {
    setElementoEliminar(empleado)
    setModalEliminar(true)
  }

  function cerrarModalEliminar() {
    setElementoEliminar(null)
    setModalEliminar(false)
  }

  function confirmarEliminarEmpleado() {
    if (!elementoEliminar) return

    setMensaje('')
    setError('')

    fetch(`http://localhost:3000/api/empleados/${elementoEliminar.idempleado}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error)
          cerrarModalEliminar()
          return
        }

        setMensaje('Empleado eliminado correctamente')
        cerrarModalEliminar()
        cargarEmpleados()
      })
      .catch(() => {
        setError('Error al eliminar empleado')
        cerrarModalEliminar()
      })
  }

  const empleadosFiltrados = empleados.filter(empleado => {
    const textoBusqueda = busqueda.toLowerCase()

    const coincideBusqueda =
      empleado.nombreempleado?.toLowerCase().includes(textoBusqueda) ||
      empleado.apellidoempleado?.toLowerCase().includes(textoBusqueda) ||
      empleado.puesto?.toLowerCase().includes(textoBusqueda)

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

        <button
          className="secondaryButton"
          onClick={() => {
            setBusqueda('')
            setFiltroPuesto('')
          }}
        >
          Limpiar
        </button>
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
                    onClick={() => abrirModalEliminar(empleado)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}

            {empleadosFiltrados.length === 0 && (
              <tr>
                <td colSpan="5">No se encontraron empleados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalEliminar && elementoEliminar && (
        <ConfirmModal
          titulo="Eliminar empleado"
          mensaje={`¿Seguro que deseas eliminar al empleado "${elementoEliminar.nombreempleado} ${elementoEliminar.apellidoempleado}"? Esta acción no se puede deshacer.`}
          onConfirmar={confirmarEliminarEmpleado}
          onCancelar={cerrarModalEliminar}
        />
      )}
    </div>
  )
}

export default Empleados