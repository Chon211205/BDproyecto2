import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function EditarEmpleado() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    nombreEmpleado: '',
    apellidoEmpleado: '',
    puesto: ''
  })

  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`http://localhost:3000/api/empleados/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error)
          return
        }

        setForm({
          nombreEmpleado: data.nombreempleado,
          apellidoEmpleado: data.apellidoempleado,
          puesto: data.puesto
        })
      })
      .catch(() => setError('No se pudo cargar el empleado'))
  }, [id])

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  function actualizarEmpleado(e) {
    e.preventDefault()
    setMensaje('')
    setError('')

    fetch(`http://localhost:3000/api/empleados/${id}`, {
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

        setMensaje('Empleado actualizado correctamente')

        setTimeout(() => {
          navigate('/empleados')
        }, 800)
      })
      .catch(() => setError('Error al actualizar empleado'))
  }

  return (
    <div className="container">
      <div className="pageHeader">
        <div>
          <h1>Editar empleado</h1>
          <p>Modifica la información del empleado seleccionado.</p>
        </div>

        <button className="secondaryButton" onClick={() => navigate('/empleados')}>
          ← Volver a empleados
        </button>
      </div>

      {mensaje && <p className="successMessage">{mensaje}</p>}
      {error && <p className="errorMessage">{error}</p>}

      <div className="panel">
        <h3>Formulario de edición</h3>

        <form className="formGrid" onSubmit={actualizarEmpleado}>
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
            Actualizar empleado
          </button>
        </form>
      </div>
    </div>
  )
}

export default EditarEmpleado