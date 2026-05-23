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

Para verificar roles en la base:

```powershell
docker compose exec -T db psql -U proy3 -d proyecto3 -c "SELECT rolname FROM pg_roles WHERE rolname IN ('rol_administrador', 'rol_gerente', 'rol_vendedor', 'rol_bodega', 'rol_analista');"
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
