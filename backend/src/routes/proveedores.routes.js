const express = require('express')
const db = require('../database/db')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        idProveedor,
        nombreProveedor,
        telefonoProveedor,
        correoProveedor
      FROM proveedor
      ORDER BY idProveedor;
    `)

    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener proveedores' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const result = await db.query(
      `
      SELECT 
        idProveedor,
        nombreProveedor,
        telefonoProveedor,
        correoProveedor
      FROM proveedor
      WHERE idProveedor = $1;
      `,
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Proveedor no encontrado' })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener proveedor' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { nombreProveedor, telefonoProveedor, correoProveedor } = req.body

    if (!nombreProveedor || !telefonoProveedor || !correoProveedor) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' })
    }

    const result = await db.query(
      `
      INSERT INTO proveedor (nombreProveedor, telefonoProveedor, correoProveedor)
      VALUES ($1, $2, $3)
      RETURNING *;
      `,
      [nombreProveedor, telefonoProveedor, correoProveedor]
    )

    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al crear proveedor' })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { nombreProveedor, telefonoProveedor, correoProveedor } = req.body

    if (!nombreProveedor || !telefonoProveedor || !correoProveedor) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' })
    }

    const result = await db.query(
      `
      UPDATE proveedor
      SET nombreProveedor = $1,
          telefonoProveedor = $2,
          correoProveedor = $3
      WHERE idProveedor = $4
      RETURNING *;
      `,
      [nombreProveedor, telefonoProveedor, correoProveedor, id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Proveedor no encontrado' })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al actualizar proveedor' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const result = await db.query(
      `
      DELETE FROM proveedor
      WHERE idProveedor = $1
      RETURNING *;
      `,
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Proveedor no encontrado' })
    }

    res.json({ mensaje: 'Proveedor eliminado correctamente' })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: 'Error al eliminar proveedor. Puede estar asociado a productos.'
    })
  }
})

module.exports = router