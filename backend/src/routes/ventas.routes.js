const express = require('express')
const db = require('../database/db')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        v.idVenta,
        v.fecha,
        c.nombreCliente || ' ' || c.apellidoCliente AS cliente,
        e.nombreEmpleado || ' ' || e.apellidoEmpleado AS empleado,
        p.monto AS montoPagado,
        mp.tipoMetodoPago AS metodoPago
      FROM venta v
      JOIN cliente c ON v.idCliente = c.idCliente
      JOIN empleado e ON v.idEmpleado = e.idEmpleado
      LEFT JOIN pago p ON v.idVenta = p.idVenta
      LEFT JOIN metodo_pago mp ON p.idMetodoPago = mp.idMetodoPago
      ORDER BY v.idVenta;
    `)

    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener ventas' })
  }
})

router.get('/:id/detalle', async (req, res) => {
  try {
    const { id } = req.params

    const result = await db.query(
      `
      SELECT
        dv.idDetalle,
        p.nombreProducto,
        dv.cantidad,
        dv.precioUnitario,
        dv.subtotal
      FROM detalle_venta dv
      JOIN producto p ON dv.idProducto = p.idProducto
      WHERE dv.idVenta = $1
      ORDER BY dv.idDetalle;
      `,
      [id]
    )

    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener detalle de venta' })
  }
})

router.post('/registrar-transaccion', async (req, res) => {
  const client = await db.connect()

  try {
    const { idCliente, idEmpleado, idMetodoPago, productos } = req.body

    if (!idCliente || !idEmpleado || !idMetodoPago || !productos || productos.length === 0) {
      return res.status(400).json({
        error: 'Cliente, empleado, método de pago y productos son obligatorios'
      })
    }

    await client.query('BEGIN')

    let totalVenta = 0

    for (const producto of productos) {
      const { idProducto, cantidad } = producto

      const productoResult = await client.query(
        `
        SELECT precio, stock
        FROM producto
        WHERE idProducto = $1;
        `,
        [idProducto]
      )

      if (productoResult.rows.length === 0) {
        throw new Error(`Producto con ID ${idProducto} no existe`)
      }

      const nombreProducto = productoResult.rows[0].nombreproducto
      const precio = Number(productoResult.rows[0].precio)
      const stock = Number(productoResult.rows[0].stock)

      if (cantidad <= 0) {
        throw new Error(`La cantidad del producto ${nombreProducto} debe ser mayor a 0`)
      }

      if (cantidad > stock) {
        throw new Error(
          `Stock insuficiente para ${nombreProducto}. Stock disponible: ${stock}, cantidad solicitada: ${cantidad}`
        )
      }

      totalVenta += precio * cantidad
    }

    const ventaResult = await client.query(
      `
      INSERT INTO venta (fecha, idCliente, idEmpleado, total)
      VALUES (CURRENT_DATE, $1, $2, $3)
      RETURNING idVenta;
      `,
      [idCliente, idEmpleado, totalVenta]
    )

    const idVenta = ventaResult.rows[0].idventa

    for (const producto of productos) {
      const { idProducto, cantidad } = producto

      const productoResult = await client.query(
        `
        SELECT nombreProducto, precio, stock
        FROM producto
        WHERE idProducto = $1;
        `,
        [idProducto]
      )

      const precioUnitario = Number(productoResult.rows[0].precio)
      const subtotal = precioUnitario * cantidad

      await client.query(
        `
        INSERT INTO detalle_venta (idVenta, idProducto, cantidad, precioUnitario, subtotal)
        VALUES ($1, $2, $3, $4, $5);
        `,
        [idVenta, idProducto, cantidad, precioUnitario, subtotal]
      )

      await client.query(
        `
        UPDATE producto
        SET stock = stock - $1
        WHERE idProducto = $2;
        `,
        [cantidad, idProducto]
      )

      await client.query(
        `
        INSERT INTO inventario_movimiento (tipo, cantidad, fecha, idProducto)
        VALUES ('salida', $1, CURRENT_DATE, $2);
        `,
        [cantidad, idProducto]
      )
    }

    await client.query(
      `
      INSERT INTO pago (idVenta, idMetodoPago, monto, fecha)
      VALUES ($1, $2, $3, CURRENT_DATE);
      `,
      [idVenta, idMetodoPago, totalVenta]
    )

    await client.query('COMMIT')

    res.status(201).json({
      mensaje: 'Venta registrada correctamente con transacción',
      idVenta,
      total: totalVenta
    })
  } catch (error) {
    await client.query('ROLLBACK')

    console.error('Error en transacción:', error.message)

    res.status(500).json({
      error: 'Error al registrar venta. Se aplicó ROLLBACK.',
      detalle: error.message
    })
  } finally {
    client.release()
  }
})

module.exports = router