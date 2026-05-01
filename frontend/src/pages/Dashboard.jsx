import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="container">
      <div className="hero">
        <div>
          <h1>Panel de gestión</h1>
          <p>Controla tu inventario y ventas fácilmente</p>
        </div>
      </div>

      <div className="cards">

        <div className="cards">
          <div className="card clickable" onClick={() => navigate('/productos')}>
            <span>Inventario</span>
            <h2>Productos</h2>
            <p>Administrar productos</p>
          </div>

          <div className="card clickable" onClick={() => navigate('/categorias')}>
            <span>Clasificación</span>
            <h2>Categorías</h2>
            <p>Organizar productos</p>
          </div>

          <div className="card clickable" onClick={() => navigate('/proveedores')}>
            <span>Suministro</span>
            <h2>Proveedores</h2>
            <p>Gestionar proveedores</p>
          </div>

          <div className="card clickable" onClick={() => navigate('/clientes')}>
            <span>Clientes</span>
            <h2>Clientes</h2>
            <p>Administrar compradores</p>
          </div>

          <div className="card clickable" onClick={() => navigate('/direcciones')}>
            <span>Ubicación</span>
            <h2>Direcciones</h2>
            <p>Direcciones de clientes</p>
          </div>

          <div className="card clickable" onClick={() => navigate('/empleados')}>
            <span>Personal</span>
            <h2>Empleados</h2>
            <p>Gestionar empleados</p>
          </div>

          <div className="card clickable" onClick={() => navigate('/ventas')}>
            <span>Operaciones</span>
            <h2>Ventas</h2>
            <p>Consultar ventas</p>
          </div>

          <div className="card clickable" onClick={() => navigate('/reportes')}>
            <span>Análisis</span>
            <h2>Reportes</h2>
            <p>Consultas SQL</p>
          </div>
        </div>


      </div>

      <div className="grid">
        <div className="panel">
          <h3>Productos destacados</h3>

          <div className="item">
            <div>
              <strong>Coca Cola</strong>
              <p>Bebidas</p>
            </div>
            <span>Q18</span>
          </div>

          <div className="item">
            <div>
              <strong>Arroz</strong>
              <p>Granos</p>
            </div>
            <span>Q24</span>
          </div>
        </div>

        <div className="panel">
          <h3>Últimas ventas</h3>

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>#1</td>
                <td>Ana</td>
                <td>Q37</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard