const express = require('express')
const db = require('../database/db')

const router = express.Router()

router.get('/movimientos', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        im.idMovimiento,
        p.nombreProducto,
        im.tipo,
        im.cantidad,
        im.fecha
      FROM inventario_movimiento im
      JOIN producto p ON im.idProducto = p.idProducto
      ORDER BY im.fecha DESC, im.idMovimiento DESC;
    `)

    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener movimientos de inventario' })
  }
})

router.post('/probar-rollback', async (req, res) => {
  try {
    const { idProducto, cantidad } = req.body

    if (!idProducto || !cantidad) {
      return res.status(400).json({ error: 'Producto y cantidad son obligatorios' })
    }

    await db.query(
      `
      CALL probar_rollback_inventario($1, $2);
      `,
      [Number(idProducto), Number(cantidad)]
    )

    res.json({
      mensaje: 'Stored procedure ejecutado correctamente; el movimiento fue revertido con ROLLBACK'
    })
  } catch (error) {
    console.error('Error al ejecutar stored procedure probar_rollback_inventario:', error.message)

    res.status(500).json({
      error: 'Error al probar ROLLBACK desde stored procedure.',
      detalle: error.message
    })
  }
})

module.exports = router
