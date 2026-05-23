const { DataTypes } = require('sequelize')
const sequelize = require('../database/orm')

const Producto = sequelize.define(
  'Producto',
  {
    idproducto: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'idproducto'
    },
    nombreproducto: {
      type: DataTypes.STRING(150),
      allowNull: false,
      field: 'nombreproducto'
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'precio'
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'stock'
    },
    idcategoria: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'idcategoria'
    },
    idproveedor: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'idproveedor'
    }
  },
  {
    tableName: 'producto',
    timestamps: false
  }
)

module.exports = Producto
