const express = require('express')
const db = require('../database/db')

const router = express.Router()

router.post('/login', async (req, res) => {
  try {
    const { correoUsuario, passwordUsuario } = req.body

    if (!correoUsuario || !passwordUsuario) {
      return res.status(400).json({
        error: 'Correo y contraseña son obligatorios'
      })
    }

    const result = await db.query(
      `
      SELECT 
        idUsuario,
        nombreUsuario,
        correoUsuario,
        passwordUsuario,
        rol
      FROM usuario
      WHERE correoUsuario = $1;
      `,
      [correoUsuario]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: 'Usuario o contraseña incorrectos'
      })
    }

    const usuario = result.rows[0]

    if (usuario.passwordusuario !== passwordUsuario) {
      return res.status(401).json({
        error: 'Usuario o contraseña incorrectos'
      })
    }

    res.json({
      mensaje: 'Inicio de sesión exitoso',
      usuario: {
        idUsuario: usuario.idusuario,
        nombreUsuario: usuario.nombreusuario,
        correoUsuario: usuario.correousuario,
        rol: usuario.rol
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: 'Error al iniciar sesión'
    })
  }
})

module.exports = router