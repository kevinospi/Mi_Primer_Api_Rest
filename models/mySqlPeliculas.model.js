const { DataTypes } = require('sequelize');
const { bdmysqlNube } = require('../database/mySqlConnection');

const Peliculas = bdmysqlNube.define('peliculas',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false
  }
);

module.exports = {
  Peliculas
};