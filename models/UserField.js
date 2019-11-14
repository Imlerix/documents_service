const Sequelize = require('sequelize');
const {Model} = Sequelize;
const sequelize = require('../lib/db');

class UserField extends Model {}

UserField.init({
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    person_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    extrafield_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    value: {
        type: Sequelize.TEXT,
        allowNull: true
    }
}, {sequelize, modelName: "userfield"});

module.exports = UserField;
