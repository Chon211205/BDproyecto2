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

module.exports = router