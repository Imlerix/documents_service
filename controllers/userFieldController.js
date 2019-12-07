const Sequelize = require('sequelize');
const sequelize = require('../lib/db');
const {
    UserFieldModel
} = require('../models');

const getAll = async function () {
    return await UserFieldModel.findAll();
}

const getById = async function (person_id, extrafield_id) {
    let options = {
        where: {
            person_id,
            extrafield_id,
        }
    }
    return await UserFieldModel.findOne(options);
}

const create = async function (person_id, extrafield_id) {
    return await UserFieldModel.create({
        person_id,
        extrafield_id
    })
}

const destroy = async function (person_id, extrafield_id) {
    return await UserFieldModel.destroy({
        person_id,
        extrafield_id
    })
}

const updateValue = async function (person_id, extrafield_id, value) {
    let options = {
        where: {
            person_id,
            extrafield_id
        },
        returning: true
    }
    let valueField = await getById(person_id, extrafield_id)
    if (!valueField) await create(person_id, extrafield_id)

    return await UserFieldModel.update({value}, options);
}

module.exports = {
    getAll,
    getById,
    updateValue,
    destroy
}

