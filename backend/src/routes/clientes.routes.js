const express = require('express')
const db = require('../database/db')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        idCliente,
        nombreCliente,
        apellidoCliente,
        correoCliente,
        telefonoCliente
      FROM cliente
      ORDER BY idCliente;
    `)

    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener clientes' })
  }
})

module.exports = router