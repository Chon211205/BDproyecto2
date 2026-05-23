const express = require('express')
const { Cliente, DireccionCliente } = require('../models')
const sequelize = require('../database/orm')
const getNextId = require('../utils/nextId')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const direcciones = await DireccionCliente.findAll({
      include: [{ model: Cliente, as: 'cliente' }],
      order: [['iddireccion', 'ASC']]
    })

    res.json(
      direcciones.map(direccion => {
        const item = direccion.toJSON()

        return {
          iddireccion: item.iddireccion,
          direccioncliente: item.direccioncliente,
          ciudad: item.ciudad,
          idcliente: item.idcliente,
          cliente: `${item.cliente.nombrecliente} ${item.cliente.apellidocliente}`
        }
      })
    )
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener direcciones con ORM' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const direccion = await DireccionCliente.findByPk(Number(req.params.id))

    if (!direccion) {
      return res.status(404).json({ error: 'Direccion no encontrada' })
    }

    res.json(direccion)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener direccion con ORM' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { direccionCliente, ciudad, idCliente } = req.body

    if (!direccionCliente || !ciudad || !idCliente) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' })
    }

    const cliente = await Cliente.findByPk(Number(idCliente))

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' })
    }

    const direccion = await sequelize.transaction(async transaction => {
      return DireccionCliente.create({
        iddireccion: await getNextId(DireccionCliente, 'iddireccion', { transaction }),
        direccioncliente: direccionCliente,
        ciudad,
        idcliente: Number(idCliente)
      }, { transaction })
    })

    res.status(201).json(direccion)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al crear direccion con ORM' })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const { direccionCliente, ciudad, idCliente } = req.body

    if (!direccionCliente || !ciudad || !idCliente) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' })
    }

    const [direccion, cliente] = await Promise.all([
      DireccionCliente.findByPk(Number(req.params.id)),
      Cliente.findByPk(Number(idCliente))
    ])

    if (!direccion) {
      return res.status(404).json({ error: 'Direccion no encontrada' })
    }

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' })
    }

    await direccion.update({
      direccioncliente: direccionCliente,
      ciudad,
      idcliente: Number(idCliente)
    })

    res.json(direccion)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al actualizar direccion con ORM' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const direccion = await DireccionCliente.findByPk(Number(req.params.id))

    if (!direccion) {
      return res.status(404).json({ error: 'Direccion no encontrada' })
    }

    await direccion.destroy()

    res.json({ mensaje: 'Direccion eliminada correctamente con ORM' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al eliminar direccion con ORM' })
  }
})

module.exports = router
