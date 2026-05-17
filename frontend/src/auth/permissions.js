export const ROLES = {
  ADMINISTRADOR: 'administrador',
  GERENTE: 'gerente',
  VENDEDOR: 'vendedor',
  BODEGA: 'bodega',
  ANALISTA: 'analista'
}

export const ALL_ROLES = Object.values(ROLES)

export const ROUTE_ROLES = {
  '/': ALL_ROLES,
  '/productos': ALL_ROLES,
  '/clientes': [ROLES.ADMINISTRADOR, ROLES.GERENTE, ROLES.VENDEDOR],
  '/categorias': [ROLES.ADMINISTRADOR, ROLES.GERENTE, ROLES.BODEGA],
  '/proveedores': [ROLES.ADMINISTRADOR, ROLES.GERENTE, ROLES.BODEGA],
  '/direcciones': [ROLES.ADMINISTRADOR, ROLES.GERENTE, ROLES.VENDEDOR],
  '/empleados': [ROLES.ADMINISTRADOR, ROLES.GERENTE],
  '/ventas': [ROLES.ADMINISTRADOR, ROLES.GERENTE, ROLES.VENDEDOR, ROLES.ANALISTA],
  '/ventas/registrar': [ROLES.ADMINISTRADOR, ROLES.GERENTE, ROLES.VENDEDOR],
  '/reportes': [ROLES.ADMINISTRADOR, ROLES.GERENTE, ROLES.ANALISTA],
  '/inventario': [ROLES.ADMINISTRADOR, ROLES.GERENTE, ROLES.BODEGA, ROLES.ANALISTA]
}

export const WRITE_ROLES = {
  productos: [ROLES.ADMINISTRADOR, ROLES.GERENTE, ROLES.BODEGA],
  clientes: [ROLES.ADMINISTRADOR, ROLES.GERENTE, ROLES.VENDEDOR],
  categorias: [ROLES.ADMINISTRADOR, ROLES.GERENTE],
  proveedores: [ROLES.ADMINISTRADOR, ROLES.GERENTE],
  direcciones: [ROLES.ADMINISTRADOR, ROLES.GERENTE, ROLES.VENDEDOR],
  empleados: [ROLES.ADMINISTRADOR, ROLES.GERENTE],
  ventas: [ROLES.ADMINISTRADOR, ROLES.GERENTE, ROLES.VENDEDOR]
}

export function getUsuarioActivo() {
  const usuarioGuardado = localStorage.getItem('usuarioActivo')

  if (!usuarioGuardado) {
    return null
  }

  try {
    return JSON.parse(usuarioGuardado)
  } catch (error) {
    localStorage.removeItem('usuarioActivo')
    return null
  }
}

export function hasRole(usuario, allowedRoles = ALL_ROLES) {
  return Boolean(usuario?.rol && allowedRoles.includes(usuario.rol))
}

export function canAccess(path, usuario = getUsuarioActivo()) {
  const route = Object.keys(ROUTE_ROLES)
    .sort((a, b) => b.length - a.length)
    .find(routePath => path === routePath || path.startsWith(`${routePath}/`))

  return hasRole(usuario, ROUTE_ROLES[route] || ALL_ROLES)
}
