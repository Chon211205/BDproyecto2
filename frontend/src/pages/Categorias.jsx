import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Categorias() {
  const navigate = useNavigate()
  const [categorias, setCategorias] = useState([])
  const [editandoId, setEditandoId] = useState(null)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  const [form, setForm] = useState({
    nombreCategoria: '',
    descripcionCategoria: ''
  })

  function cargarCategorias() {
    fetch('http://localhost:3000/api/categorias')
      .then(res => res.json())
      .then(data => setCategorias(Array.isArray(data) ? data : []))
      .catch(() => setError('No se pudieron cargar las categorías'))
  }

  function abrirFormularioNuevo() {
    setMostrarFormulario(true)
    setMensaje('')
    setError('')
    setForm({
      nombreCategoria: '',
      descripcionCategoria: ''
    })
  }

  function cancelarFormulario() {
    setMostrarFormulario(false)
    setMensaje('')
    setError('')
    setForm({
      nombreCategoria: '',
      descripcionCategoria: ''
    })
  }

  useEffect(() => {
    cargarCategorias()
  }, [])

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  function cargarEdicion(categoria) {
    setEditandoId(categoria.idcategoria)

    setForm({
      nombreCategoria: categoria.nombrecategoria,
      descripcionCategoria: categoria.descripcioncategoria
    })
  }

  function guardarCategoria(e) {
    e.preventDefault()
    setMensaje('')
    setError('')

    const url = editandoId
      ? `http://localhost:3000/api/categorias/${editandoId}`
      : 'http://localhost:3000/api/categorias'

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

        setMensaje(editandoId ? 'Categoría actualizada correctamente' : 'Categoría creada correctamente')
        setMostrarFormulario(false)
        setEditandoId(null)
        setForm({
          nombreCategoria: '',
          descripcionCategoria: ''
        })
        cargarCategorias()
      })
      .catch(() => setError('Error al guardar categoría'))
  }

  function eliminarCategoria(idCategoria) {
    const confirmar = window.confirm('¿Seguro que deseas eliminar esta categoría?')

    if (!confirmar) return

    setMensaje('')
    setError('')

    fetch(`http://localhost:3000/api/categorias/${idCategoria}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error)
          return
        }

        setMensaje('Categoría eliminada correctamente')
        cargarCategorias()
      })
      .catch(() => setError('Error al eliminar categoría'))
  }

  function cancelarEdicion() {
    setEditandoId(null)
    setForm({
      nombreCategoria: '',
      descripcionCategoria: ''
    })
    setMensaje('')
    setError('')
  }

  return (
    <div className="container">
      <div className="pageHeader">
        <div>
          <h1>Categorías</h1>
          <p>Administra las categorías utilizadas para organizar los productos.</p>
        </div>

        <div className="actions">
          <button className="secondaryButton" onClick={() => navigate('/')}>
            ← Dashboard
          </button>

          <button className="primaryButton" onClick={abrirFormularioNuevo}>
            + Agregar categoría
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
                <h3>Agregar categoría</h3>
                <p>Registra una nueva categoría para organizar los productos.</p>
              </div>

              <button className="secondaryButton" onClick={cancelarFormulario}>
                Cancelar
              </button>
            </div>

            <form className="formGrid" onSubmit={guardarCategoria}>
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
                Guardar categoría
              </button>
            </form>
          </div>

          <br />
        </>
      )}

      <div className="panel">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Categoría</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {categorias.map(categoria => (
              <tr key={categoria.idcategoria}>
                <td>{categoria.idcategoria}</td>

                <td>
                  <strong>{categoria.nombrecategoria}</strong>
                </td>

                <td>{categoria.descripcioncategoria}</td>

                <td>
                  <span className="badge success">Activa</span>
                </td>

                <td className="actions">
                  <button
                    className="secondaryButton"
                    onClick={() => navigate(`/categorias/${categoria.idcategoria}/editar`)}
                  >
                    Editar
                  </button>

                  <button
                    className="dangerButton"
                    onClick={() => eliminarCategoria(categoria.idcategoria)}
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

export default Categorias