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

router.post('/register', async (req, res) => {
  try {
    const { correoUsuario, passwordUsuario } = req.body

    if (!correoUsuario || !passwordUsuario) {
      return res.status(400).json({
        error: 'Correo y contraseña son obligatorios'
      })
    }

    if (passwordUsuario.length < 6) {
      return res.status(400).json({
        error: 'La contraseña debe tener al menos 6 caracteres'
      })
    }

    const usuarioExistente = await db.query(
      `
      SELECT idUsuario
      FROM usuario
      WHERE correoUsuario = $1;
      `,
      [correoUsuario]
    )

    if (usuarioExistente.rows.length > 0) {
      return res.status(409).json({
        error: 'Ya existe un usuario registrado con ese correo'
      })
    }

    const result = await db.query(
      `
      INSERT INTO usuario (nombreUsuario, correoUsuario, passwordUsuario, rol)
      VALUES ($1, $2, $3, $4)
      RETURNING idUsuario, nombreUsuario, correoUsuario, rol;
      `,
      [correoUsuario, correoUsuario, passwordUsuario, 'usuario']
    )

    res.status(201).json({
      mensaje: 'Usuario registrado correctamente',
      usuario: {
        idUsuario: result.rows[0].idusuario,
        nombreUsuario: result.rows[0].nombreusuario,
        correoUsuario: result.rows[0].correousuario,
        rol: result.rows[0].rol
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: 'Error al registrar usuario'
    })
  }
})

module.exports = router