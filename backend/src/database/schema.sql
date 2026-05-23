CREATE TABLE cliente (
    idCliente INT PRIMARY KEY,
    nombreCliente VARCHAR(100) NOT NULL,
    apellidoCliente VARCHAR(100) NOT NULL,
    correoCliente VARCHAR(150) NOT NULL UNIQUE,
    telefonoCliente VARCHAR(20) NOT NULL
);

CREATE TABLE direccion_cliente (
    idDireccion INT PRIMARY KEY,
    direccionCliente VARCHAR(200) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    idCliente INT NOT NULL,
    CONSTRAINT fk_direccion_cliente_cliente
        FOREIGN KEY (idCliente) REFERENCES cliente(idCliente)
);

CREATE TABLE empleado (
    idEmpleado INT PRIMARY KEY,
    nombreEmpleado VARCHAR(100) NOT NULL,
    apellidoEmpleado VARCHAR(100) NOT NULL,
    puesto VARCHAR(100) NOT NULL
);

CREATE TABLE categoria (
    idCategoria INT PRIMARY KEY,
    nombreCategoria VARCHAR(100) NOT NULL,
    descripcionCategoria VARCHAR(200) NOT NULL
);

CREATE TABLE proveedor (
    idProveedor INT PRIMARY KEY,
    nombreProveedor VARCHAR(150) NOT NULL,
    telefonoProveedor VARCHAR(20) NOT NULL,
    correoProveedor VARCHAR(150) NOT NULL UNIQUE
);

CREATE TABLE producto (
    idProducto INT PRIMARY KEY,
    nombreProducto VARCHAR(150) NOT NULL,
    precio DECIMAL(10,2) NOT NULL CHECK (precio >= 0),
    stock INT NOT NULL CHECK (stock >= 0),
    idCategoria INT NOT NULL,
    idProveedor INT NOT NULL,
    CONSTRAINT fk_producto_categoria
        FOREIGN KEY (idCategoria) REFERENCES categoria(idCategoria),
    CONSTRAINT fk_producto_proveedor
        FOREIGN KEY (idProveedor) REFERENCES proveedor(idProveedor)
);

CREATE TABLE inventario_movimiento (
    idMovimiento INT PRIMARY KEY,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('entrada', 'salida')),
    cantidad INT NOT NULL CHECK (cantidad > 0),
    fecha DATE NOT NULL,
    idProducto INT NOT NULL,
    CONSTRAINT fk_inventario_movimiento_producto
        FOREIGN KEY (idProducto) REFERENCES producto(idProducto)
);

CREATE TABLE venta (
    idVenta INT PRIMARY KEY,
    fecha DATE NOT NULL,
    total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
    idCliente INT NOT NULL,
    idEmpleado INT NOT NULL,
    CONSTRAINT fk_venta_cliente
        FOREIGN KEY (idCliente) REFERENCES cliente(idCliente),
    CONSTRAINT fk_venta_empleado
        FOREIGN KEY (idEmpleado) REFERENCES empleado(idEmpleado)
);

CREATE TABLE detalle_venta (
    idDetalle INT PRIMARY KEY,
    idVenta INT NOT NULL,
    idProducto INT NOT NULL,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    precioUnitario DECIMAL(10,2) NOT NULL CHECK (precioUnitario >= 0),
    subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
    CONSTRAINT fk_detalle_venta_venta
        FOREIGN KEY (idVenta) REFERENCES venta(idVenta),
    CONSTRAINT fk_detalle_venta_producto
        FOREIGN KEY (idProducto) REFERENCES producto(idProducto)
);

CREATE TABLE metodo_pago (
    idMetodoPago INT PRIMARY KEY,
    tipoMetodoPago VARCHAR(50) NOT NULL
);

CREATE TABLE pago (
    idPago INT PRIMARY KEY,
    monto DECIMAL(10,2) NOT NULL CHECK (monto >= 0),
    fecha DATE NOT NULL,
    idVenta INT NOT NULL,
    idMetodoPago INT NOT NULL,
    CONSTRAINT fk_pago_venta
        FOREIGN KEY (idVenta) REFERENCES venta(idVenta),
    CONSTRAINT fk_pago_metodo_pago
        FOREIGN KEY (idMetodoPago) REFERENCES metodo_pago(idMetodoPago)
);

