const { DataTypes } = require('sequelize')
const sequelize = require('../database/orm')

const Cliente = sequelize.define(
  'Cliente',
  {
    idcliente: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'idcliente'
    },
    nombrecliente: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'nombrecliente'
    },
    apellidocliente: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'apellidocliente'
    },
    correocliente: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      field: 'correocliente'
    },
    telefonocliente: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'telefonocliente'
    }
  },
  {
    tableName: 'cliente',
    timestamps: false
  }
)

module.exports = Cliente
