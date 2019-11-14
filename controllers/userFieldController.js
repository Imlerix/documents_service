const Sequelize = require('sequelize');
const sequelize = require('../lib/db');
const {
    UserFieldModel
} = require('../models');

const getAll = async function () {
    return await UserFieldModel.findAll();
}

const getById = async function (extrafield_id, person_id) {
    let options = {
        where: {
            person_id,
            extrafield_id,
        }
    }
    return await UserFieldModel.findOne(options);
}

const updateValue = async function (extrafield_id, person_id, value) {
    let options = {
        where: {
            person_id,
            extrafield_id
        }
    }
    return await UserFieldModel.update({value}, options);
}

module.exports = {
    getAll,
    getById,
    updateValue
}

