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

router.post('/', async (req, res) => {
  try {
    const { nombreProducto, precio, stock, idCategoria, idProveedor } = req.body

    if (!nombreProducto || precio === undefined || stock === undefined || !idCategoria || !idProveedor) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' })
    }

    const result = await db.query(
      `
      INSERT INTO producto (nombreProducto, precio, stock, idCategoria, idProveedor)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
      `,
      [nombreProducto, precio, stock, idCategoria, idProveedor]
    )

    res.status(201).json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: 'Error al crear producto' })
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
      UPDATE producto
      SET nombreProducto = $1,
          precio = $2,
          stock = $3,
          idCategoria = $4,
          idProveedor = $5
      WHERE idProducto = $6
      RETURNING *;
      `,
      [nombreProducto, precio, stock, idCategoria, idProveedor, id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' })
    }

    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar producto' })
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
    res.status(500).json({ error: 'Error al eliminar producto' })
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

module.exports = router