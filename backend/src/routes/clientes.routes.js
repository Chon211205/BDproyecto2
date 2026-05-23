const express = require('express')
const { Cliente, DireccionCliente } = require('../models')
const sequelize = require('../database/orm')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const clientes = await Cliente.findAll({
      include: [{ model: DireccionCliente, as: 'direcciones', required: false }],
      order: [['idcliente', 'ASC']]
    })

    res.json(
      clientes.flatMap(cliente => {
        const base = cliente.toJSON()
        const direcciones = base.direcciones.length > 0 ? base.direcciones : [null]

        return direcciones.map(direccion => ({
          idcliente: base.idcliente,
          nombrecliente: base.nombrecliente,
          apellidocliente: base.apellidocliente,
          correocliente: base.correocliente,
          telefonocliente: base.telefonocliente,
          direccioncliente: direccion?.direccioncliente || null,
          ciudad: direccion?.ciudad || null
        }))
      })
    )
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener clientes con ORM' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(Number(req.params.id))

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' })
    }

    res.json(cliente)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener cliente con ORM' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { nombreCliente, apellidoCliente, correoCliente, telefonoCliente } = req.body

    if (!nombreCliente || !apellidoCliente || !correoCliente || !telefonoCliente) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' })
    }

    const [result] = await sequelize.query(
      `
      CALL crear_cliente($1, $2, $3, $4, NULL);
      `,
      { bind: [nombreCliente, apellidoCliente, correoCliente, telefonoCliente] }
    )

    res.status(201).json(result[0].p_cliente)
  } catch (error) {
    console.error('Error al ejecutar stored procedure crear_cliente desde ORM:', error.message)
    res.status(500).json({
      error: 'Error al crear cliente desde stored procedure.',
      detalle: error.message
    })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const { nombreCliente, apellidoCliente, correoCliente, telefonoCliente } = req.body

    if (!nombreCliente || !apellidoCliente || !correoCliente || !telefonoCliente) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' })
    }

    const cliente = await Cliente.findByPk(Number(req.params.id))

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' })
    }

    await cliente.update({
      nombrecliente: nombreCliente,
      apellidocliente: apellidoCliente,
      correocliente: correoCliente,
      telefonocliente: telefonoCliente
    })

    res.json(cliente)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al actualizar cliente con ORM' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(Number(req.params.id))

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' })
    }

    await cliente.destroy()

    res.json({ mensaje: 'Cliente eliminado correctamente con ORM' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al eliminar cliente con ORM' })
  }
})

module.exports = router
