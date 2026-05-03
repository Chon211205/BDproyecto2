import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ConfirmModal from '../components/ConfirmModal'

function Clientes() {
  const navigate = useNavigate()

  const [clientes, setClientes] = useState([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [modalEliminar, setModalEliminar] = useState(false)
  const [elementoEliminar, setElementoEliminar] = useState(null)

  const [busqueda, setBusqueda] = useState('')
  const [filtroCiudad, setFiltroCiudad] = useState('')

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

  function abrirFormularioNuevo() {
    setMostrarFormulario(true)
    setMensaje('')
    setError('')

    setForm({
      nombreCliente: '',
      apellidoCliente: '',
      correoCliente: '',
      telefonoCliente: ''
    })
  }

  function cancelarFormulario() {
    setMostrarFormulario(false)
    setMensaje('')
    setError('')

    setForm({
      nombreCliente: '',
      apellidoCliente: '',
      correoCliente: '',
      telefonoCliente: ''
    })
  }

  function guardarCliente(e) {
    e.preventDefault()
    setMensaje('')
    setError('')

    fetch('http://localhost:3000/api/clientes', {
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

        setMensaje('Cliente creado correctamente')
        setMostrarFormulario(false)

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

  function abrirModalEliminar(cliente) {
    setElementoEliminar(cliente)
    setModalEliminar(true)
  }

  function cerrarModalEliminar() {
    setElementoEliminar(null)
    setModalEliminar(false)
  }

  function confirmarEliminarCliente() {
    if (!elementoEliminar) return

    setMensaje('')
    setError('')

    fetch(`http://localhost:3000/api/clientes/${elementoEliminar.idcliente}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error)
          cerrarModalEliminar()
          return
        }

        setMensaje('Cliente eliminado correctamente')
        cerrarModalEliminar()
        cargarClientes()
      })
      .catch(() => {
        setError('Error al eliminar cliente')
        cerrarModalEliminar()
      })
  }

  const ciudadesClientes = [
    ...new Set(
      clientes
        .map(cliente => cliente.ciudad)
        .filter(Boolean)
    )
  ]

  const clientesFiltrados = clientes.filter(cliente => {
    const textoBusqueda = busqueda.toLowerCase()

    const coincideBusqueda =
      cliente.nombrecliente?.toLowerCase().includes(textoBusqueda) ||
      cliente.apellidocliente?.toLowerCase().includes(textoBusqueda) ||
      cliente.correocliente?.toLowerCase().includes(textoBusqueda) ||
      cliente.telefonocliente?.toLowerCase().includes(textoBusqueda) ||
      cliente.direccioncliente?.toLowerCase().includes(textoBusqueda) ||
      cliente.ciudad?.toLowerCase().includes(textoBusqueda)

    const coincideCiudad =
      filtroCiudad === '' || cliente.ciudad === filtroCiudad

    return coincideBusqueda && coincideCiudad
  })

  return (
    <div className="container">
      <div className="pageHeader">
        <div>
          <h1>Clientes</h1>
          <p>Administra los clientes registrados en la tienda.</p>
        </div>

        <div className="actions">
          <button className="secondaryButton" onClick={() => navigate('/')}>
            ← Dashboard
          </button>

          <button className="primaryButton" onClick={abrirFormularioNuevo}>
            + Agregar cliente
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
                <h3>Agregar cliente</h3>
                <p>Registra un nuevo cliente dentro del sistema.</p>
              </div>

              <button className="secondaryButton" onClick={cancelarFormulario}>
                Cancelar
              </button>
            </div>

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
                Guardar cliente
              </button>
            </form>
          </div>

          <br />
        </>
      )}

      <div className="toolbar">
        <input
          type="text"
          placeholder="Buscar cliente, correo, teléfono, dirección o ciudad..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <select
          value={filtroCiudad}
          onChange={(e) => setFiltroCiudad(e.target.value)}
        >
          <option value="">Todas las ciudades</option>

          {ciudadesClientes.map(ciudad => (
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
            {clientesFiltrados.map(cliente => (
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
                    onClick={() => navigate(`/clientes/${cliente.idcliente}/editar`)}
                  >
                    Editar
                  </button>

                  <button
                    className="dangerButton"
                    onClick={() => abrirModalEliminar(cliente)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}

            {clientesFiltrados.length === 0 && (
              <tr>
                <td colSpan="8">No se encontraron clientes.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalEliminar && elementoEliminar && (
        <ConfirmModal
          titulo="Eliminar cliente"
          mensaje={`¿Seguro que deseas eliminar al cliente "${elementoEliminar.nombrecliente} ${elementoEliminar.apellidocliente}"? Esta acción no se puede deshacer.`}
          onConfirmar={confirmarEliminarCliente}
          onCancelar={cerrarModalEliminar}
        />
      )}
    </div>
  )
}

export default Clientes