const express = require('express')
const Categoria = require('../models/categoria.model')
const sequelize = require('../database/orm')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const categorias = await Categoria.findAll({
      order: [['idcategoria', 'ASC']]
    })

    res.json(categorias)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener categorias con ORM' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const categoria = await Categoria.findByPk(Number(id))

    if (!categoria) {
      return res.status(404).json({ error: 'Categoria no encontrada' })
    }

    res.json(categoria)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener categoria con ORM' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { nombreCategoria, descripcionCategoria } = req.body

    if (!nombreCategoria || !descripcionCategoria) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' })
    }

    const categoria = await sequelize.transaction(async transaction => {
      const ultimoId = await Categoria.max('idcategoria', { transaction })

      return Categoria.create({
        idcategoria: Number(ultimoId || 0) + 1,
        nombrecategoria: nombreCategoria,
        descripcioncategoria: descripcionCategoria
      }, { transaction })
    })

    res.status(201).json(categoria)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al crear categoria con ORM' })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { nombreCategoria, descripcionCategoria } = req.body

    if (!nombreCategoria || !descripcionCategoria) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' })
    }

    const categoria = await Categoria.findByPk(Number(id))

    if (!categoria) {
      return res.status(404).json({ error: 'Categoria no encontrada' })
    }

    await categoria.update({
      nombrecategoria: nombreCategoria,
      descripcioncategoria: descripcionCategoria
    })

    res.json(categoria)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al actualizar categoria con ORM' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const categoria = await Categoria.findByPk(Number(id))

    if (!categoria) {
      return res.status(404).json({ error: 'Categoria no encontrada' })
    }

    await categoria.destroy()

    res.json({ mensaje: 'Categoria eliminada correctamente con ORM' })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: 'Error al eliminar categoria con ORM. Puede estar asociada a productos.'
    })
  }
})

module.exports = router
