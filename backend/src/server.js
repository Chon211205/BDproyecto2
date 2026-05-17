const express = require('express')
const cors = require('cors')
require('dotenv').config()

const db = require('./database/db')

const productosRoutes = require('./routes/productos.routes')
const clientesRoutes = require('./routes/clientes.routes')
const ventasRoutes = require('./routes/ventas.routes')
const reportesRoutes = require('./routes/reportes.routes')
const categoriasRoutes = require('./routes/categorias.routes')
const proveedoresRoutes = require('./routes/proveedores.routes')
const empleadosRoutes = require('./routes/empleados.routes')
const direccionesRoutes = require('./routes/direcciones.routes')
const inventarioRoutes = require('./routes/inventario.routes')
const metodosPagoRoutes = require('./routes/metodosPago.routes')
const authRoutes = require('./routes/auth.routes')
const { ROLES, ALL_ROLES, requireRole, requireRoleByMethod } = require('./middleware/roles')

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
app.use(
  '/api/productos',
  requireRoleByMethod({
    GET: ALL_ROLES,
    POST: [ROLES.ADMINISTRADOR, ROLES.GERENTE, ROLES.BODEGA],
    PUT: [ROLES.ADMINISTRADOR, ROLES.GERENTE, ROLES.BODEGA],
    DELETE: [ROLES.ADMINISTRADOR, ROLES.GERENTE, ROLES.BODEGA]
  }),
  productosRoutes
)
app.use(
  '/api/clientes',
  requireRoleByMethod({
    GET: [ROLES.ADMINISTRADOR, ROLES.GERENTE, ROLES.VENDEDOR, ROLES.ANALISTA],
    POST: [ROLES.ADMINISTRADOR, ROLES.GERENTE, ROLES.VENDEDOR],
    PUT: [ROLES.ADMINISTRADOR, ROLES.GERENTE, ROLES.VENDEDOR],
    DELETE: [ROLES.ADMINISTRADOR, ROLES.GERENTE]
  }),
  clientesRoutes
)
app.use(
  '/api/ventas',
  requireRoleByMethod({
    GET: [ROLES.ADMINISTRADOR, ROLES.GERENTE, ROLES.VENDEDOR, ROLES.ANALISTA],
    POST: [ROLES.ADMINISTRADOR, ROLES.GERENTE, ROLES.VENDEDOR]
  }),
  ventasRoutes
)
app.use('/api/reportes', reportesRoutes)
app.use(
  '/api/categorias',
  requireRoleByMethod({
    GET: [ROLES.ADMINISTRADOR, ROLES.GERENTE, ROLES.BODEGA, ROLES.ANALISTA],
    POST: [ROLES.ADMINISTRADOR, ROLES.GERENTE],
    PUT: [ROLES.ADMINISTRADOR, ROLES.GERENTE],
    DELETE: [ROLES.ADMINISTRADOR, ROLES.GERENTE]
  }),
  categoriasRoutes
)
app.use(
  '/api/proveedores',
  requireRoleByMethod({
    GET: [ROLES.ADMINISTRADOR, ROLES.GERENTE, ROLES.BODEGA, ROLES.ANALISTA],
    POST: [ROLES.ADMINISTRADOR, ROLES.GERENTE],
    PUT: [ROLES.ADMINISTRADOR, ROLES.GERENTE],
    DELETE: [ROLES.ADMINISTRADOR, ROLES.GERENTE]
  }),
  proveedoresRoutes
)
app.use(
  '/api/empleados',
  requireRoleByMethod({
    GET: [ROLES.ADMINISTRADOR, ROLES.GERENTE, ROLES.VENDEDOR, ROLES.ANALISTA],
    POST: [ROLES.ADMINISTRADOR, ROLES.GERENTE],
    PUT: [ROLES.ADMINISTRADOR, ROLES.GERENTE],
    DELETE: [ROLES.ADMINISTRADOR, ROLES.GERENTE]
  }),
  empleadosRoutes
)
app.use(
  '/api/direcciones',
  requireRoleByMethod({
    GET: [ROLES.ADMINISTRADOR, ROLES.GERENTE, ROLES.VENDEDOR, ROLES.ANALISTA],
    POST: [ROLES.ADMINISTRADOR, ROLES.GERENTE, ROLES.VENDEDOR],
    PUT: [ROLES.ADMINISTRADOR, ROLES.GERENTE, ROLES.VENDEDOR],
    DELETE: [ROLES.ADMINISTRADOR, ROLES.GERENTE]
  }),
  direccionesRoutes
)
app.use('/api/inventario', requireRole([ROLES.ADMINISTRADOR, ROLES.GERENTE, ROLES.BODEGA, ROLES.ANALISTA]), inventarioRoutes)
app.use('/api/metodos-pago', requireRole([ROLES.ADMINISTRADOR, ROLES.GERENTE, ROLES.VENDEDOR]), metodosPagoRoutes)
app.use('/api/auth', authRoutes)

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
