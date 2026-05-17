# Proyecto 3 Base de Datos 1

UVGestore es una aplicación web de gestión para una tienda. El sistema permite administrar productos, categorías, proveedores, clientes, direcciones, empleados, ventas, inventario y reportes. La aplicación utiliza frontend en React, backend en Node.js/Express y base de datos PostgreSQL, todo levantado mediante Docker Compose.

## Tecnologías utilizadas

- React + Vite
- Node.js
- Express
- PostgreSQL
- pgAdmin
- Docker
- Docker Compose

## Funcionalidades principales

- Login y logout con sesión.
- Autenticación validando usuarios registrados en PostgreSQL.
- 5 roles definidos en el DBMS con `CREATE ROLE`, `GRANT` y `REVOKE`.
- Rutas del backend protegidas por rol del usuario autenticado.
- Vistas y navegación de la UI protegidas por rol.
- CRUD de productos, clientes, categorías, proveedores, direcciones y empleados.
- Registro de ventas con transacción explícita.
- Manejo de errores con `ROLLBACK` cuando una venta supera el stock disponible.
- Visualización de movimientos de inventario.
- Reportes con `JOIN`, subqueries, `GROUP BY`, `HAVING`, `CTE` y `VIEW`.
- Exportación de reporte a CSV desde la interfaz.

## Requisitos previos

Antes de levantar el proyecto se debe tener instalado:

- Docker
- Docker Compose

## Configuración

El proyecto usa variables de entorno. Antes de levantarlo, crea el archivo `.env` a partir del ejemplo:

```bash
cp .env.example .env
```

En PowerShell de Windows también puedes usar:

```powershell
Copy-Item .env.example .env
```

Las credenciales requeridas para calificación ya están definidas en `.env.example`:

```env
POSTGRES_USER=proy3
POSTGRES_PASSWORD=secret
DB_USER=proy3
DB_PASSWORD=secret
```

## Levantar el proyecto

Desde la raíz del repositorio ejecuta:

```bash
docker compose up --build
```

Esto levanta toda la infraestructura definida en `docker-compose.yml`:

- Base de datos PostgreSQL
- Backend Express
- Frontend React/Vite
- pgAdmin

Si ya habías levantado el proyecto antes de cambiar los scripts SQL, recrea el volumen de la base de datos para que Docker vuelva a cargar el esquema y los datos iniciales:

```bash
docker compose down -v
docker compose up --build
```

## URLs

- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Prueba de base de datos: http://localhost:3000/api/test-db
- pgAdmin: http://localhost:5050

pgAdmin se inicializa con el servidor `Proyecto 3 DB` registrado automáticamente. La conexión usa las variables de `.env` para el host, usuario, base de datos y contraseña.

## Usuarios de prueba

Todos los usuarios tienen contraseña:

```text
secret
```

| Usuario | Correo o usuario | Rol |
| --- | --- | --- |
| Calificador | `proy3` | `administrador` |
| Administrador | `admin.proy3@gmail.com` | `administrador` |
| Gerente | `gerente.proy3@gmail.com` | `gerente` |
| Vendedor | `vendedor.proy3@gmail.com` | `vendedor` |
| Bodega | `bodega.proy3@gmail.com` | `bodega` |
| Analista | `analista.proy3@gmail.com` | `analista` |

## Esquema de roles

Los roles existen en PostgreSQL mediante `CREATE ROLE` en el archivo:

```text
backend/src/database/schema.sql
```

