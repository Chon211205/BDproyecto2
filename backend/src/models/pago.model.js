const { DataTypes } = require('sequelize')
const sequelize = require('../database/orm')

const Pago = sequelize.define(
  'Pago',
  {
    idpago: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'idpago'
    },
    monto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'monto'
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'fecha'
    },
    idventa: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'idventa'
    },
    idmetodopago: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'idmetodopago'
    }
  },
  {
    tableName: 'pago',
    timestamps: false
  }
)

module.exports = Pago
