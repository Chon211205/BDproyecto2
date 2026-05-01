import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Clientes() {
  const navigate = useNavigate()
  const [clientes, setClientes] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('http://localhost:3000/api/clientes')
      .then(res => res.json())
      .then(data => {
        console.log('Clientes:', data)
        setClientes(Array.isArray(data) ? data : [])
      })
      .catch(err => {
        console.error(err)
        setError('No se pudieron cargar los clientes')
      })
  }, [])

  return (
    <div className="container">
      <div className="pageHeader">
        <div>
          <h1>Clientes</h1>
          <p>Consulta los clientes registrados en la tienda.</p>
        </div>

        <button className="secondaryButton" onClick={() => navigate('/')}>
          ← Dashboard
        </button>
      </div>

      {error && <p>{error}</p>}

      <div className="panel">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre completo</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Estado</th>
            </tr>
          </thead>

          <tbody>
            {clientes.map(cliente => (
              <tr key={cliente.idcliente}>
                <td>{cliente.idcliente}</td>
                <td>
                  <strong>
                    {cliente.nombrecliente} {cliente.apellidocliente}
                  </strong>
                </td>
                <td>{cliente.correocliente}</td>
                <td>{cliente.telefonocliente}</td>
                <td>
                  <span className="badge success">Activo</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Clientes