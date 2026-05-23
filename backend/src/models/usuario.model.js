const { DataTypes } = require('sequelize')
const sequelize = require('../database/orm')

const Usuario = sequelize.define(
  'Usuario',
  {
    idusuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'idusuario'
    },
    nombreusuario: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'nombreusuario'
    },
    correousuario: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      field: 'correousuario'
    },
    passwordusuario: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'passwordusuario'
    },
    rol: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'rol'
    }
  },
  {
    tableName: 'usuario',
    timestamps: false
  }
)

module.exports = Usuario
