const { DataTypes } = require('sequelize')
const sequelize = require('../database/orm')

const DetalleVenta = sequelize.define(
  'DetalleVenta',
  {
    iddetalle: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'iddetalle'
    },
    idventa: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'idventa'
    },
    idproducto: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'idproducto'
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'cantidad'
    },
    preciounitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'preciounitario'
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'subtotal'
    }
  },
  {
    tableName: 'detalle_venta',
    timestamps: false
  }
)

module.exports = DetalleVenta
