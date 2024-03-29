const errors = require('../errors')
const docTypesController = require("./docTypesController");
const userFieldController = require("./userFieldController");
const {
    ExtrafieldModel,
    DocTypeModel,
    UserFieldModel
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

const destroy = async function (field_name, doctype_id) {
    return await ExtrafieldModel.destroy({
        where: {
            name: field_name,
            doctype_id: doctype_id
        }
    })
}

const destroyAllForDoctype = async function (doctype_name, fields) {
    try {
        if (!doctype_name) throw new errors.common.BodyParseError(null, false)


        let doctype = await docTypesController.getByName(doctype_name);
        if (!doctype) throw new errors.doctype.ExistDoctypeError();

        await Promise.all(await fields.map(async (field) => {
            let extraField = await getByNameFromDoc(field.name, doctype.id)
            if(!extraField) throw new errors.extraField.ExistExtraFieldError()

            await userFieldController.destroy({
                where: {
                    extrafield_id: extraField.id
                }
            })
            await destroy(field.name, doctype.id)
        }))
    }catch (err) {
        return err;
    }
}

const route = {
    async createExtrafield(req, res, next) {
        try {
            let {
                doctype_name,
                extra_name
            } = req.body;

            if (!doctype_name && !extra_name) throw new errors.common.BodyParseError(null, false)

            let doctype = await docTypesController.getByName(doctype_name)
            if (!doctype) throw new errors.doctype.ExistDoctypeError()

            let extrafield = await getByNameFromDoc(extra_name, doctype.id);
            if (extrafield) throw new errors.extraField.ExistExtraFieldError(true)

            let new_extrafield = await create(extra_name, doctype.id)

            let answer_body = {status: 'success', new_extrafield}
            res.answer_body = answer_body
            res.status(200).json(answer_body);

        }catch (err) {
            err = {
                error: err.name,
                message: err.message
            }
            res.answer_body = err;
            res.status(404).json(err)
        }
        next()
    },
    async editExtraForPerson(req, res, next) {
        try {
            let updatedDocuments;
            let {
                fields, // [{name, value}]
                doctype_name,
                person_id // переделать на запрос к БД Мешкова "Люди" по имени
            } = req.body;

            if (!doctype_name && !person_id) throw new errors.common.BodyParseError(null, false)

            let doctype = await docTypesController.getByName(doctype_name);
            if (!doctype) throw new errors.doctype.ExistDoctypeError();

            updatedDocuments = await Promise.all(await fields.map(async (field) => {
                let extraField = await getByNameFromDoc(field.name, doctype.id)
                if(!extraField) throw new errors.extraField.ExistExtraFieldError()

                return await userFieldController.updateValue(person_id, extraField.id, field.value)
            }))

            let answer_body = {status: 'success'}
            res.answer_body = answer_body
            res.status(200).json(answer_body);


        }catch (err) {
            console.log(err)
            err = {
                error: err.name,
                message: err.message
            }

            res.answer_body = err
            res.status(404).json(err)
        }
        next()
    },
    async deleteExtraFields(req, res, next) {
        try {
            let {
                fields, // [{name, value}]
                doctype_name,
            } = req.body;

            if (!doctype_name) throw new errors.common.BodyParseError(null, false)

            let doctype = await docTypesController.getByName(doctype_name);
            if (!doctype) throw new errors.doctype.ExistDoctypeError();

            let wrongFields = []

            await Promise.all(await fields.map(async (field) => {
                let extraField = await getByNameFromDoc(field.name, doctype.id)
                // if(!extraField) throw new errors.extraField.ExistExtraFieldError()
                if(!extraField) {
                    wrongFields.push(field);
                    return;
                }

                await userFieldController.destroy(extraField.id)
                await destroy(field.name, doctype.id)
            }))

            let answer_body = {status: 'success', wrongFields}
            res.answer_body = answer_body
            res.status(200).json(answer_body);

        }catch (err) {
            err = {
                error: err.name,
                message: err.message
            }
            res.answer_body = err;
            res.status(404).json(err)
        }
        next()
    },

}

module.exports = {
    getAll,
    getAllById,
    getById,
    getByNameFromDoc,
    destroyAllForDoctype,
    route
}

