const { DataTypes } = require('sequelize')
const sequelize = require('../database/orm')

const Empleado = sequelize.define(
  'Empleado',
  {
    idempleado: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'idempleado'
    },
    nombreempleado: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'nombreempleado'
    },
    apellidoempleado: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'apellidoempleado'
    },
    puesto: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'puesto'
    }
  },
  {
    tableName: 'empleado',
    timestamps: false
  }
)

module.exports = Empleado
