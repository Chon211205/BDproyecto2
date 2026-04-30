CREATE INDEX idx_producto_idCategoria
ON producto (idCategoria);

CREATE INDEX idx_producto_idProveedor
ON producto (idProveedor);

CREATE INDEX idx_venta_idCliente
ON venta (idCliente);

CREATE INDEX idx_venta_idEmpleado
ON venta (idEmpleado);

CREATE INDEX idx_detalle_venta_idVenta
ON detalle_venta (idVenta);

CREATE INDEX idx_detalle_venta_idProducto
ON detalle_venta (idProducto);

CREATE INDEX idx_pago_idVenta
ON pago (idVenta);

CREATE INDEX idx_pago_idMetodoPago
ON pago (idMetodoPago);

CREATE INDEX idx_inventario_movimiento_idProducto
ON inventario_movimiento (idProducto);

CREATE INDEX idx_cliente_correoCliente
ON cliente (correoCliente);