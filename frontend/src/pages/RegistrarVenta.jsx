import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function RegistrarVenta() {
  const navigate = useNavigate()

  const [clientes, setClientes] = useState([])
  const [empleados, setEmpleados] = useState([])
  const [metodosPago, setMetodosPago] = useState([])
  const [productos, setProductos] = useState([])

  const [form, setForm] = useState({
    idCliente: '',
    idEmpleado: '',
    idMetodoPago: '',
    idProducto: '',
    cantidad: ''
  })

  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('http://localhost:3000/api/clientes')
      .then(res => res.json())
      .then(data => setClientes(Array.isArray(data) ? data : []))

    fetch('http://localhost:3000/api/empleados')
      .then(res => res.json())
      .then(data => setEmpleados(Array.isArray(data) ? data : []))

    fetch('http://localhost:3000/api/metodos-pago')
      .then(res => res.json())
      .then(data => setMetodosPago(Array.isArray(data) ? data : []))

    fetch('http://localhost:3000/api/productos')
      .then(res => res.json())
      .then(data => setProductos(Array.isArray(data) ? data : []))
  }, [])

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  function registrarVenta(e) {
    e.preventDefault()
    setMensaje('')
    setError('')

    fetch('http://localhost:3000/api/ventas/registrar-transaccion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        idCliente: Number(form.idCliente),
        idEmpleado: Number(form.idEmpleado),
        idMetodoPago: Number(form.idMetodoPago),
        productos: [
          {
            idProducto: Number(form.idProducto),
            cantidad: Number(form.cantidad)
          }
        ]
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(`${data.error} ${data.detalle ? '- ' + data.detalle : ''}`)
          return
        }

        setMensaje(`Venta registrada correctamente. ID Venta: ${data.idVenta}. Total: Q${data.total}`)
        setForm({
          idCliente: '',
          idEmpleado: '',
          idMetodoPago: '',
          idProducto: '',
          cantidad: ''
        })
      })
      .catch(() => setError('No se pudo conectar con el backend'))
  }

  return (
    <div className="container">
      <div className="pageHeader">
        <div>
          <h1>Registrar venta</h1>
          <p>Esta operación usa una transacción con COMMIT y ROLLBACK.</p>
        </div>

        <button className="secondaryButton" onClick={() => navigate('/ventas')}>
          ← Volver a ventas
        </button>
      </div>

      {mensaje && <p className="successMessage">{mensaje}</p>}
      {error && <p className="errorMessage">{error}</p>}

      <div className="panel">
        <h3>Nueva venta con transacción</h3>

        <form className="formGrid" onSubmit={registrarVenta}>
          <select name="idCliente" value={form.idCliente} onChange={handleChange}>
            <option value="">Seleccionar cliente</option>
            {clientes.map(cliente => (
              <option key={cliente.idcliente} value={cliente.idcliente}>
                {cliente.nombrecliente} {cliente.apellidocliente}
              </option>
            ))}
          </select>

          <select name="idEmpleado" value={form.idEmpleado} onChange={handleChange}>
            <option value="">Seleccionar empleado</option>
            {empleados.map(empleado => (
              <option key={empleado.idempleado} value={empleado.idempleado}>
                {empleado.nombreempleado} {empleado.apellidoempleado}
              </option>
            ))}
          </select>

          <select name="idMetodoPago" value={form.idMetodoPago} onChange={handleChange}>
            <option value="">Seleccionar método de pago</option>
            {metodosPago.map(metodo => (
              <option key={metodo.idmetodopago} value={metodo.idmetodopago}>
                {metodo.tipometodopago}
              </option>
            ))}
          </select>

          <select name="idProducto" value={form.idProducto} onChange={handleChange}>
            <option value="">Seleccionar producto</option>
            {productos.map(producto => (
              <option key={producto.idproducto} value={producto.idproducto}>
                {producto.nombreproducto} - Stock: {producto.stock}
              </option>
            ))}
          </select>

          <input
            name="cantidad"
            type="number"
            placeholder="Cantidad"
            value={form.cantidad}
            onChange={handleChange}
          />

          <button className="primaryButton" type="submit">
            Registrar venta
          </button>
        </form>
      </div>
    </div>
  )
}

export default RegistrarVenta