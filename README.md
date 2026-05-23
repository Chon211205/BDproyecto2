# Proyecto 3 - Base de Datos 1

UVGestore es una aplicacion web de gestion para una tienda. Permite administrar productos, categorias, proveedores, clientes, direcciones, empleados, ventas, inventario y reportes. La aplicacion usa React, Node.js/Express, Sequelize ORM y PostgreSQL, todo levantado con Docker Compose.

## Tecnologias

- React + Vite
- Node.js
- Express
- Sequelize ORM
- PostgreSQL
- pgAdmin
- Docker
- Docker Compose

## Requisitos cubiertos

- DBMS relacional: PostgreSQL.
- Docker obligatorio: toda la infraestructura esta en `docker-compose.yml`.
- Variables de entorno: `.env.example` incluye las credenciales requeridas.
- Credenciales fijas de calificacion: usuario `proy3`, contrasena `secret`.
- Rama de entrega: `proyecto-3`.
- 5 roles definidos en el DBMS con `CREATE ROLE`, `GRANT` y `REVOKE`.
- Login/logout con usuarios de prueba por rol.
- Rutas del backend protegidas por rol.
- Vistas del frontend protegidas por rol.
- ORM configurado y usado en CRUD principales.
- Stored procedures invocados desde el backend.
- Stored procedure con parametros de entrada/salida y excepciones.
- Stored procedure con `ROLLBACK` explicito.
- Reportes con SQL avanzado.

## Configuracion inicial

Antes de levantar el proyecto, crea `.env` desde el ejemplo:

```powershell
Copy-Item .env.example .env
```

En Linux/macOS:

```bash
cp .env.example .env
```

El archivo `.env.example` ya contiene las credenciales obligatorias:

```env
POSTGRES_DB=proyecto3
POSTGRES_USER=proy3
POSTGRES_PASSWORD=secret

DB_NAME=proyecto3
DB_USER=proy3
DB_PASSWORD=secret
```

## Levantar el proyecto

Desde la raiz del repositorio:

```powershell
docker compose up -d --build
```

Servicios:

- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Test DB: http://localhost:3000/api/test-db
- pgAdmin: http://localhost:5050

Si se quiere probar como calificador desde cero, eliminando volumenes anteriores:

```powershell
docker compose down -v
docker compose up -d --build
```

PostgreSQL cargara automaticamente:

- `backend/src/database/schema.sql`
- `backend/src/database/seed.sql`

## Usuarios de prueba

Todos los usuarios usan password:

```text
secret
```

| Usuario | Correo / usuario | Rol |
| --- | --- | --- |
| Calificador | `proy3` | `administrador` |
| Administrador | `admin.proy3@gmail.com` | `administrador` |
| Gerente | `gerente.proy3@gmail.com` | `gerente` |
| Vendedor | `vendedor.proy3@gmail.com` | `vendedor` |
| Bodega | `bodega.proy3@gmail.com` | `bodega` |
| Analista | `analista.proy3@gmail.com` | `analista` |

## Seguridad y roles

Los roles existen en PostgreSQL, no solo en la logica de aplicacion. Estan definidos en:

```text
backend/src/database/schema.sql
```

Roles creados con `CREATE ROLE`:

- `rol_administrador`
- `rol_gerente`
- `rol_vendedor`
- `rol_bodega`
- `rol_analista`

Permisos granulares:

| Rol DBMS | Rol app | Responsabilidad | Permisos principales |
| --- | --- | --- | --- |
| `rol_administrador` | `administrador` | Administracion total | `SELECT`, `INSERT`, `UPDATE`, `DELETE` sobre todas las tablas |
| `rol_gerente` | `gerente` | Gestion operativa | CRUD sobre entidades principales, ventas, pagos, inventario y usuarios |
| `rol_vendedor` | `vendedor` | Atencion y ventas | Lectura operativa, clientes/direcciones, ventas y pagos |
| `rol_bodega` | `bodega` | Inventario y productos | Lectura de catalogos, CRUD de productos, movimientos de inventario |
| `rol_analista` | `analista` | Reporteria | `SELECT` sobre tablas y vista de ventas |

Para verificar roles en la base:

```powershell
docker compose exec -T db psql -U proy3 -d proyecto3 -c "SELECT rolname FROM pg_roles WHERE rolname IN ('rol_administrador', 'rol_gerente', 'rol_vendedor', 'rol_bodega', 'rol_analista');"
```

