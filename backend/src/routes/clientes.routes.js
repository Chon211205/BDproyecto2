const express = require('express')
const db = require('../database/db')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        c.idCliente,
        c.nombreCliente,
        c.apellidoCliente,
        c.correoCliente,
        c.telefonoCliente,
        d.direccionCliente,
        d.ciudad
      FROM cliente c
      LEFT JOIN direccion_cliente d ON c.idCliente = d.idCliente
      ORDER BY c.idCliente;
    `)

    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener clientes' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const result = await db.query(
      `
      SELECT 
        idCliente,
        nombreCliente,
        apellidoCliente,
        correoCliente,
        telefonoCliente
      FROM cliente
      WHERE idCliente = $1;
      `,
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener cliente' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { nombreCliente, apellidoCliente, correoCliente, telefonoCliente } = req.body

    if (!nombreCliente || !apellidoCliente || !correoCliente || !telefonoCliente) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' })
    }

    const result = await db.query(
      `
      CALL crear_cliente($1, $2, $3, $4, NULL);
      `,
      [nombreCliente, apellidoCliente, correoCliente, telefonoCliente]
    )

    res.status(201).json(result.rows[0].p_cliente)
  } catch (error) {
    console.error('Error al ejecutar stored procedure crear_cliente:', error.message)
    res.status(500).json({
      error: 'Error al crear cliente desde stored procedure.',
      detalle: error.message
    })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { nombreCliente, apellidoCliente, correoCliente, telefonoCliente } = req.body

    if (!nombreCliente || !apellidoCliente || !correoCliente || !telefonoCliente) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' })
    }

    const result = await db.query(
      `
      UPDATE cliente
      SET nombreCliente = $1,
          apellidoCliente = $2,
          correoCliente = $3,
          telefonoCliente = $4
      WHERE idCliente = $5
      RETURNING *;
      `,
      [nombreCliente, apellidoCliente, correoCliente, telefonoCliente, id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' })
    }

    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar cliente' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const result = await db.query(
      `
      DELETE FROM cliente
      WHERE idCliente = $1
      RETURNING *;
      `,
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' })
    }

    res.json({ mensaje: 'Cliente eliminado correctamente' })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar cliente' })
  }
})

module.exports = router
