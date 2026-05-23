const express = require('express')
const sequelize = require('../database/orm')
const { Cliente, DetalleVenta, Empleado, MetodoPago, Pago, Producto, Venta } = require('../models')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const ventas = await Venta.findAll({
      include: [
        { model: Cliente, as: 'cliente' },
        { model: Empleado, as: 'empleado' },
        {
          model: Pago,
          as: 'pagos',
          required: false,
          include: [{ model: MetodoPago, as: 'metodoPago', required: false }]
        }
      ],
      order: [['idventa', 'ASC']]
    })

    res.json(
      ventas.map(venta => {
        const item = venta.toJSON()
        const pago = item.pagos[0]

        return {
          idventa: item.idventa,
          fecha: item.fecha,
          cliente: `${item.cliente.nombrecliente} ${item.cliente.apellidocliente}`,
          empleado: `${item.empleado.nombreempleado} ${item.empleado.apellidoempleado}`,
          montopagado: pago?.monto || null,
          metodopago: pago?.metodoPago?.tipometodopago || null
        }
      })
    )
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener ventas con ORM' })
  }
})

router.get('/:id/detalle', async (req, res) => {
  try {
    const detalles = await DetalleVenta.findAll({
      where: { idventa: Number(req.params.id) },
      include: [{ model: Producto, as: 'producto' }],
      order: [['iddetalle', 'ASC']]
    })

    res.json(
      detalles.map(detalle => {
        const item = detalle.toJSON()

        return {
          iddetalle: item.iddetalle,
          nombreproducto: item.producto.nombreproducto,
          cantidad: item.cantidad,
          preciounitario: item.preciounitario,
          subtotal: item.subtotal
        }
      })
    )
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener detalle de venta con ORM' })
  }
})

router.post('/registrar-transaccion', async (req, res) => {
  try {
    const { idCliente, idEmpleado, idMetodoPago, productos } = req.body

    if (!idCliente || !idEmpleado || !idMetodoPago || !Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({
        error: 'Cliente, empleado, metodo de pago y productos son obligatorios'
      })
    }

    const [result] = await sequelize.query(
      `
      CALL registrar_venta($1, $2, $3, $4::jsonb, NULL, NULL);
      `,
      { bind: [idCliente, idEmpleado, idMetodoPago, JSON.stringify(productos)] }
    )

    const ventaRegistrada = result[0]

    res.status(201).json({
      mensaje: 'Venta registrada correctamente con stored procedure',
      idVenta: ventaRegistrada.p_id_venta,
      total: Number(ventaRegistrada.p_total)
    })
  } catch (error) {
    console.error('Error al ejecutar stored procedure registrar_venta desde ORM:', error.message)

    res.status(500).json({
      error: 'Error al registrar venta desde stored procedure.',
      detalle: error.message
    })
  }
})

module.exports = router
