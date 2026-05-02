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
      INSERT INTO producto (nombreProducto, precio, stock, idCategoria, idProveedor)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
      `,
      [nombreProducto, precio, stock, idCategoria, idProveedor]
    )

    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al crear producto' })
  }
})

router.put('/:id', async (req, res) => {
  const client = await db.connect()

  try {
    const { id } = req.params
    const { nombreProducto, precio, stock, idCategoria, idProveedor } = req.body

    if (!nombreProducto || precio === undefined || stock === undefined || !idCategoria || !idProveedor) {
      client.release()
      return res.status(400).json({ error: 'Todos los campos son obligatorios' })
    }

    await client.query('BEGIN')

    const productoActual = await client.query(
      `
      SELECT stock
      FROM producto
      WHERE idProducto = $1;
      `,
      [id]
    )

    if (productoActual.rows.length === 0) {
      await client.query('ROLLBACK')
      return res.status(404).json({ error: 'Producto no encontrado' })
    }

    const stockAnterior = Number(productoActual.rows[0].stock)
    const stockNuevo = Number(stock)
    const diferencia = stockNuevo - stockAnterior

    const result = await client.query(
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
      [nombreProducto, Number(precio), stockNuevo, Number(idCategoria), Number(idProveedor), id]
    )

    if (diferencia !== 0) {
      const tipoMovimiento = diferencia > 0 ? 'entrada' : 'salida'
      const cantidadMovimiento = Math.abs(diferencia)

      await client.query(
        `
        INSERT INTO inventario_movimiento (tipo, cantidad, fecha, idProducto)
        VALUES ($1, $2, CURRENT_DATE, $3);
        `,
        [tipoMovimiento, cantidadMovimiento, id]
      )
    }

    await client.query('COMMIT')

    res.json({
      mensaje: 'Producto actualizado correctamente',
      producto: result.rows[0],
      movimientoRegistrado: diferencia !== 0,
      diferenciaStock: diferencia
    })
  } catch (error) {
    await client.query('ROLLBACK')

    console.error('ERROR ACTUALIZANDO PRODUCTO:', error)

    res.status(500).json({
      error: 'Error al actualizar producto. Se aplicó ROLLBACK.',
      detalle: error.message
    })
  } finally {
    client.release()
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