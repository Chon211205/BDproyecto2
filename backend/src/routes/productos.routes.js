const express = require('express')
const db = require('../database/db')

const router = express.Router()

router.get('/', (req, res) => {
  const productos = db.prepare('SELECT * FROM producto').all()
  res.json(productos)
})

module.exports = router