const { DataTypes } = require('sequelize')
const sequelize = require('../database/orm')

const MetodoPago = sequelize.define(
  'MetodoPago',
  {
    idmetodopago: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'idmetodopago'
    },
    tipometodopago: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'tipometodopago'
    }
  },
  {
    tableName: 'metodo_pago',
    timestamps: false
  }
)

module.exports = MetodoPago
