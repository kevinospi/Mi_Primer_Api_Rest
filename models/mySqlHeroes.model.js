const { DataTypes } = require('sequelize');
const { bdmysqlNube } = require('../database/mySqlConnection');

const Heroes = bdmysqlNube.define('heroes',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },

        bio: {
            type: DataTypes.TEXT,
            allowNull: false
        },

        img: {
            type: DataTypes.STRING,
            allowNull: false
        },

        aparicion: {
            type: DataTypes.DATE
        },

        casa: {
            type: DataTypes.STRING
        },

        productora_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    },
    {
        freezeTableName: true,
        createdAt: false,
        updatedAt: false
    }
);

module.exports = {
    Heroes,
};