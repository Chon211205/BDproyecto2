const express = require('express')
const db = require('../database/db')

const router = express.Router()

router.get('/', (req, res) => {
  const clientes = db.prepare('SELECT * FROM cliente').all()
  res.json(clientes)
})

module.exports = router