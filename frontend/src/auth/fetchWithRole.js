import { getUsuarioActivo } from './permissions'

const originalFetch = window.fetch.bind(window)

window.fetch = (input, init = {}) => {
  const usuarioActivo = getUsuarioActivo()

  if (!usuarioActivo?.rol) {
    return originalFetch(input, init)
  }

  const headers = new Headers(init.headers || {})
  headers.set('x-user-role', usuarioActivo.rol)
  headers.set('x-user-id', usuarioActivo.idUsuario)

  return originalFetch(input, {
    ...init,
    headers
  })
}
