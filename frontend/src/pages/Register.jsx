import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Register() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    correoUsuario: '',
    passwordUsuario: ''
  })

  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  function registrarUsuario(e) {
    e.preventDefault()
    setMensaje('')
    setError('')

    if (!form.correoUsuario || !form.passwordUsuario) {
      setError('Debes ingresar correo y contraseña')
      return
    }

    fetch('http://localhost:3000/api/auth/register', {
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

        setMensaje('Usuario registrado correctamente. Ahora puedes iniciar sesión.')

        setForm({
          correoUsuario: '',
          passwordUsuario: ''
        })

        setTimeout(() => {
          navigate('/login')
        }, 1000)
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
          <h1>Crear cuenta</h1>
          <p>Registra un usuario nuevo para acceder al sistema</p>
        </div>

        {mensaje && <p className="successMessage">{mensaje}</p>}
        {error && <p className="errorMessage">{error}</p>}

        <form className="loginForm" onSubmit={registrarUsuario}>
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
            Registrarme
          </button>
        </form>

        <p className="loginHint">
          ¿Ya tienes cuenta?{' '}
          <button
            className="linkButton"
            onClick={() => navigate('/login')}
          >
            Iniciar sesión
          </button>
        </p>
      </div>
    </div>
  )
}

export default Register