CREATE OR REPLACE PROCEDURE registrar_venta(
    IN p_id_cliente INT,
    IN p_id_empleado INT,
    IN p_id_metodo_pago INT,
    IN p_productos JSONB,
    INOUT p_id_venta INT,
    INOUT p_total NUMERIC
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_producto JSONB;
    v_id_producto INT;
    v_cantidad INT;
    v_nombre_producto VARCHAR(150);
    v_precio NUMERIC(10,2);
    v_stock INT;
    v_subtotal NUMERIC(10,2);
    v_id_detalle INT;
    v_id_movimiento INT;
    v_id_pago INT;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM cliente WHERE idCliente = p_id_cliente) THEN
        RAISE EXCEPTION 'Cliente con ID % no existe', p_id_cliente;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM empleado WHERE idEmpleado = p_id_empleado) THEN
        RAISE EXCEPTION 'Empleado con ID % no existe', p_id_empleado;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM metodo_pago WHERE idMetodoPago = p_id_metodo_pago) THEN
        RAISE EXCEPTION 'Metodo de pago con ID % no existe', p_id_metodo_pago;
    END IF;

    IF p_productos IS NULL
        OR jsonb_typeof(p_productos) <> 'array'
        OR jsonb_array_length(p_productos) = 0 THEN
        RAISE EXCEPTION 'La venta debe incluir al menos un producto';
    END IF;

    LOCK TABLE venta, detalle_venta, pago, inventario_movimiento IN EXCLUSIVE MODE;

    p_total := 0;

    FOR v_producto IN SELECT * FROM jsonb_array_elements(p_productos)
    LOOP
        v_id_producto := (v_producto ->> 'idProducto')::INT;
        v_cantidad := (v_producto ->> 'cantidad')::INT;

        IF v_id_producto IS NULL OR v_cantidad IS NULL THEN
            RAISE EXCEPTION 'Cada producto debe incluir idProducto y cantidad';
        END IF;

        SELECT nombreProducto, precio, stock
        INTO v_nombre_producto, v_precio, v_stock
        FROM producto
        WHERE idProducto = v_id_producto
        FOR UPDATE;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Producto con ID % no existe', v_id_producto;
        END IF;

        IF v_cantidad <= 0 THEN
            RAISE EXCEPTION 'La cantidad del producto % debe ser mayor a 0', v_nombre_producto;
        END IF;

        IF v_cantidad > v_stock THEN
            RAISE EXCEPTION 'Stock insuficiente para %. Stock disponible: %, cantidad solicitada: %',
                v_nombre_producto, v_stock, v_cantidad;
        END IF;

        p_total := p_total + (v_precio * v_cantidad);
    END LOOP;

    SELECT COALESCE(MAX(idVenta), 0) + 1 INTO p_id_venta FROM venta;

    INSERT INTO venta (idVenta, fecha, idCliente, idEmpleado, total)
    VALUES (p_id_venta, CURRENT_DATE, p_id_cliente, p_id_empleado, p_total);

    FOR v_producto IN SELECT * FROM jsonb_array_elements(p_productos)
    LOOP
        v_id_producto := (v_producto ->> 'idProducto')::INT;
        v_cantidad := (v_producto ->> 'cantidad')::INT;

        SELECT nombreProducto, precio, stock
        INTO v_nombre_producto, v_precio, v_stock
        FROM producto
        WHERE idProducto = v_id_producto
        FOR UPDATE;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Producto con ID % no existe', v_id_producto;
        END IF;

        IF v_cantidad > v_stock THEN
            RAISE EXCEPTION 'Stock insuficiente para %. Stock disponible: %, cantidad solicitada: %',
                v_nombre_producto, v_stock, v_cantidad;
        END IF;

        v_subtotal := v_precio * v_cantidad;

        SELECT COALESCE(MAX(idDetalle), 0) + 1 INTO v_id_detalle FROM detalle_venta;

        INSERT INTO detalle_venta (idDetalle, idVenta, idProducto, cantidad, precioUnitario, subtotal)
        VALUES (v_id_detalle, p_id_venta, v_id_producto, v_cantidad, v_precio, v_subtotal);

        UPDATE producto
        SET stock = stock - v_cantidad
        WHERE idProducto = v_id_producto;

        SELECT COALESCE(MAX(idMovimiento), 0) + 1 INTO v_id_movimiento FROM inventario_movimiento;

        INSERT INTO inventario_movimiento (idMovimiento, tipo, cantidad, fecha, idProducto)
        VALUES (v_id_movimiento, 'salida', v_cantidad, CURRENT_DATE, v_id_producto);
    END LOOP;

    SELECT COALESCE(MAX(idPago), 0) + 1 INTO v_id_pago FROM pago;

    INSERT INTO pago (idPago, idVenta, idMetodoPago, monto, fecha)
    VALUES (v_id_pago, p_id_venta, p_id_metodo_pago, p_total, CURRENT_DATE);
