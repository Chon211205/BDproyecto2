import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function EditarProveedor() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    nombreProveedor: '',
    telefonoProveedor: '',
    correoProveedor: ''
  })

  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`http://localhost:3000/api/proveedores/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error)
          return
        }

        setForm({
          nombreProveedor: data.nombreproveedor,
          telefonoProveedor: data.telefonoproveedor,
          correoProveedor: data.correoproveedor
        })
      })
      .catch(() => setError('No se pudo cargar el proveedor'))
  }, [id])

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  function actualizarProveedor(e) {
    e.preventDefault()
    setMensaje('')
    setError('')

    fetch(`http://localhost:3000/api/proveedores/${id}`, {
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

        setMensaje('Proveedor actualizado correctamente')

        setTimeout(() => {
          navigate('/proveedores')
        }, 800)
      })
      .catch(() => setError('Error al actualizar proveedor'))
  }

  return (
    <div className="container">
      <div className="pageHeader">
        <div>
          <h1>Editar proveedor</h1>
          <p>Modifica la información del proveedor seleccionado.</p>
        </div>

        <button className="secondaryButton" onClick={() => navigate('/proveedores')}>
          ← Volver a proveedores
        </button>
      </div>

      {mensaje && <p className="successMessage">{mensaje}</p>}
      {error && <p className="errorMessage">{error}</p>}

      <div className="panel">
        <h3>Formulario de edición</h3>

        <form className="formGrid" onSubmit={actualizarProveedor}>
          <input
            name="nombreProveedor"
            placeholder="Nombre del proveedor"
            value={form.nombreProveedor}
            onChange={handleChange}
          />

          <input
            name="telefonoProveedor"
            placeholder="Teléfono"
            value={form.telefonoProveedor}
            onChange={handleChange}
          />

          <input
            name="correoProveedor"
            type="email"
            placeholder="Correo"
            value={form.correoProveedor}
            onChange={handleChange}
          />

          <button className="primaryButton" type="submit">
            Actualizar proveedor
          </button>
        </form>
      </div>
    </div>
  )
}

export default EditarProveedor