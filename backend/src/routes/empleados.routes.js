const express = require('express')
const db = require('../database/db')

const router = express.Router()

// READ
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        idEmpleado,
        nombreEmpleado,
        apellidoEmpleado,
        puesto
      FROM empleado
      ORDER BY idEmpleado;
    `)

    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener empleados' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const result = await db.query(
      `
      SELECT 
        idEmpleado,
        nombreEmpleado,
        apellidoEmpleado,
        puesto
      FROM empleado
      WHERE idEmpleado = $1;
      `,
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Empleado no encontrado' })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener empleado' })
  }
})

// CREATE
router.post('/', async (req, res) => {
  try {
    const { nombreEmpleado, apellidoEmpleado, puesto } = req.body

    if (!nombreEmpleado || !apellidoEmpleado || !puesto) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' })
    }

    const result = await db.query(
      `
      INSERT INTO empleado (nombreEmpleado, apellidoEmpleado, puesto)
      VALUES ($1, $2, $3)
      RETURNING *;
      `,
      [nombreEmpleado, apellidoEmpleado, puesto]
    )

    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al crear empleado' })
  }
})

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { nombreEmpleado, apellidoEmpleado, puesto } = req.body

    if (!nombreEmpleado || !apellidoEmpleado || !puesto) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' })
    }

    const result = await db.query(
      `
      UPDATE empleado
      SET nombreEmpleado = $1,
          apellidoEmpleado = $2,
          puesto = $3
      WHERE idEmpleado = $4
      RETURNING *;
      `,
      [nombreEmpleado, apellidoEmpleado, puesto, id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Empleado no encontrado' })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al actualizar empleado' })
  }
})

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const result = await db.query(
      `
      DELETE FROM empleado
      WHERE idEmpleado = $1
      RETURNING *;
      `,
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Empleado no encontrado' })
    }

    res.json({ mensaje: 'Empleado eliminado correctamente' })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: 'Error al eliminar empleado. Puede estar asociado a ventas.'
    })
  }
})

module.exports = router