END;
$$;

CREATE VIEW vista_ventas_completas AS
SELECT
    v.idVenta,
    v.fecha,
    c.nombreCliente || ' ' || c.apellidoCliente AS cliente,
    e.nombreEmpleado || ' ' || e.apellidoEmpleado AS empleado,
    v.total,
    mp.tipoMetodoPago AS metodoPago,
    p.monto AS montoPagado
FROM venta v
JOIN cliente c ON v.idCliente = c.idCliente
JOIN empleado e ON v.idEmpleado = e.idEmpleado
LEFT JOIN pago p ON v.idVenta = p.idVenta
LEFT JOIN metodo_pago mp ON p.idMetodoPago = mp.idMetodoPago;

CREATE TABLE usuario (
    idUsuario INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    nombreUsuario VARCHAR(100) NOT NULL,
    correoUsuario VARCHAR(150) NOT NULL UNIQUE,
    passwordUsuario VARCHAR(100) NOT NULL,
    rol VARCHAR(50) NOT NULL DEFAULT 'vendedor'
);

ALTER TABLE usuario
ADD CONSTRAINT chk_usuario_rol
CHECK (rol IN ('administrador', 'gerente', 'vendedor', 'bodega', 'analista'));

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'rol_administrador') THEN
        CREATE ROLE rol_administrador;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'rol_gerente') THEN
        CREATE ROLE rol_gerente;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'rol_vendedor') THEN
        CREATE ROLE rol_vendedor;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'rol_bodega') THEN
        CREATE ROLE rol_bodega;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'rol_analista') THEN
        CREATE ROLE rol_analista;
    END IF;
END
$$;

REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT USAGE ON SCHEMA public TO rol_administrador, rol_gerente, rol_vendedor, rol_bodega, rol_analista;

REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM rol_administrador, rol_gerente, rol_vendedor, rol_bodega, rol_analista;
REVOKE ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public FROM rol_administrador, rol_gerente, rol_vendedor, rol_bodega, rol_analista;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO rol_administrador;
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO rol_administrador;

GRANT SELECT, INSERT, UPDATE, DELETE ON
    cliente,
    direccion_cliente,
    empleado,
    categoria,
    proveedor,
    producto,
    inventario_movimiento,
    venta,
    detalle_venta,
    metodo_pago,
    pago,
    usuario
TO rol_gerente;
GRANT SELECT ON vista_ventas_completas TO rol_gerente;
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO rol_gerente;

GRANT SELECT ON producto, categoria, proveedor, empleado, metodo_pago, vista_ventas_completas TO rol_vendedor;
GRANT SELECT, INSERT, UPDATE ON cliente, direccion_cliente TO rol_vendedor;
GRANT SELECT, INSERT ON venta, detalle_venta, pago, inventario_movimiento TO rol_vendedor;
GRANT UPDATE (stock) ON producto TO rol_vendedor;
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO rol_vendedor;
GRANT EXECUTE ON PROCEDURE registrar_venta(INT, INT, INT, JSONB, INT, NUMERIC) TO rol_administrador, rol_gerente, rol_vendedor;

GRANT SELECT ON categoria, proveedor, producto, inventario_movimiento TO rol_bodega;
GRANT INSERT, UPDATE, DELETE ON producto TO rol_bodega;
GRANT INSERT ON inventario_movimiento TO rol_bodega;
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO rol_bodega;

GRANT SELECT ON
    cliente,
    direccion_cliente,
    empleado,
    categoria,
    proveedor,
    producto,
    inventario_movimiento,
    venta,
    detalle_venta,
    metodo_pago,
    pago,
    vista_ventas_completas
TO rol_analista;

GRANT rol_administrador TO proy3;
GRANT rol_gerente TO proy3;
GRANT rol_vendedor TO proy3;
GRANT rol_bodega TO proy3;
GRANT rol_analista TO proy3;
