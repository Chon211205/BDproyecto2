import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function EditarCategoria() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    nombreCategoria: '',
    descripcionCategoria: ''
  })

  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`http://localhost:3000/api/categorias/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error)
          return
        }

        setForm({
          nombreCategoria: data.nombrecategoria,
          descripcionCategoria: data.descripcioncategoria
        })
      })
      .catch(() => setError('No se pudo cargar la categoría'))
  }, [id])

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  function actualizarCategoria(e) {
    e.preventDefault()
    setMensaje('')
    setError('')

    fetch(`http://localhost:3000/api/categorias/${id}`, {
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

        setMensaje('Categoría actualizada correctamente')

        setTimeout(() => {
          navigate('/categorias')
        }, 800)
      })
      .catch(() => setError('Error al actualizar categoría'))
  }

  return (
    <div className="container">
      <div className="pageHeader">
        <div>
          <h1>Editar categoría</h1>
          <p>Modifica la información de la categoría seleccionada.</p>
        </div>

        <button className="secondaryButton" onClick={() => navigate('/categorias')}>
          ← Volver a categorías
        </button>
      </div>

      {mensaje && <p className="successMessage">{mensaje}</p>}
      {error && <p className="errorMessage">{error}</p>}

      <div className="panel">
        <h3>Formulario de edición</h3>

        <form className="formGrid" onSubmit={actualizarCategoria}>
          <input
            name="nombreCategoria"
            placeholder="Nombre de la categoría"
            value={form.nombreCategoria}
            onChange={handleChange}
          />

          <input
            name="descripcionCategoria"
            placeholder="Descripción"
            value={form.descripcionCategoria}
            onChange={handleChange}
          />

          <button className="primaryButton" type="submit">
            Actualizar categoría
          </button>
        </form>
      </div>
    </div>
  )
}

export default EditarCategoria