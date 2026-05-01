const express = require('express')
const cors = require('cors')
require('dotenv').config()

const db = require('./database/db')

const productosRoutes = require('./routes/productos.routes')
const clientesRoutes = require('./routes/clientes.routes')
const ventasRoutes = require('./routes/ventas.routes')
const reportesRoutes = require('./routes/reportes.routes')
const categoriasRoutes = require('./routes/categorias.routes')

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())

// Ruta base
app.get('/', (req, res) => {
  res.json({ mensaje: 'Backend funcionando correctamente' })
})

// Test DB connection
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()')
    res.json({
      mensaje: 'Conexión a PostgreSQL exitosa',
      time: result.rows[0].now
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error conectando a la base de datos' })
  }
})

// Rutas principales
app.use('/api/productos', productosRoutes)
app.use('/api/clientes', clientesRoutes)
app.use('/api/ventas', ventasRoutes)
app.use('/api/reportes', reportesRoutes)
app.use('/api/categorias', categoriasRoutes)

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Error interno del servidor' })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`)
})