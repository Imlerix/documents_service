const Sequelize = require('sequelize');
const {Model} = Sequelize;
const sequelize = require('../lib/db');

class DocType extends Model {}

DocType.init({
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true
    }
}, {sequelize, modelName: "doctype"});

module.exports = DocType;
