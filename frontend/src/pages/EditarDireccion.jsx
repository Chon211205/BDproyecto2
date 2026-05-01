import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function EditarDireccion() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [clientes, setClientes] = useState([])
  const [form, setForm] = useState({
    direccionCliente: '',
    ciudad: '',
    idCliente: ''
  })

  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('http://localhost:3000/api/clientes')
      .then(res => res.json())
      .then(data => setClientes(Array.isArray(data) ? data : []))
      .catch(() => setError('No se pudieron cargar los clientes'))

    fetch(`http://localhost:3000/api/direcciones/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error)
          return
        }

        setForm({
          direccionCliente: data.direccioncliente,
          ciudad: data.ciudad,
          idCliente: data.idcliente
        })
      })
      .catch(() => setError('No se pudo cargar la dirección'))
  }, [id])

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  function actualizarDireccion(e) {
    e.preventDefault()
    setMensaje('')
    setError('')

    fetch(`http://localhost:3000/api/direcciones/${id}`, {
      method: 'PUT',
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

        setMensaje('Dirección actualizada correctamente')

        setTimeout(() => {
          navigate('/direcciones')
        }, 800)
      })
      .catch(() => setError('Error al actualizar dirección'))
  }

  return (
    <div className="container">
      <div className="pageHeader">
        <div>
          <h1>Editar dirección</h1>
          <p>Modifica la dirección registrada para un cliente.</p>
        </div>

        <button className="secondaryButton" onClick={() => navigate('/direcciones')}>
          ← Volver a direcciones
        </button>
      </div>

      {mensaje && <p className="successMessage">{mensaje}</p>}
      {error && <p className="errorMessage">{error}</p>}

      <div className="panel">
        <h3>Formulario de edición</h3>

        <form className="formGrid" onSubmit={actualizarDireccion}>
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
            Actualizar dirección
          </button>
        </form>
      </div>
    </div>
  )
}

export default EditarDireccion