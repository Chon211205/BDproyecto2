const express = require('express')
const db = require('../database/db')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        idMetodoPago,
        tipoMetodoPago
      FROM metodo_pago
      ORDER BY idMetodoPago;
    `)

    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener métodos de pago' })
  }
})

module.exports = router