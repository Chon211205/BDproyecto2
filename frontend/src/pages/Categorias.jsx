import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Categorias() {
  const navigate = useNavigate()
  const [categorias, setCategorias] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('http://localhost:3000/api/categorias')
      .then(res => res.json())
      .then(data => {
        console.log('Categorías:', data)
        setCategorias(Array.isArray(data) ? data : [])
      })
      .catch(err => {
        console.error(err)
        setError('No se pudieron cargar las categorías')
      })
  }, [])

  return (
    <div className="container">
      <div className="pageHeader">
        <div>
          <h1>Categorías</h1>
          <p>Consulta las categorías utilizadas para organizar los productos.</p>
        </div>

        <button className="secondaryButton" onClick={() => navigate('/')}>
          ← Dashboard
        </button>
      </div>

      {error && <p className="errorMessage">{error}</p>}

      <div className="panel">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Categoría</th>
              <th>Descripción</th>
              <th>Estado</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Categorias