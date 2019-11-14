const Sequelize = require('sequelize');
const sequelize = require('../lib/db');
const docTypesController = require("./docTypesController");
const userFieldController = require("./userFieldController");
const {
    ExtrafieldModel,
    DocTypeModel
} = require('../models');

const getAll = async function () {
    return await ExtrafieldModel.findAll();
}

const getAllById = async function (doctype_id) {
    let options = { where: {doctype_id} }
    return await ExtrafieldModel.findAll(options);
}

const getById = async function (id) {
    return await ExtrafieldModel.findOne({ where: {id} });
}

const getByNameFromDoc = async function (field_name, doctype_id) {
    return await ExtrafieldModel.findOne({
        where: {
            name: field_name,
            doctype_id: doctype_id
        }
    })
}

const create = async function (field_name, doctype_id) {
    return await ExtrafieldModel.create({
        name: field_name,
        doctype_id: doctype_id
    })
}

const route = {
    async createExtrafield(req, res, next) {
        let {
            doctype_name,
            extra_name
        } = req.body;

        let doctype = await docTypesController.getByName(doctype_name) /// TODO ВЫНЕСТИ В ВАЛИДАТОР!!!"""!!!!!
        if (doctype) {
            let extrafield = await getByNameFromDoc(extra_name, doctype.id);
            if (!extrafield) {
                let new_extrafield = await create(extra_name, doctype.id)
                res.status(200).json({status: 'success', newExtra});
                next()
            } else {
                res.status(404).json({error: 'Доп поле уже существует', extrafield});
            }
        }

        res.status(404).json({error: 'Тип не найден', doctype});
    },
    async editExtraForPerson(req, res, next) {
        let {
            fields, // name, value
            doctype_name,
            person_id // переделать на запрос к БД Мешкова "Люди" по имени
        } = req.body;

        if (doctype_name && person_id) {
            let doctype = await docTypesController.getByName(doctype_name); /// TODO ВЫНЕСТИ В ВАЛИДАТОР!!!"""!!!!!
            if (doctype) {
                let updatedDocuments
                updatedDocuments = await Promise.all(await fields.map(async (field) => {
                    let userField,
                        extraField
                    extraField = await getByNameFromDoc(field.name, doctype.id)
                    extraField  ? (userField = await userFieldController.getById(extraField.id, person_id))
                                : res.status(400).json({error: `Поля ${field.name} не существует`});
                    userField && (await userFieldController.updateValue(extraField.id, person_id, field.value))
                }))
                res.status(200).json({status: 'success'});
                next()
            }
            res.status(400).json({error: 'Такого doctype не существует'});
        }

        res.status(400).json({error: 'Параметры или поля неверно переданы'});
    }
}

module.exports = {
    getAll,
    getAllById,
    getById,
    getByNameFromDoc,
    route
}

