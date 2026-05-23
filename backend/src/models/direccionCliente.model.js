const { DataTypes } = require('sequelize')
const sequelize = require('../database/orm')

const DireccionCliente = sequelize.define(
  'DireccionCliente',
  {
    iddireccion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'iddireccion'
    },
    direccioncliente: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: 'direccioncliente'
    },
    ciudad: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'ciudad'
    },
    idcliente: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'idcliente'
    }
  },
  {
    tableName: 'direccion_cliente',
    timestamps: false
  }
)

module.exports = DireccionCliente
