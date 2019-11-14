const Sequelize = require('sequelize');
const {Model} = Sequelize;
const sequelize = require('../lib/db');

class Extrafield extends Model {}

Extrafield.init({
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    doctype_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
}, {sequelize, modelName: "extrafield"});

module.exports = Extrafield;
