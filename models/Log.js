const Sequelize = require('sequelize');
const {Model} = Sequelize;
const sequelize = require('../lib/db');

class Log extends Model {}

Log.init({
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    req: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    method: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    status_code: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    req_body: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    req_params: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    source: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    created_at: {
        type: Sequelize.DATE,
        allowNull: false
    },
}, {sequelize, modelName: "log"});

module.exports = Log;
