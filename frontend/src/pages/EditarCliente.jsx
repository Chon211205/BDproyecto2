import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function EditarCliente() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    nombreCliente: '',
    apellidoCliente: '',
    correoCliente: '',
    telefonoCliente: ''
  })

  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`http://localhost:3000/api/clientes/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error)
          return
        }

        setForm({
          nombreCliente: data.nombrecliente,
          apellidoCliente: data.apellidocliente,
          correoCliente: data.correocliente,
          telefonoCliente: data.telefonocliente
        })
      })
      .catch(() => setError('No se pudo cargar el cliente'))
  }, [id])

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  function actualizarCliente(e) {
    e.preventDefault()
    setMensaje('')
    setError('')

    fetch(`http://localhost:3000/api/clientes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error)
          return
        }

        setMensaje('Cliente actualizado correctamente')

        setTimeout(() => {
          navigate('/clientes')
        }, 800)
      })
      .catch(() => setError('Error al actualizar cliente'))
  }

  return (
    <div className="container">
      <div className="pageHeader">
        <div>
          <h1>Editar cliente</h1>
          <p>Modifica la información del cliente seleccionado.</p>
        </div>

        <button className="secondaryButton" onClick={() => navigate('/clientes')}>
          ← Volver a clientes
        </button>
      </div>

      {mensaje && <p className="successMessage">{mensaje}</p>}
      {error && <p className="errorMessage">{error}</p>}

      <div className="panel">
        <h3>Formulario de edición</h3>

        <form className="formGrid" onSubmit={actualizarCliente}>
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
            Actualizar cliente
          </button>
        </form>
      </div>
    </div>
  )
}

export default EditarCliente