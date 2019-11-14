const Sequelize = require('sequelize');
const {Model} = Sequelize;
const sequelize = require('../lib/db');

class Document extends Model {}

Document.init({
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    doctype_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    person_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    date_create: {
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    date_destroy: {
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    city_of_obtaining_id: {
        type: Sequelize.TEXT,
        allowNull: false
    }
}, {sequelize, modelName: "document"});

module.exports = Document;
