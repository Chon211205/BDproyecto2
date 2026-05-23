const express = require('express')
const { Empleado } = require('../models')
const sequelize = require('../database/orm')
const getNextId = require('../utils/nextId')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const empleados = await Empleado.findAll({
      order: [['idempleado', 'ASC']]
    })

    res.json(empleados)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener empleados con ORM' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const empleado = await Empleado.findByPk(Number(req.params.id))

    if (!empleado) {
      return res.status(404).json({ error: 'Empleado no encontrado' })
    }

    res.json(empleado)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener empleado con ORM' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { nombreEmpleado, apellidoEmpleado, puesto } = req.body

    if (!nombreEmpleado || !apellidoEmpleado || !puesto) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' })
    }

    const empleado = await sequelize.transaction(async transaction => {
      return Empleado.create({
        idempleado: await getNextId(Empleado, 'idempleado', { transaction }),
        nombreempleado: nombreEmpleado,
        apellidoempleado: apellidoEmpleado,
        puesto
      }, { transaction })
    })

    res.status(201).json(empleado)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al crear empleado con ORM' })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const { nombreEmpleado, apellidoEmpleado, puesto } = req.body

    if (!nombreEmpleado || !apellidoEmpleado || !puesto) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' })
    }

    const empleado = await Empleado.findByPk(Number(req.params.id))

    if (!empleado) {
      return res.status(404).json({ error: 'Empleado no encontrado' })
    }

    await empleado.update({
      nombreempleado: nombreEmpleado,
      apellidoempleado: apellidoEmpleado,
      puesto
    })

    res.json(empleado)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al actualizar empleado con ORM' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const empleado = await Empleado.findByPk(Number(req.params.id))

    if (!empleado) {
      return res.status(404).json({ error: 'Empleado no encontrado' })
    }

    await empleado.destroy()

    res.json({ mensaje: 'Empleado eliminado correctamente con ORM' })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: 'Error al eliminar empleado con ORM. Puede estar asociado a ventas.'
    })
  }
})

module.exports = router
