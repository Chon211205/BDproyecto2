const express = require('express')
const db = require('../database/db')

const router = express.Router()

// READ
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        d.idDireccion,
        d.direccionCliente,
        d.ciudad,
        d.idCliente,
        c.nombreCliente || ' ' || c.apellidoCliente AS cliente
      FROM direccion_cliente d
      JOIN cliente c ON d.idCliente = c.idCliente
      ORDER BY d.idDireccion;
    `)

    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener direcciones' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const result = await db.query(
      `
      SELECT 
        idDireccion,
        direccionCliente,
        ciudad,
        idCliente
      FROM direccion_cliente
      WHERE idDireccion = $1;
      `,
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Dirección no encontrada' })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener dirección' })
  }
})

// CREATE
router.post('/', async (req, res) => {
  try {
    const { direccionCliente, ciudad, idCliente } = req.body

    if (!direccionCliente || !ciudad || !idCliente) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' })
    }

    const result = await db.query(
      `
      INSERT INTO direccion_cliente (direccionCliente, ciudad, idCliente)
      VALUES ($1, $2, $3)
      RETURNING *;
      `,
      [direccionCliente, ciudad, idCliente]
    )

    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al crear dirección' })
  }
})

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { direccionCliente, ciudad, idCliente } = req.body

    if (!direccionCliente || !ciudad || !idCliente) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' })
    }

    const result = await db.query(
      `
      UPDATE direccion_cliente
      SET direccionCliente = $1,
          ciudad = $2,
          idCliente = $3
      WHERE idDireccion = $4
      RETURNING *;
      `,
      [direccionCliente, ciudad, idCliente, id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Dirección no encontrada' })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al actualizar dirección' })
  }
})

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const result = await db.query(
      `
      DELETE FROM direccion_cliente
      WHERE idDireccion = $1
      RETURNING *;
      `,
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Dirección no encontrada' })
    }

    res.json({ mensaje: 'Dirección eliminada correctamente' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al eliminar dirección' })
  }
})

module.exports = router