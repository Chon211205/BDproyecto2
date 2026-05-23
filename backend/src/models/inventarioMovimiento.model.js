const { DataTypes } = require('sequelize')
const sequelize = require('../database/orm')

const InventarioMovimiento = sequelize.define(
  'InventarioMovimiento',
  {
    idmovimiento: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'idmovimiento'
    },
    tipo: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'tipo'
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'cantidad'
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'fecha'
    },
    idproducto: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'idproducto'
    }
  },
  {
    tableName: 'inventario_movimiento',
    timestamps: false
  }
)

module.exports = InventarioMovimiento
