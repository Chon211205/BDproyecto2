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

module.exports = router