const { DataTypes } = require('sequelize')
const sequelize = require('../database/orm')

const Proveedor = sequelize.define(
  'Proveedor',
  {
    idproveedor: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'idproveedor'
    },
    nombreproveedor: {
      type: DataTypes.STRING(150),
      allowNull: false,
      field: 'nombreproveedor'
    },
    telefonoproveedor: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'telefonoproveedor'
    },
    correoproveedor: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      field: 'correoproveedor'
    }
  },
  {
    tableName: 'proveedor',
    timestamps: false
  }
)

module.exports = Proveedor