La aplicacion tambien protege rutas:

- Backend: `backend/src/middleware/roles.js`
- Frontend: `frontend/src/components/ProtectedRoute.jsx`
- Matriz de permisos UI: `frontend/src/auth/permissions.js`

El logout esta en:

```text
frontend/src/components/Topbar.jsx
```

## ORM

El ORM utilizado es Sequelize.

Configuracion:

```text
backend/src/database/orm.js
```

Modelos:

```text
backend/src/models/
```

El CRUD principal de la aplicacion usa ORM en:

- `categorias`
- `clientes`
- `proveedores`
- `empleados`
- `direcciones`
- `productos`
- `ventas` para lectura y detalle
- `inventario` para consulta de movimientos
- `metodos-pago`
- autenticacion y validacion de roles

Los reportes se mantienen con SQL explicito porque el enunciado permite SQL directo para consultas avanzadas, subqueries, CTEs y reportes.

Ejemplos de operaciones ORM:

- `Categoria.findAll()`
- `Categoria.create()`
- `categoria.update()`
- `categoria.destroy()`
- `Cliente.findByPk()`
- `Producto.findAll({ include: [...] })`

Tambien hay transacciones explicitas con ORM mediante:

```js
sequelize.transaction(...)
```

Usadas en creaciones con IDs manuales, por ejemplo categorias, empleados y direcciones.

## Stored procedures

Las operaciones criticas del negocio se implementan como stored procedures y se invocan desde el backend mediante Sequelize (`sequelize.query`).

Stored procedures principales:

| Procedure | Uso | Ruta backend |
| --- | --- | --- |
| `registrar_venta` | Registra venta, detalle, pago, movimiento y descuenta stock | `POST /api/ventas/registrar-transaccion` |
| `crear_cliente` | Crea cliente con ID generado en DB | `POST /api/clientes` |
| `crear_proveedor` | Crea proveedor con ID generado en DB | `POST /api/proveedores` |
| `crear_producto` | Crea producto y movimiento inicial de inventario | `POST /api/productos` |
| `actualizar_producto` | Actualiza producto y registra diferencia de stock | `PUT /api/productos/:id` |
| `probar_rollback_inventario` | Demuestra `ROLLBACK` explicito dentro de procedure | `POST /api/inventario/probar-rollback` |

### Procedure con entrada/salida y excepciones

`registrar_venta` tiene parametros `IN` e `INOUT`, y usa `RAISE EXCEPTION`:

```sql
CREATE OR REPLACE PROCEDURE registrar_venta(
    IN p_id_cliente INT,
    IN p_id_empleado INT,
    IN p_id_metodo_pago INT,
    IN p_productos JSONB,
    INOUT p_id_venta INT,
    INOUT p_total NUMERIC
)
```

Ejemplo de prueba directa sin guardar cambios:

```powershell
docker compose exec -T db psql -U proy3 -d proyecto3 -c "BEGIN; CALL registrar_venta(1, 1, 1, jsonb_build_array(jsonb_build_object('idProducto', 1, 'cantidad', 1)), NULL, NULL); ROLLBACK;"
```

### Procedure con ROLLBACK explicito

`probar_rollback_inventario` inserta un movimiento temporal y ejecuta:

```sql
ROLLBACK;
```

Prueba directa:

```powershell
docker compose exec -T db psql -U proy3 -d proyecto3 -c "SELECT COUNT(*) AS antes FROM inventario_movimiento;"
docker compose exec -T db psql -U proy3 -d proyecto3 -c "CALL probar_rollback_inventario(1, 1);"
docker compose exec -T db psql -U proy3 -d proyecto3 -c "SELECT COUNT(*) AS despues FROM inventario_movimiento;"
```

El valor de `antes` y `despues` debe ser igual.

Importante: el `CALL probar_rollback_inventario(...)` debe ejecutarse como comando independiente.

Prueba desde backend:

```powershell
$body = @{
  idProducto = 1
  cantidad = 1
} | ConvertTo-Json -Compress

Invoke-RestMethod `
  -Uri http://localhost:3000/api/inventario/probar-rollback `
  -Method Post `
  -Headers @{ 'x-user-id' = '4'; 'x-user-role' = 'bodega' } `
  -ContentType 'application/json' `
  -Body $body
```

