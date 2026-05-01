const express = require('express')
const db = require('../database/db')

const router = express.Router()

// JOIN: ventas con cliente y empleado
router.get('/ventas-clientes', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        v.idVenta,
        v.fecha,
        c.nombreCliente || ' ' || c.apellidoCliente AS cliente,
        e.nombreEmpleado || ' ' || e.apellidoEmpleado AS empleado,
        v.total
      FROM venta v
      JOIN cliente c ON v.idCliente = c.idCliente
      JOIN empleado e ON v.idEmpleado = e.idEmpleado
      ORDER BY v.idVenta;
    `)

    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener ventas con cliente y empleado' })
  }
})

// CTE: productos más vendidos
router.get('/productos-mas-vendidos', async (req, res) => {
  try {
    const result = await db.query(`
      WITH productos_vendidos AS (
        SELECT 
          p.idProducto,
          p.nombreProducto,
          SUM(dv.cantidad) AS totalVendido
        FROM detalle_venta dv
        JOIN producto p ON dv.idProducto = p.idProducto
        GROUP BY p.idProducto, p.nombreProducto
      )
      SELECT 
        idProducto,
        nombreProducto,
        totalVendido
      FROM productos_vendidos
      ORDER BY totalVendido DESC;
    `)

    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener productos más vendidos' })
  }
})

// GROUP BY + HAVING: ventas agrupadas por cliente
router.get('/ventas-por-cliente', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        c.idCliente,
        c.nombreCliente || ' ' || c.apellidoCliente AS cliente,
        COUNT(v.idVenta) AS cantidadVentas,
        SUM(v.total) AS totalComprado
      FROM cliente c
      JOIN venta v ON c.idCliente = v.idCliente
      GROUP BY c.idCliente, c.nombreCliente, c.apellidoCliente
      HAVING SUM(v.total) > 30
      ORDER BY totalComprado DESC;
    `)

    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener ventas por cliente' })
  }
})

router.get('/clientes-direcciones', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        c.idCliente,
        c.nombreCliente || ' ' || c.apellidoCliente AS cliente,
        c.correoCliente,
        c.telefonoCliente,
        d.direccionCliente,
        d.ciudad
      FROM cliente c
      JOIN direccion_cliente d ON c.idCliente = d.idCliente
      ORDER BY c.idCliente;
    `)

    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener clientes con dirección' })
  }
})

// SUBQUERY: productos con precio mayor al promedio
router.get('/productos-precio-promedio', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        idProducto,
        nombreProducto,
        precio
      FROM producto
      WHERE precio > (
        SELECT AVG(precio)
        FROM producto
      )
      ORDER BY precio DESC;
    `)

    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener productos sobre el promedio' })
  }
})

router.get('/dashboard', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        (SELECT COUNT(*) FROM producto) AS totalProductos,
        (SELECT COUNT(*) FROM cliente) AS totalClientes,
        (SELECT COUNT(*) FROM venta) AS totalVentas,
        COALESCE((SELECT SUM(total) FROM venta), 0) AS totalVendido;
    `)

    res.json(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener resumen del dashboard' })
  }
})

router.get('/dashboard/productos-destacados', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        p.idProducto,
        p.nombreProducto,
        p.precio,
        c.nombreCategoria
      FROM producto p
      JOIN categoria c ON p.idCategoria = c.idCategoria
      ORDER BY p.precio DESC
      LIMIT 3;
    `)

    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener productos destacados' })
  }
})

router.get('/dashboard/ultimas-ventas', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        v.idVenta,
        c.nombreCliente || ' ' || c.apellidoCliente AS cliente,
        v.total
      FROM venta v
      JOIN cliente c ON v.idCliente = c.idCliente
      ORDER BY v.fecha DESC, v.idVenta DESC
      LIMIT 5;
    `)

    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener últimas ventas' })
  }
})

router.get('/movimientos-producto', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        p.idProducto,
        p.nombreProducto,
        SUM(CASE WHEN im.tipo = 'entrada' THEN im.cantidad ELSE 0 END) AS totalEntradas,
        SUM(CASE WHEN im.tipo = 'salida' THEN im.cantidad ELSE 0 END) AS totalSalidas,
        SUM(CASE 
          WHEN im.tipo = 'entrada' THEN im.cantidad 
          WHEN im.tipo = 'salida' THEN -im.cantidad 
          ELSE 0 
        END) AS balance
      FROM inventario_movimiento im
      JOIN producto p ON im.idProducto = p.idProducto
      GROUP BY p.idProducto, p.nombreProducto
      ORDER BY p.idProducto;
    `)

    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener reporte de movimientos por producto' })
  }
})

router.get('/clientes-con-compras', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        idCliente,
        nombreCliente,
        apellidoCliente,
        correoCliente,
        telefonoCliente
      FROM cliente
      WHERE idCliente IN (
        SELECT idCliente
        FROM venta
      )
      ORDER BY idCliente;
    `)

    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener clientes con compras' })
  }
})

router.get('/productos-sin-ventas', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        idProducto,
        nombreProducto,
        precio,
        stock
      FROM producto
      WHERE idProducto NOT IN (
        SELECT idProducto
        FROM detalle_venta
      )
      ORDER BY idProducto;
    `)

    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener productos sin ventas' })
  }
})

module.exports = router