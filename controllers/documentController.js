const Sequelize = require('sequelize');
const sequelize = require('../lib/db');
const {
    DocumentModel,
    DocTypeModel,
    ExtrafieldModel,
    UserFieldModel,
} = require('../models');

const logController = require('./logController')
const docTypesController = require('./docTypesController')
const extraFieldController = require('./extraFieldController')
const userFieldController = require('./userFieldController')
const errors = require('../errors');

const getAll = async function() {
    let attributes = [
        'id',
        'doctype_id',
        'person_id',
        'date_create',
        'date_destroy',
        'city_of_obtaining_id'
    ]
    return await DocumentModel.findAll({
        attributes
    });
}

const getAllForPerson = async function(person_id) {
    let documents = await DocumentModel.findAll({
        where: {
            person_id
        }
    });
    let documentsDeeped = await Promise.all( await documents.map(async (doc) => await getDeepInfoDoc(doc.doctype_id, person_id)))

    return documentsDeeped;
}

const getAllForDoctype = async function(doctype_id) {
    let documents = await DocumentModel.findAll({
        where: {
            doctype_id
        }
    });
    let documentsDeeped = await Promise.all( await documents.map(async (doc) => await getDeepInfoDoc(doc.doctype_id, doc.person_id)))

    return documentsDeeped;
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

const getDeepInfoDoc = async function(document_id, person_id) {
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

const searchByPerson = async function(person_id) {
     return await getAllForPerson(person_id);
}

const route = {
    async getAllDocs(req, res, next) {
        let response = await getAll();
        await logController.updateLogAfterResponse(req.logId, response);
        res.json(response);
        next()
    },
    async searchByQuery(req, res, next){
        try{
            let mapQuery = new Map(Object.entries(req.query)),
                response;
            if (mapQuery.size !== 1) throw new errors.common.QueryParamsError(null, mapQuery.size, true);
            if (!req.query.doctype_name && !req.query.person_id) throw new errors.common.QueryParamsError();

            response = req.query.person_id && await searchByPerson(req.query.person_id) || [];

            if (req.query.doctype_name) {
                let doctype = await docTypesController.getByName(req.query.doctype_name);
                if (!doctype) throw new errors.doctype.ExistDoctypeError();
                response = await getAllForDoctype(doctype.id) || []
            }

            await logController.updateLogAfterResponse(req.logId, response);
            res.json(response);
            next()
        }catch (err) {
            console.log(err)
            err = {
                error: err.name,
                message: err.message
            }
            await logController.updateLogAfterResponse(req.logId, err);
            res.status(404).json(err);
        }
    },
    async addDocumentToPerson(req, res, next) {
        try{
            let {
                person_id,
                doctype_name,
                date_destroy,
                city_of_obtaining_id
            } = req.body;

            if(!person_id || !doctype_name) throw new errors.common.BodyParseError(null, false)

            let doctype = await docTypesController.getByName(doctype_name)
            if (!doctype) throw new errors.doctype.ExistDoctypeError()

            let document = await getByDoctypeForUser(doctype.name, person_id)
            if (document) throw new errors.document.ExistDocError(true)

            let new_document = await createForUser({
                doctype_id: doctype.id,
                person_id,
                date_destroy,
                city_of_obtaining_id
            })

            await logController.updateLogAfterResponse(req.logId, response);
            if (new_document) res.status(200).json({status: 'success', new_document})
            else throw new Error('Не удалось создать документ');

            next()
        }catch (err) {
            err = {
                error: err.name,
                message: err.message
            }
            await logController.updateLogAfterResponse(req.logId, err);
            res.status(404).json(err);
        }
    },
    async deleteDocument(req, res, next) {
        try{
            let {
                person_id,
                doctype_name,
            } = req.body;
            console.log(req.body)

            if(!person_id || !doctype_name) throw new errors.common.BodyParseError(null, false)

            let doctype = await docTypesController.getByName(doctype_name)
            if (!doctype) throw new errors.doctype.ExistDoctypeError()

            let document = await getByDoctypeForUser(doctype.name, person_id)
            if (!document) throw new errors.document.ExistDocError()

            await DocumentModel.destroy({
                where: {
                    doctype_id: doctype.id,
                    person_id
                }
            })
            let extraFields = await ExtrafieldModel.findAll({
                where: {
                    doctype_id: doctype.id,
                    person_id
                }
            })
            await Promise.all(await extraFields.map(async (extra) => {
                await UserFieldModel.destroy({
                    where: {
                        extrafield_id: extra.id
                    }
                })
            }))

            res.status(200).json({status: 'success'})

            next()
        }catch (err) {
            console.log(err)
            err = {
                error: err.name,
                message: err.message
            }
            await logController.updateLogAfterResponse(req.logId, err);
            res.status(404).json(err);
        }
    },
}

module.exports = {
    getAll,
    getById,
    getDeepInfoDoc,
    getByDoctypeForUser,
    createForUser,
    getAllForDoctype,
    getAllForPerson,
    route
}

