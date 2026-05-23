const express = require('express')
const { InventarioMovimiento, Producto } = require('../models')
const sequelize = require('../database/orm')

const router = express.Router()

router.get('/movimientos', async (req, res) => {
  try {
    const movimientos = await InventarioMovimiento.findAll({
      include: [{ model: Producto, as: 'producto' }],
      order: [
        ['fecha', 'DESC'],
        ['idmovimiento', 'DESC']
      ]
    })

    res.json(
      movimientos.map(movimiento => {
        const item = movimiento.toJSON()

        return {
          idmovimiento: item.idmovimiento,
          nombreproducto: item.producto.nombreproducto,
          tipo: item.tipo,
          cantidad: item.cantidad,
          fecha: item.fecha
        }
      })
    )
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener movimientos de inventario con ORM' })
  }
})

router.post('/probar-rollback', async (req, res) => {
  try {
    const { idProducto, cantidad } = req.body

    if (!idProducto || !cantidad) {
      return res.status(400).json({ error: 'Producto y cantidad son obligatorios' })
    }

    await sequelize.query(
      `
      CALL probar_rollback_inventario($1, $2);
      `,
      { bind: [Number(idProducto), Number(cantidad)] }
    )

    res.json({
      mensaje: 'Stored procedure ejecutado correctamente; el movimiento fue revertido con ROLLBACK'
    })
  } catch (error) {
    console.error('Error al ejecutar stored procedure probar_rollback_inventario desde ORM:', error.message)

    res.status(500).json({
      error: 'Error al probar ROLLBACK desde stored procedure.',
      detalle: error.message
    })
  }
})

module.exports = router
