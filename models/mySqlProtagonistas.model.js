const { DataTypes } = require('sequelize');
const { bdmysqlNube } = require('../database/mySqlConnection');

const Protagonistas = bdmysqlNube.define('protagonistas',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    heroes_id: {
      type: DataTypes.INTEGER
    },
    peliculas_id: {
      type: DataTypes.INTEGER
    },
    papel: {
      type: DataTypes.STRING
    },
    fecha_participacion: {
      type: DataTypes.DATE
    }
  },
  {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false
  }
);

module.exports = {
  Protagonistas
};