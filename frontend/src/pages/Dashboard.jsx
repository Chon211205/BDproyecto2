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

        <div className="card clickable" onClick={() => navigate('/productos')}>
          <span>Productos</span>
          <h2>25</h2>
        </div>

        <div className="card clickable" onClick={() => navigate('/clientes')}>
          <span>Clientes</span>
          <h2>25</h2>
        </div>

        <div className="card clickable" onClick={() => navigate('/ventas')}>
          <span>Ventas</span>
          <h2>25</h2>
        </div>

        <div className="card clickable" onClick={() => navigate('/reportes')}>
          <span>Total vendido</span>
          <h2>Q850</h2>
        </div>

        <div className="card clickable" onClick={() => navigate('/categorias')}>
          <span>Categorías</span>
          <h2>25</h2>
        </div>

        <div className="card clickable" onClick={() => navigate('/proveedores')}>
          <span>Proveedores</span>
          <h2>25</h2>
        </div>

        <div className="card clickable" onClick={() => navigate('/empleados')}>
          <span>Empleados</span>
          <h2>25</h2>
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