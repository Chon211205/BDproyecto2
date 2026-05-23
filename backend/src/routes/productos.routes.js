const express = require('express')
const db = require('../database/db')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        p.idProducto,
        p.nombreProducto,
        p.precio,
        p.stock,
        p.idCategoria,
        c.nombreCategoria,
        p.idProveedor,
        pr.nombreProveedor
      FROM producto p
      JOIN categoria c ON p.idCategoria = c.idCategoria
      JOIN proveedor pr ON p.idProveedor = pr.idProveedor
      ORDER BY p.idProducto;
    `)

    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener productos' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const result = await db.query(
      `
      SELECT 
        idProducto,
        nombreProducto,
        precio,
        stock,
        idCategoria,
        idProveedor
      FROM producto
      WHERE idProducto = $1;
      `,
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener producto' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { nombreProducto, precio, stock, idCategoria, idProveedor } = req.body

    if (!nombreProducto || precio === undefined || stock === undefined || !idCategoria || !idProveedor) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' })
    }

    const result = await db.query(
      `
      CALL crear_producto($1, $2, $3, $4, $5, NULL, NULL);
      `,
      [nombreProducto, Number(precio), Number(stock), Number(idCategoria), Number(idProveedor)]
    )

    res.status(201).json({
      ...result.rows[0].p_producto,
      movimientoRegistrado: result.rows[0].p_movimiento_registrado
    })
  } catch (error) {
    console.error('Error al ejecutar stored procedure crear_producto:', error.message)
    res.status(500).json({
      error: 'Error al crear producto desde stored procedure.',
      detalle: error.message
    })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { nombreProducto, precio, stock, idCategoria, idProveedor } = req.body

    if (!nombreProducto || precio === undefined || stock === undefined || !idCategoria || !idProveedor) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' })
    }

    const result = await db.query(
      `
      CALL actualizar_producto($1, $2, $3, $4, $5, $6, NULL, NULL, NULL);
      `,
      [Number(id), nombreProducto, Number(precio), Number(stock), Number(idCategoria), Number(idProveedor)]
    )

    const productoActualizado = result.rows[0]

    res.json({
      mensaje: 'Producto actualizado correctamente con stored procedure',
      producto: productoActualizado.p_producto,
      movimientoRegistrado: productoActualizado.p_movimiento_registrado,
      diferenciaStock: productoActualizado.p_diferencia_stock
    })
  } catch (error) {
    console.error('Error al ejecutar stored procedure actualizar_producto:', error.message)

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
    const { id } = req.params

    const result = await db.query(
      `
      DELETE FROM producto
      WHERE idProducto = $1
      RETURNING *;
      `,
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' })
    }

    res.json({ mensaje: 'Producto eliminado correctamente' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al eliminar producto' })
  }
})

module.exports = router
