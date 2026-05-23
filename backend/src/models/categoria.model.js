const { DataTypes } = require('sequelize')
const sequelize = require('../database/orm')

const Categoria = sequelize.define(
  'Categoria',
  {
    idcategoria: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'idcategoria'
    },
    nombrecategoria: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'nombrecategoria'
    },
    descripcioncategoria: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: 'descripcioncategoria'
    }
  },
  {
    tableName: 'categoria',
    timestamps: false
  }
)

module.exports = Categoria
