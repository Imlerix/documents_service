const Sequelize = require('sequelize');
const sequelize = require('../lib/db');
const {
    DocumentModel,
    DocTypeModel,
    ExtrafieldModel,
    UserFieldModel,
} = require('../models');

const docTypesController = require('./docTypesController')
const extraFieldController = require('./extraFieldController')
const userFieldController = require('./userFieldController')

const getAll = async function() {
    return await DocumentModel.findAll();
}

const getById = async function(id) {
    return await DocumentModel.findOne({where: {id}})
}

const getByDoctypeForUser = async function(doctype_name, person_id) {
    let doctype = await docTypesController.getByName(doctype_name)
    if (doctype)
        return await DocumentModel.findOne({
            where: {
                doctype_id: doctype.id,
                person_id
            }
        })
    return null;
}

const createForUser = async function({doctype_id, person_id, date_destroy, city_of_obtaining_id = 1}) {
    return await DocumentModel.create({
        doctype_id,
        person_id,
        date_create: Date.now(),
        date_destroy: Date.parse(date_destroy),
        city_of_obtaining_id
    })
}

const getDeep = async function(document_id, person_id) { // TODO Переделать на получение через doctype_id
    let document = await getById(document_id);
    let doctype = await docTypesController.getById(document.doctype_id);
    let extrafields = await extraFieldController.getAllById(doctype.id);
    let userFields = await Promise.all( await extrafields.map(async (field) => {
        return {
            name: field.name,
            value: await userFieldController.getById(field.id, person_id)
        }
    }))

    return {
        id: document.id,
        person: person_id,// TODO get person from another service
        doctype: doctype.name,
        fields: userFields,
        city_of_obtaining_id: document.city_of_obtaining_id, // TODO get city from another service
        date_create: document.date_create,
        date_destroy: document.date_destroy,
    }
}

const route = {
    async getAllDocs(req, res, next) {
        let response = await getAll();
        res.json(response);
        next()
    },
    async getPersonDoc(req, res, next) {
        let response = await getDeep(req.params.id, req.params.person_id);
        res.json(response);
        next()
    },
    async addDocumentToPerson(req, res, next) {
        let {
            person_id,
            doctype_name,
            date_destroy,
            city_of_obtaining_id
        } = req.body;
        if(person_id && doctype_name) {
            let doctype = await docTypesController.getByName(doctype_name)
            if (doctype) {
                let document = await getByDoctypeForUser(doctype.name, person_id)
                if (doctype && !document){
                    let new_document = await createForUser({
                        doctype_id: doctype.id,
                        person_id,
                        date_destroy,
                        city_of_obtaining_id
                    })
                    if (new_document) res.status(200).json({status: 'success', new_document})
                    else res.status(500).json({error: 'Не удалось создать документ'});
                }
                res.status(400).json({error: 'Документ уже существует у данного юзера'});
            }
            res.status(400).json({error: 'Такого doctype не существует'})
        }
        res.status(400).json({error: 'Неверно переданы поля'});
        next()
    },
}

module.exports = {
    getAll,
    getById,
    getDeep,
    getByDoctypeForUser,
    createForUser,
    route
}

