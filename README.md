# Proyecto 2 Base de Datos 1

Aplicacion web para gestion de tienda con frontend en React, backend en Node.js/Express y base de datos PostgreSQL.

## Requisitos

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
- Backend Express
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

## SQL y transacciones

El backend usa SQL explicito mediante el paquete `pg`; no se usa ORM. Las transacciones se marcan explicitamente en el codigo con `BEGIN`, `COMMIT` y `ROLLBACK`, por ejemplo en el registro de ventas y actualizacion de productos.
