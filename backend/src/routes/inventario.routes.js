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

module.exports = router