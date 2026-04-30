const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
  res.json({ mensaje: 'Ruta de reportes funcionando' })
})

module.exports = router