| Rol DBMS | Rol de aplicación | Tablas accesibles | Operaciones permitidas |
| --- | --- | --- | --- |
| `rol_administrador` | `administrador` | Todas las tablas y vistas | `SELECT`, `INSERT`, `UPDATE`, `DELETE` |
| `rol_gerente` | `gerente` | Clientes, direcciones, empleados, categorías, proveedores, productos, inventario, ventas, detalle, pagos, usuarios y vista de ventas | `SELECT`, `INSERT`, `UPDATE`, `DELETE` |
| `rol_vendedor` | `vendedor` | Productos, categorías, proveedores, empleados, métodos de pago, clientes, direcciones, ventas, detalle, pagos, inventario y vista de ventas | Lectura operativa, crear/actualizar clientes y direcciones, registrar ventas, insertar pagos y movimientos, actualizar stock |
| `rol_bodega` | `bodega` | Categorías, proveedores, productos e inventario | Lectura de catálogos, CRUD de productos e inserción de movimientos |
| `rol_analista` | `analista` | Clientes, direcciones, empleados, categorías, proveedores, productos, inventario, ventas, detalle, métodos de pago, pagos y vista de ventas | Solo `SELECT` para reportería |

## Scripts de base de datos

El contenedor de PostgreSQL carga automáticamente los siguientes archivos:

- `backend/src/database/schema.sql`
- `backend/src/database/seed.sql`

También se incluyen scripts de avance en la carpeta `scripts/`:

- `ddl.sql`
- `inserts.sql`
- `index.sql`

## Base de datos

La base de datos está diseñada para manejar la información principal de una tienda. Incluye entidades relacionadas con:

- Productos
- Categorías
- Proveedores
- Clientes
- Direcciones
- Empleados
- Ventas
- Detalle de ventas
- Pagos
- Inventario
- Usuarios
- Roles

El esquema permite registrar ventas, controlar inventario y generar reportes usando consultas SQL avanzadas.

## Seguridad y roles

El sistema implementa seguridad en dos niveles:

1. **Nivel de base de datos:**  
   Se utilizan roles de PostgreSQL creados con `CREATE ROLE`, permisos asignados con `GRANT` y restricciones aplicadas con `REVOKE`.

2. **Nivel de aplicación:**  
   El backend valida el rol del usuario autenticado y protege rutas según los permisos definidos. Además, el frontend muestra u oculta vistas dependiendo del rol del usuario.

Esto permite que cada tipo de usuario solo pueda acceder a las funciones correspondientes.

## Transacciones

El registro de ventas utiliza una transacción explícita para asegurar la consistencia de la información.

Si la venta se puede realizar correctamente, se confirma con:

```sql
COMMIT;
```

Si ocurre un error, por ejemplo cuando la cantidad vendida supera el stock disponible, se revierte la operación con:

```sql
ROLLBACK;
```

De esta forma se evita que se registren ventas incompletas o inconsistentes.

## Reportes

El sistema incluye reportes construidos con consultas SQL avanzadas, utilizando:

- `JOIN`
- Subconsultas
- `GROUP BY`
- `HAVING`
- `CTE`
- `VIEW`

Además, algunos reportes pueden exportarse a CSV desde la interfaz.

## Comandos útiles

Levantar el proyecto:

```bash
docker compose up --build
```

Detener los contenedores:

```bash
docker compose down
```

Eliminar contenedores y volumen de base de datos:

```bash
docker compose down -v
```

Reconstruir todo el proyecto:

```bash
docker compose down -v
docker compose up --build
```

Ver logs:

```bash
docker compose logs
```

Ver logs del backend:

```bash
docker compose logs backend
```

Ver logs de la base de datos:

```bash
docker compose logs db
```

## Acceso a pgAdmin

Para ingresar a pgAdmin, abre:

```text
http://localhost:5050
```

El servidor de base de datos aparece registrado automáticamente como:

```text
Proyecto 3 DB
```

Si pgAdmin solicita contraseña para conectarse al servidor de base de datos, usa:

```text
secret
```

## Estructura general del proyecto

```text
BDproyecto2/
├── backend/
│   └── src/
│       └── database/
│           ├── schema.sql
│           └── seed.sql
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

- Si se modifican los archivos SQL iniciales, se debe ejecutar `docker compose down -v` para eliminar el volumen anterior de PostgreSQL.
- Todos los usuarios de prueba utilizan la contraseña `secret`.
- El usuario `proy3` está definido para facilitar la calificación.
- pgAdmin ya incluye el servidor `Proyecto 3 DB` registrado automáticamente.
- La aplicación debe levantarse desde la raíz del repositorio.

