const express = require('express')
const db = require('../database/db')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        idCategoria,
        nombreCategoria,
        descripcionCategoria
      FROM categoria
      ORDER BY idCategoria;
    `)

    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener categorías' })
  }
})

module.exports = router