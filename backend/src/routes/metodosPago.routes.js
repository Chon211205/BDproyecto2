const express = require('express')
const { MetodoPago } = require('../models')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const metodosPago = await MetodoPago.findAll({
      order: [['idmetodopago', 'ASC']]
    })

    res.json(metodosPago)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener metodos de pago con ORM' })
  }
})

module.exports = router
