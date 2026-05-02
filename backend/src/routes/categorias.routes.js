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

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const result = await db.query(
      `
      SELECT 
        idCategoria,
        nombreCategoria,
        descripcionCategoria
      FROM categoria
      WHERE idCategoria = $1;
      `,
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener categoría' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { nombreCategoria, descripcionCategoria } = req.body

    if (!nombreCategoria || !descripcionCategoria) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' })
    }

    const result = await db.query(
      `
      INSERT INTO categoria (nombreCategoria, descripcionCategoria)
      VALUES ($1, $2)
      RETURNING *;
      `,
      [nombreCategoria, descripcionCategoria]
    )

    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al crear categoría' })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { nombreCategoria, descripcionCategoria } = req.body

    if (!nombreCategoria || !descripcionCategoria) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' })
    }

    const result = await db.query(
      `
      UPDATE categoria
      SET nombreCategoria = $1,
          descripcionCategoria = $2
      WHERE idCategoria = $3
      RETURNING *;
      `,
      [nombreCategoria, descripcionCategoria, id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al actualizar categoría' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const result = await db.query(
      `
      DELETE FROM categoria
      WHERE idCategoria = $1
      RETURNING *;
      `,
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' })
    }

    res.json({ mensaje: 'Categoría eliminada correctamente' })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: 'Error al eliminar categoría. Puede estar asociada a productos.'
    })
  }
})

module.exports = router