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

  const [productosSeleccionados, setProductosSeleccionados] = useState([])
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

  function agregarProducto() {
    setMensaje('')
    setError('')

    if (!form.idProducto || !form.cantidad) {
      setError('Selecciona un producto y escribe una cantidad')
      return
    }

    const productoEncontrado = productos.find(
      producto => producto.idproducto === Number(form.idProducto)
    )

    if (!productoEncontrado) {
      setError('Producto no encontrado')
      return
    }

    if (Number(form.cantidad) <= 0) {
      setError('La cantidad debe ser mayor a 0')
      return
    }

    const yaExiste = productosSeleccionados.find(
      producto => producto.idProducto === Number(form.idProducto)
    )

    if (yaExiste) {
      setError('Ese producto ya fue agregado. Elimínalo y vuelve a agregarlo si quieres cambiar la cantidad.')
      return
    }

    setProductosSeleccionados([
      ...productosSeleccionados,
      {
        idProducto: productoEncontrado.idproducto,
        nombreProducto: productoEncontrado.nombreproducto,
        stock: productoEncontrado.stock,
        precio: productoEncontrado.precio,
        cantidad: Number(form.cantidad)
      }
    ])

    setForm({
      ...form,
      idProducto: '',
      cantidad: ''
    })
  }

  function quitarProducto(idProducto) {
    setProductosSeleccionados(
      productosSeleccionados.filter(producto => producto.idProducto !== idProducto)
    )
  }

  function registrarVenta(e) {
    e.preventDefault()
    setMensaje('')
    setError('')

    if (!form.idCliente || !form.idEmpleado || !form.idMetodoPago) {
      setError('Cliente, empleado y método de pago son obligatorios')
      return
    }

    if (productosSeleccionados.length === 0) {
      setError('Debes agregar al menos un producto a la venta')
      return
    }

    fetch('http://localhost:3000/api/ventas/registrar-transaccion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        idCliente: Number(form.idCliente),
        idEmpleado: Number(form.idEmpleado),
        idMetodoPago: Number(form.idMetodoPago),
        productos: productosSeleccionados.map(producto => ({
          idProducto: producto.idProducto,
          cantidad: producto.cantidad
        }))
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(`${data.error} ${data.detalle ? '- ' + data.detalle : ''}`)
          return
        }

        setMensaje(`Venta registrada correctamente. ID Venta: ${data.idVenta}. Total: Q${Number(data.total).toFixed(2)}`)

        setForm({
          idCliente: '',
          idEmpleado: '',
          idMetodoPago: '',
          idProducto: '',
          cantidad: ''
        })

        setProductosSeleccionados([])
      })
      .catch(() => setError('No se pudo conectar con el backend'))
  }

  const totalEstimado = productosSeleccionados.reduce((total, producto) => {
    return total + Number(producto.precio) * Number(producto.cantidad)
  }, 0)

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
        <h3>Datos generales de la venta</h3>

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
        </form>
      </div>

      <br />

      <div className="panel">
        <h3>Agregar productos a la venta</h3>

        <div className="formGrid">
          <select name="idProducto" value={form.idProducto} onChange={handleChange}>
            <option value="">Seleccionar producto</option>
            {productos.map(producto => (
              <option key={producto.idproducto} value={producto.idproducto}>
                {producto.nombreproducto} - Stock: {producto.stock} - Q{producto.precio}
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

          <button className="primaryButton" type="button" onClick={agregarProducto}>
            Agregar producto
          </button>
        </div>
      </div>

      <br />

      <div className="panel">
        <h3>Productos seleccionados</h3>

        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {productosSeleccionados.map(producto => (
              <tr key={producto.idProducto}>
                <td>{producto.nombreProducto}</td>
                <td>Q{producto.precio}</td>
                <td>{producto.cantidad}</td>
                <td>Q{(Number(producto.precio) * Number(producto.cantidad)).toFixed(2)}</td>
                <td>
                  <button
                    className="dangerButton"
                    onClick={() => quitarProducto(producto.idProducto)}
                  >
                    Quitar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {productosSeleccionados.length === 0 && (
          <p>No has agregado productos a la venta.</p>
        )}

        <br />

        <div className="pageHeader">
          <div>
            <h3>Total estimado: Q{totalEstimado.toFixed(2)}</h3>
            <p>El total final se calcula nuevamente en el backend dentro de la transacción.</p>
          </div>

          <button className="primaryButton" onClick={registrarVenta}>
            Registrar venta
          </button>
        </div>
      </div>

      <br />

      <div className="panel">
        <h3>¿Qué demuestra esta pantalla?</h3>
        <p>
          Al registrar una venta, el backend ejecuta una transacción explícita:
          crea la venta, agrega varios detalles de venta, descuenta stock,
          registra movimientos de inventario y guarda el pago. Si ocurre un error,
          se ejecuta ROLLBACK.
        </p>
      </div>
    </div>
  )
}

export default RegistrarVenta