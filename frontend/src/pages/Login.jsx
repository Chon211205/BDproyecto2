import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    usuario: '',
    password: ''
  })

  const [error, setError] = useState('')

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  function iniciarSesion(e) {
    e.preventDefault()
    setError('')

    if (!form.usuario || !form.password) {
      setError('Debes ingresar usuario y contraseña')
      return
    }

    if (form.usuario === 'admin' && form.password === 'admin123') {
      localStorage.setItem('usuarioActivo', form.usuario)
      navigate('/')
      return
    }

    setError('Usuario o contraseña incorrectos')
  }

  return (
    <div className="loginPage">
      <div className="loginCard">
        <div className="loginHeader">
          <div className="loginLogo">UVG</div>
          <h1>UVGStore</h1>
          <p>Inicia sesión para acceder al sistema</p>
        </div>

        {error && <p className="errorMessage">{error}</p>}

        <form className="loginForm" onSubmit={iniciarSesion}>
          <input
            name="usuario"
            placeholder="Usuario"
            value={form.usuario}
            onChange={handleChange}
          />

          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
          />

          <button className="primaryButton" type="submit">
            Iniciar sesión
          </button>
        </form>

        <p className="loginHint">
          Usuario: admin | Contraseña: admin123
        </p>
      </div>
    </div>
  )
}

export default Login