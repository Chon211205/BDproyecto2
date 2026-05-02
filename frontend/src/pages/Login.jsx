import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    correoUsuario: '',
    passwordUsuario: ''
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

    if (!form.correoUsuario || !form.passwordUsuario) {
      setError('Debes ingresar correo y contraseña')
      return
    }

    fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error)
          return
        }

        localStorage.setItem('usuarioActivo', JSON.stringify(data.usuario))
        navigate('/')
      })
      .catch(() => {
        setError('No se pudo conectar con el servidor')
      })
  }

  return (
    <div className="loginPage">
      <div className="loginCard">
        <div className="loginHeader">
          <div className="loginLogo">UVG</div>
          <h1>UVGestore</h1>
          <p>Inicia sesión con un usuario registrado en la base de datos</p>
        </div>

        {error && <p className="errorMessage">{error}</p>}

        <form className="loginForm" onSubmit={iniciarSesion}>
          <input
            name="correoUsuario"
            type="email"
            placeholder="Correo"
            value={form.correoUsuario}
            onChange={handleChange}
          />

          <input
            name="passwordUsuario"
            type="password"
            placeholder="Contraseña"
            value={form.passwordUsuario}
            onChange={handleChange}
          />

          <button className="primaryButton" type="submit">
            Iniciar sesión
          </button>
        </form>

        <p className="loginHint">
            ¿No tienes cuenta?{' '}
            <button
                className="linkButton"
                onClick={() => navigate('/register')}
            >
                Crear cuenta
            </button>
        </p>

        <p className="loginHint">
        Credenciales fijas de prueba guardadas en la base de datos | Correo: proy2@gmail.com | Contraseña: secret
        </p>

      </div>
    </div>
  )
}

export default Login