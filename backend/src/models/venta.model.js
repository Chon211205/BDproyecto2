const { DataTypes } = require('sequelize')
const sequelize = require('../database/orm')

const Venta = sequelize.define(
  'Venta',
  {
    idventa: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'idventa'
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'fecha'
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'total'
    },
    idcliente: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'idcliente'
    },
    idempleado: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'idempleado'
    }
  },
  {
    tableName: 'venta',
    timestamps: false
  }
)

module.exports = Venta
