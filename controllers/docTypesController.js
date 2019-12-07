const errors = require('../errors')
const documentController = require('./documentController')
const extraFieldController = require('./extraFieldController')
const logController = require("./logController");
const {
    ExtrafieldModel,
    UserFieldModel,
    DocumentModel,
    DocTypeModel
} = require('../models');

const getAll = async function () {
    return await DocTypeModel.findAll();
}

const getAllByName = async function (name) {
    return await DocTypeModel.findAll({where: {name}});
}

const getById = async function (doctype_id) {
    return await DocTypeModel.findOne({ where: {id: doctype_id} });
}
const getByName = async function (doctype_name) {
    return await DocTypeModel.findOne({ where: {name: doctype_name} });
}
const create = async function (doctype_name) {
    return await DocTypeModel.create({name: doctype_name});
}
const destroy = async function (doctype_name) {
    return await DocTypeModel.destroy({ where: {name: doctype_name} });
}

const route = {
    async getAllTypes(req, res, next) {
        let response = await getAll();

        console.log(req.logId)
        await logController.updateLogAfterResponse(req.logId, response);
        res.json(response);
        next()
    },
    async createDocType(req, res, next) {
        try{
            if (!req.body.name) throw new errors.common.BodyParseError()

            let searchExisted = await getByName(req.body.name)
            if (searchExisted) throw new errors.doctype.ExistDoctypeError(true)

            let new_doctype = await create(req.body.name)

            await logController.updateLogAfterResponse(req.logId, new_doctype);
            res.status(200).json({status: 'success', new_doctype});
            next()
        }catch (e) {
            e = {
                error: e.name,
                message: e.message
            }

            await logController.updateLogAfterResponse(req.logId, err);
            res.status(404).json(e)
        }
    },
    async deleteDocType(req, res, next) {
        try{
            if (!req.body.name) throw new errors.common.BodyParseError()

            let searchExisted = await getByName(req.body.name)
            if (!searchExisted) throw new errors.doctype.ExistDoctypeError()

            await destroy(searchExisted.name)
            await DocumentModel.destroy({where: {doctype_id: searchExisted.id}})
            let extraFields = await ExtrafieldModel.findAll({
                where: {
                    doctype_id: searchExisted.id,
                }
            })
            await Promise.all(await extraFields.map(async (extra) => {
                await UserFieldModel.destroy({
                    where: {
                        extrafield_id: extra.id
                    }
                })
            }))

            res.status(200).json({status: 'success'});
            next()
        }catch (e) {
            e = {
                error: e.name,
                message: e.message
            }

            await logController.updateLogAfterResponse(req.logId, err);
            res.status(404).json(e)
        }
    },

}

module.exports = {
    getAll,
    getAllByName,
    getById,
    getByName,
    route
}

