import { useEffect, useState } from 'react'

function Productos() {
  const [productos, setProductos] = useState([])

  useEffect(() => {
    fetch('http://localhost:3000/api/productos')
      .then(res => res.json())
      .then(data => {
        console.log(data)
        setProductos(data)
      })
      .catch(err => console.error(err))
  }, [])

  return (
    <div>
      <h1>Productos</h1>
      <p>Total: {productos.length}</p>

      {productos.map(producto => (
        <p key={producto.idproducto}>
          {producto.idproducto} - {producto.nombreproducto}
        </p>
      ))}
    </div>
  )
}

export default Productos