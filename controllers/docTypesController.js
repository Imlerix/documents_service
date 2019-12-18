const Sequelize = require('sequelize');
const sequelize = require('../lib/db');

const errors = require('../errors')
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

        res.answer_body = response
        res.json(response);
        next()
    },
    async createDocType(req, res, next) {
        try{
            if (!req.body.name) throw new errors.common.BodyParseError()

            let searchExisted = await getByName(req.body.name)
            if (searchExisted) throw new errors.doctype.ExistDoctypeError(true)

            let new_doctype = await create(req.body.name)

            let answer_body = {status: 'success', new_doctype}
            res.answer_body = answer_body
            res.status(200).json(answer_body);

        }catch (e) {
            e = {
                error: e.name,
                message: e.message
            }

            res.answer_body = err;
            res.status(404).json(e)
        }
        next()
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

            let answer_body = {status: 'success'}
            res.answer_body = answer_body
            res.status(200).json(answer_body);
        }catch (e) {
            e = {
                error: e.name,
                message: e.message
            }
            res.answer_body = err;
            res.status(404).json(e)
        }
        next()
    },

}

module.exports = {
    getAll,
    getAllByName,
    getById,
    getByName,
    route
}

