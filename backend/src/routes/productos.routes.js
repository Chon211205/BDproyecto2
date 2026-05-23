const express = require('express')
const { Categoria, Producto, Proveedor } = require('../models')
const sequelize = require('../database/orm')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const productos = await Producto.findAll({
      include: [
        { model: Categoria, as: 'categoria' },
        { model: Proveedor, as: 'proveedor' }
      ],
      order: [['idproducto', 'ASC']]
    })

    res.json(
      productos.map(producto => {
        const item = producto.toJSON()

        return {
          idproducto: item.idproducto,
          nombreproducto: item.nombreproducto,
          precio: item.precio,
          stock: item.stock,
          idcategoria: item.idcategoria,
          nombrecategoria: item.categoria.nombrecategoria,
          idproveedor: item.idproveedor,
          nombreproveedor: item.proveedor.nombreproveedor
        }
      })
    )
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener productos con ORM' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const producto = await Producto.findByPk(Number(req.params.id))

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' })
    }

    res.json(producto)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener producto con ORM' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { nombreProducto, precio, stock, idCategoria, idProveedor } = req.body

    if (!nombreProducto || precio === undefined || stock === undefined || !idCategoria || !idProveedor) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' })
    }

    const [result] = await sequelize.query(
      `
      CALL crear_producto($1, $2, $3, $4, $5, NULL, NULL);
      `,
      { bind: [nombreProducto, Number(precio), Number(stock), Number(idCategoria), Number(idProveedor)] }
    )

    res.status(201).json({
      ...result[0].p_producto,
      movimientoRegistrado: result[0].p_movimiento_registrado
    })
  } catch (error) {
    console.error('Error al ejecutar stored procedure crear_producto desde ORM:', error.message)
    res.status(500).json({
      error: 'Error al crear producto desde stored procedure.',
      detalle: error.message
    })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const { nombreProducto, precio, stock, idCategoria, idProveedor } = req.body

    if (!nombreProducto || precio === undefined || stock === undefined || !idCategoria || !idProveedor) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' })
    }

    const [result] = await sequelize.query(
      `
      CALL actualizar_producto($1, $2, $3, $4, $5, $6, NULL, NULL, NULL);
      `,
      {
        bind: [
          Number(req.params.id),
          nombreProducto,
          Number(precio),
          Number(stock),
          Number(idCategoria),
          Number(idProveedor)
        ]
      }
    )

    const productoActualizado = result[0]

    res.json({
      mensaje: 'Producto actualizado correctamente con stored procedure',
      producto: productoActualizado.p_producto,
      movimientoRegistrado: productoActualizado.p_movimiento_registrado,
      diferenciaStock: productoActualizado.p_diferencia_stock
    })
  } catch (error) {
    console.error('Error al ejecutar stored procedure actualizar_producto desde ORM:', error.message)

    if (error.message.includes('Producto con ID')) {
      return res.status(404).json({ error: 'Producto no encontrado' })
    }

    res.status(500).json({
      error: 'Error al actualizar producto desde stored procedure.',
      detalle: error.message
    })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const producto = await Producto.findByPk(Number(req.params.id))

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' })
    }

    await producto.destroy()

    res.json({ mensaje: 'Producto eliminado correctamente con ORM' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al eliminar producto con ORM' })
  }
})

module.exports = router
