const express = require('express')
const { Usuario } = require('../models')

const router = express.Router()

router.post('/login', async (req, res) => {
  try {
    const { correoUsuario, passwordUsuario } = req.body

    if (!correoUsuario || !passwordUsuario) {
      return res.status(400).json({
        error: 'Correo y contrasena son obligatorios'
      })
    }

    const usuario = await Usuario.findOne({
      where: { correousuario: correoUsuario }
    })

    if (!usuario || usuario.passwordusuario !== passwordUsuario) {
      return res.status(401).json({
        error: 'Usuario o contrasena incorrectos'
      })
    }

    res.json({
      mensaje: 'Inicio de sesion exitoso',
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
      error: 'Error al iniciar sesion'
    })
  }
})

router.post('/register', async (req, res) => {
  try {
    const { correoUsuario, passwordUsuario } = req.body

    if (!correoUsuario || !passwordUsuario) {
      return res.status(400).json({
        error: 'Correo y contrasena son obligatorios'
      })
    }

    if (passwordUsuario.length < 6) {
      return res.status(400).json({
        error: 'La contrasena debe tener al menos 6 caracteres'
      })
    }

    const usuarioExistente = await Usuario.findOne({
      where: { correousuario: correoUsuario }
    })

    if (usuarioExistente) {
      return res.status(409).json({
        error: 'Ya existe un usuario registrado con ese correo'
      })
    }

    const usuario = await Usuario.create({
      nombreusuario: correoUsuario,
      correousuario: correoUsuario,
      passwordusuario: passwordUsuario,
      rol: 'vendedor'
    })

    res.status(201).json({
      mensaje: 'Usuario registrado correctamente',
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
      error: 'Error al registrar usuario'
    })
  }
})

module.exports = router
