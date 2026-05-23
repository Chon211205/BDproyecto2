const ROLES = {
  ADMINISTRADOR: 'administrador',
  GERENTE: 'gerente',
  VENDEDOR: 'vendedor',
  BODEGA: 'bodega',
  ANALISTA: 'analista'
}

const ALL_ROLES = Object.values(ROLES)
const { Usuario } = require('../models')

function getRequestRole(req) {
  return req.header('x-user-role')
}

function requireRole(allowedRoles) {
  return async (req, res, next) => {
    const userId = req.header('x-user-id')
    const role = getRequestRole(req)

    if (!userId || !role) {
      return res.status(401).json({ error: 'Sesion requerida' })
    }

    try {
      const usuario = await Usuario.findByPk(Number(userId))

      if (!usuario || usuario.rol !== role) {
        return res.status(401).json({ error: 'Sesion invalida' })
      }

      if (!allowedRoles.includes(role)) {
        return res.status(403).json({ error: 'No tienes permiso para realizar esta operacion' })
      }

      next()
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Error validando permisos' })
    }
  }
}

function requireRoleByMethod(methodRoles) {
  return (req, res, next) => {
    const allowedRoles = methodRoles[req.method] || methodRoles.DEFAULT || []
    return requireRole(allowedRoles)(req, res, next)
  }
}

module.exports = {
  ROLES,
  ALL_ROLES,
  requireRole,
  requireRoleByMethod
}
