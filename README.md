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

## Cómo ejecutar el proyecto

Desde la raíz del proyecto, ejecutar:

```bash
docker compose up --build
