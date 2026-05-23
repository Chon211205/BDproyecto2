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
  try {
    const { idCliente, idEmpleado, idMetodoPago, productos } = req.body

    if (!idCliente || !idEmpleado || !idMetodoPago || !Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({
        error: 'Cliente, empleado, metodo de pago y productos son obligatorios'
      })
    }

    const result = await db.query(
      `
      CALL registrar_venta($1, $2, $3, $4::jsonb, NULL, NULL);
      `,
      [idCliente, idEmpleado, idMetodoPago, JSON.stringify(productos)]
    )

    const ventaRegistrada = result.rows[0]

    res.status(201).json({
      mensaje: 'Venta registrada correctamente con stored procedure',
      idVenta: ventaRegistrada.p_id_venta,
      total: Number(ventaRegistrada.p_total)
    })
  } catch (error) {
    console.error('Error al ejecutar stored procedure registrar_venta:', error.message)

    res.status(500).json({
      error: 'Error al registrar venta desde stored procedure.',
      detalle: error.message
    })
  }
})

module.exports = router
