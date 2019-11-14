const Sequelize = require('sequelize');
const sequelize = require('../lib/db');
const {
    ExtrafieldModel,
    UserFieldModel,
    DocTypeModel
} = require('../models');

const getAll = async function () {
    return await DocTypeModel.findAll();
}

const getById = async function (doctype_id) {
    return await DocTypeModel.findOne({ where: {id: doctype_id} });
}
const getByName = async function (doctype_name) {
    return await DocTypeModel.findOne({ where: {name: doctype_name} });
}

const route = {
    async getAllTypes(req, res, next) {
        let response = await getAll();
        res.json(response);
        next()
    },
    async createDocType(req, res, next) {
        await DocTypeModel.create({
            name: req.body.name
        })
        res.status(200).json();
        next()
    },

}

module.exports = {
    getAll,
    getById,
    getByName,
    route
}

