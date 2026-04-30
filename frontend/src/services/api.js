const API_URL = import.meta.env.VITE_API_URL

export async function getProductos() {
  const response = await fetch(`${API_URL}/api/productos`)

  if (!response.ok) {
    throw new Error('Error al obtener productos')
  }

  return response.json()
}