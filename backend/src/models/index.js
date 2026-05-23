const Categoria = require('./categoria.model')
const Cliente = require('./cliente.model')
const DetalleVenta = require('./detalleVenta.model')
const DireccionCliente = require('./direccionCliente.model')
const Empleado = require('./empleado.model')
const InventarioMovimiento = require('./inventarioMovimiento.model')
const MetodoPago = require('./metodoPago.model')
const Pago = require('./pago.model')
const Producto = require('./producto.model')
const Proveedor = require('./proveedor.model')
const Usuario = require('./usuario.model')
const Venta = require('./venta.model')

Cliente.hasMany(DireccionCliente, { foreignKey: 'idcliente', as: 'direcciones' })
DireccionCliente.belongsTo(Cliente, { foreignKey: 'idcliente', as: 'cliente' })

Categoria.hasMany(Producto, { foreignKey: 'idcategoria', as: 'productos' })
Producto.belongsTo(Categoria, { foreignKey: 'idcategoria', as: 'categoria' })

Proveedor.hasMany(Producto, { foreignKey: 'idproveedor', as: 'productos' })
Producto.belongsTo(Proveedor, { foreignKey: 'idproveedor', as: 'proveedor' })

Producto.hasMany(InventarioMovimiento, { foreignKey: 'idproducto', as: 'movimientos' })
InventarioMovimiento.belongsTo(Producto, { foreignKey: 'idproducto', as: 'producto' })

Cliente.hasMany(Venta, { foreignKey: 'idcliente', as: 'ventas' })
Venta.belongsTo(Cliente, { foreignKey: 'idcliente', as: 'cliente' })

Empleado.hasMany(Venta, { foreignKey: 'idempleado', as: 'ventas' })
Venta.belongsTo(Empleado, { foreignKey: 'idempleado', as: 'empleado' })

Venta.hasMany(DetalleVenta, { foreignKey: 'idventa', as: 'detalles' })
DetalleVenta.belongsTo(Venta, { foreignKey: 'idventa', as: 'venta' })

Producto.hasMany(DetalleVenta, { foreignKey: 'idproducto', as: 'detallesVenta' })
DetalleVenta.belongsTo(Producto, { foreignKey: 'idproducto', as: 'producto' })

Venta.hasMany(Pago, { foreignKey: 'idventa', as: 'pagos' })
Pago.belongsTo(Venta, { foreignKey: 'idventa', as: 'venta' })

MetodoPago.hasMany(Pago, { foreignKey: 'idmetodopago', as: 'pagos' })
Pago.belongsTo(MetodoPago, { foreignKey: 'idmetodopago', as: 'metodoPago' })

module.exports = {
  Categoria,
  Cliente,
  DetalleVenta,
  DireccionCliente,
  Empleado,
  InventarioMovimiento,
  MetodoPago,
  Pago,
  Producto,
  Proveedor,
  Usuario,
  Venta
}