## Pruebas rapidas de ORM

Login:

```powershell
$body = @{
  correoUsuario = 'gerente.proy3@gmail.com'
  passwordUsuario = 'secret'
} | ConvertTo-Json -Compress

Invoke-RestMethod `
  -Uri http://localhost:3000/api/auth/login `
  -Method Post `
  -ContentType 'application/json' `
  -Body $body
```

CRUD categorias desde backend:

```powershell
$headers = @{ 'x-user-id' = '2'; 'x-user-role' = 'gerente' }

Invoke-RestMethod `
  -Uri http://localhost:3000/api/categorias `
  -Headers $headers

$body = @{
  nombreCategoria = 'Categoria ORM README'
  descripcionCategoria = 'Creada para prueba ORM'
} | ConvertTo-Json -Compress

$categoria = Invoke-RestMethod `
  -Uri http://localhost:3000/api/categorias `
  -Method Post `
  -Headers $headers `
  -ContentType 'application/json' `
  -Body $body

$body = @{
  nombreCategoria = 'Categoria ORM README Editada'
  descripcionCategoria = 'Editada para prueba ORM'
} | ConvertTo-Json -Compress

Invoke-RestMethod `
  -Uri "http://localhost:3000/api/categorias/$($categoria.idcategoria)" `
  -Method Put `
  -Headers $headers `
  -ContentType 'application/json' `
  -Body $body

Invoke-RestMethod `
  -Uri "http://localhost:3000/api/categorias/$($categoria.idcategoria)" `
  -Method Delete `
  -Headers $headers
```

## Pruebas desde frontend

1. Abrir http://localhost:5173
2. Iniciar sesion con un usuario de prueba, por ejemplo:

```text
gerente.proy3@gmail.com
secret
```

3. Probar modulos segun rol:

- Gerente: categorias, proveedores, empleados, reportes.
- Vendedor: clientes, direcciones, ventas.
- Bodega: productos e inventario.
- Analista: reportes y consultas de lectura.

4. Crear, editar y eliminar una categoria desde la UI.
5. Verificar en PostgreSQL:

```powershell
docker compose exec -T db psql -U proy3 -d proyecto3 -c "SELECT * FROM categoria ORDER BY idCategoria DESC LIMIT 5;"
```

## Reportes SQL avanzados

Los reportes usan SQL explicito en:

```text
backend/src/routes/reportes.routes.js
```

Incluyen:

- `JOIN`
- Subqueries
- `GROUP BY`
- `HAVING`
- `CTE`
- `VIEW`

Esto cumple con la excepcion del enunciado para consultas avanzadas y reportes.

## Comandos utiles

Levantar:

```powershell
docker compose up -d --build
```

Detener:

```powershell
docker compose down
```

Reiniciar desde cero:

```powershell
docker compose down -v
docker compose up -d --build
```

Logs:

```powershell
docker compose logs backend
docker compose logs db
```

Entrar a PostgreSQL:

```powershell
docker compose exec -T db psql -U proy3 -d proyecto3
```

## pgAdmin

URL:

```text
http://localhost:5050
```

Credenciales:

```text
Email: proy3@gmail.com
Password: secret
```

El servidor `Proyecto 3 DB` se registra automaticamente. Si pide password para la base, usar:

```text
secret
```

## Estructura

```text
BDproyecto2/
├── backend/
│   └── src/
│       ├── database/
│       │   ├── db.js
│       │   ├── orm.js
│       │   ├── schema.sql
│       │   └── seed.sql
│       ├── middleware/
│       ├── models/
│       └── routes/
├── frontend/
├── scripts/
│   ├── ddl.sql
│   ├── inserts.sql
│   └── index.sql
├── docker-compose.yml
├── .env.example
└── README.md
```

## Notas importantes

- El proyecto debe levantarse desde la raiz del repositorio.
- Las credenciales de DB deben ser `proy3 / secret`.
- Si se modifica `schema.sql` o `seed.sql`, usar `docker compose down -v`.
- Los roles estan en PostgreSQL mediante `CREATE ROLE`; no son solo logica de frontend/backend.
- Los CRUD principales usan Sequelize ORM.
- Los stored procedures se invocan desde backend, no desde scripts independientes.
