# Proyecto 2 Base de Datos 1

Aplicacion web para gestion de tienda con frontend en React, backend en Node.js/Express y base de datos PostgreSQL.

## Requisitos
=======
# UVGestore

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
- CRUD completo de productos.
- CRUD completo de clientes.
- CRUD completo de categorías.
- CRUD completo de proveedores.
- CRUD completo de direcciones.
- CRUD completo de empleados.
- Registro de ventas con transacción explícita.
- Manejo de errores con ROLLBACK cuando una venta supera el stock disponible.
- Visualización de movimientos de inventario.
- Registro automático de movimientos cuando se edita el stock de productos.
- Reportes visibles en la interfaz con datos reales de la base de datos.
- Reportes con JOIN, subqueries, GROUP BY, HAVING, CTE y VIEW.
- Exportación de reporte a CSV desde la interfaz.
- Búsqueda y filtros en distintas pantallas.
- Mensajes visibles de éxito y error para el usuario.
- Popup de confirmación antes de eliminar registros.

## Requisitos previos

Antes de ejecutar el proyecto, se necesita tener instalado:

- Docker
- Docker Compose

## Configuracion

El proyecto usa variables de entorno. Antes de levantarlo, crea el archivo `.env` a partir del ejemplo:

```bash
cp .env.example .env
```

En PowerShell de Windows tambien puedes usar:

```powershell
Copy-Item .env.example .env
```

Este paso copia las variables requeridas desde `.env.example` hacia `.env`, que es el archivo que lee Docker Compose al levantar los contenedores.

Las credenciales requeridas para calificacion ya estan definidas en `.env.example`:

```env
POSTGRES_USER=proy2
POSTGRES_PASSWORD=secret
DB_USER=proy2
DB_PASSWORD=secret
```

## Levantar el proyecto

Desde la raiz del repositorio ejecuta:

```bash
docker compose up --build
```

Esto levanta toda la infraestructura definida en `docker-compose.yml`:

- Base de datos PostgreSQL
- Backend Expres
- Frontend React/Vite
- pgAdmin

## URLs

- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Prueba de base de datos: http://localhost:3000/api/test-db
- pgAdmin: http://localhost:5050

## Base de datos

El contenedor de PostgreSQL carga automaticamente:

- `backend/src/database/schema.sql`
- `backend/src/database/seed.sql`

Tambien se incluyen scripts de avance en `scripts/`:

- `ddl.sql`
- `inserts.sql`
- `index.sql`

## Cómo ejecutar el proyecto

Desde la raíz del proyecto, ejecutar:

```bash
docker compose up --build

