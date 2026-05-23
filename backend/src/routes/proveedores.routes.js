const express = require('express')
const { Proveedor } = require('../models')
const sequelize = require('../database/orm')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const proveedores = await Proveedor.findAll({
      order: [['idproveedor', 'ASC']]
    })

    res.json(proveedores)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener proveedores con ORM' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const proveedor = await Proveedor.findByPk(Number(req.params.id))

    if (!proveedor) {
      return res.status(404).json({ error: 'Proveedor no encontrado' })
    }

    res.json(proveedor)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener proveedor con ORM' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { nombreProveedor, telefonoProveedor, correoProveedor } = req.body

    if (!nombreProveedor || !telefonoProveedor || !correoProveedor) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' })
    }

    const [result] = await sequelize.query(
      `
      CALL crear_proveedor($1, $2, $3, NULL);
      `,
      { bind: [nombreProveedor, telefonoProveedor, correoProveedor] }
    )

    res.status(201).json(result[0].p_proveedor)
  } catch (error) {
    console.error('Error al ejecutar stored procedure crear_proveedor desde ORM:', error.message)
    res.status(500).json({
      error: 'Error al crear proveedor desde stored procedure.',
      detalle: error.message
    })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const { nombreProveedor, telefonoProveedor, correoProveedor } = req.body

    if (!nombreProveedor || !telefonoProveedor || !correoProveedor) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' })
    }

    const proveedor = await Proveedor.findByPk(Number(req.params.id))

    if (!proveedor) {
      return res.status(404).json({ error: 'Proveedor no encontrado' })
    }

    await proveedor.update({
      nombreproveedor: nombreProveedor,
      telefonoproveedor: telefonoProveedor,
      correoproveedor: correoProveedor
    })

    res.json(proveedor)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al actualizar proveedor con ORM' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const proveedor = await Proveedor.findByPk(Number(req.params.id))

    if (!proveedor) {
      return res.status(404).json({ error: 'Proveedor no encontrado' })
    }

    await proveedor.destroy()

    res.json({ mensaje: 'Proveedor eliminado correctamente con ORM' })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: 'Error al eliminar proveedor con ORM. Puede estar asociado a productos.'
    })
  }
})

module.exports = router
