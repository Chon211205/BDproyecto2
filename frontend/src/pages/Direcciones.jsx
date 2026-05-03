import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ConfirmModal from '../components/ConfirmModal'

function Direcciones() {
  const navigate = useNavigate()

  const [direcciones, setDirecciones] = useState([])
  const [clientes, setClientes] = useState([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [modalEliminar, setModalEliminar] = useState(false)
  const [elementoEliminar, setElementoEliminar] = useState(null)

  const [busqueda, setBusqueda] = useState('')
  const [filtroCiudad, setFiltroCiudad] = useState('')

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

  function abrirFormularioNuevo() {
    setMostrarFormulario(true)
    setMensaje('')
    setError('')

    setForm({
      direccionCliente: '',
      ciudad: '',
      idCliente: ''
    })
  }

  function cancelarFormulario() {
    setMostrarFormulario(false)
    setMensaje('')
    setError('')

    setForm({
      direccionCliente: '',
      ciudad: '',
      idCliente: ''
    })
  }

  function guardarDireccion(e) {
    e.preventDefault()
    setMensaje('')
    setError('')

    fetch('http://localhost:3000/api/direcciones', {
      method: 'POST',
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

        setMensaje('Dirección creada correctamente')
        setMostrarFormulario(false)

        setForm({
          direccionCliente: '',
          ciudad: '',
          idCliente: ''
        })

        cargarDirecciones()
      })
      .catch(() => setError('Error al guardar dirección'))
  }

  function abrirModalEliminar(direccion) {
    setElementoEliminar(direccion)
    setModalEliminar(true)
  }

  function cerrarModalEliminar() {
    setElementoEliminar(null)
    setModalEliminar(false)
  }

  function confirmarEliminarDireccion() {
    if (!elementoEliminar) return

    setMensaje('')
    setError('')

    fetch(`http://localhost:3000/api/direcciones/${elementoEliminar.iddireccion}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error)
          cerrarModalEliminar()
          return
        }

        setMensaje('Dirección eliminada correctamente')
        cerrarModalEliminar()
        cargarDirecciones()
      })
      .catch(() => {
        setError('Error al eliminar dirección')
        cerrarModalEliminar()
      })
  }

  const ciudadesDirecciones = [
    ...new Set(
      direcciones
        .map(direccion => direccion.ciudad)
        .filter(Boolean)
    )
  ]

  const direccionesFiltradas = direcciones.filter(direccion => {
    const textoBusqueda = busqueda.toLowerCase()

    const coincideBusqueda =
      direccion.cliente?.toLowerCase().includes(textoBusqueda) ||
      direccion.direccioncliente?.toLowerCase().includes(textoBusqueda) ||
      direccion.ciudad?.toLowerCase().includes(textoBusqueda)

    const coincideCiudad =
      filtroCiudad === '' || direccion.ciudad === filtroCiudad

    return coincideBusqueda && coincideCiudad
  })

  return (
    <div className="container">
      <div className="pageHeader">
        <div>
          <h1>Direcciones</h1>
          <p>Administra las direcciones registradas para los clientes.</p>
        </div>

        <div className="actions">
          <button className="secondaryButton" onClick={() => navigate('/')}>
            ← Dashboard
          </button>

          <button className="primaryButton" onClick={abrirFormularioNuevo}>
            + Agregar dirección
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
                <h3>Agregar dirección</h3>
                <p>Registra una nueva dirección asociada a un cliente.</p>
              </div>

              <button className="secondaryButton" onClick={cancelarFormulario}>
                Cancelar
              </button>
            </div>

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
                Guardar dirección
              </button>
            </form>
          </div>

          <br />
        </>
      )}

      <div className="toolbar">
        <input
          type="text"
          placeholder="Buscar cliente, dirección o ciudad..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <select
          value={filtroCiudad}
          onChange={(e) => setFiltroCiudad(e.target.value)}
        >
          <option value="">Todas las ciudades</option>

          {ciudadesDirecciones.map(ciudad => (
            <option key={ciudad} value={ciudad}>
              {ciudad}
            </option>
          ))}
        </select>

        <button
          className="secondaryButton"
          onClick={() => {
            setBusqueda('')
            setFiltroCiudad('')
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
              <th>Cliente</th>
              <th>Dirección</th>
              <th>Ciudad</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {direccionesFiltradas.map(direccion => (
              <tr key={direccion.iddireccion}>
                <td>{direccion.iddireccion}</td>
                <td>{direccion.cliente}</td>
                <td>{direccion.direccioncliente}</td>
                <td>{direccion.ciudad}</td>

                <td className="actions">
                  <button
                    className="secondaryButton"
                    onClick={() => navigate(`/direcciones/${direccion.iddireccion}/editar`)}
                  >
                    Editar
                  </button>

                  <button
                    className="dangerButton"
                    onClick={() => abrirModalEliminar(direccion)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}

            {direccionesFiltradas.length === 0 && (
              <tr>
                <td colSpan="5">No se encontraron direcciones.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalEliminar && elementoEliminar && (
        <ConfirmModal
          titulo="Eliminar dirección"
          mensaje={`¿Seguro que deseas eliminar la dirección de "${elementoEliminar.cliente}"? Esta acción no se puede deshacer.`}
          onConfirmar={confirmarEliminarDireccion}
          onCancelar={cerrarModalEliminar}
        />
      )}
    </div>
  )
}

export default Direcciones