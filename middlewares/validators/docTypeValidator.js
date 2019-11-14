const Sequelize = require('sequelize');
const sequelize = require('../../lib/db');
const {
    DocTypeModel
} = require('../../models');

const create = {
    async check (req, res, next){
        if (req.body.name) {
            let type_name = req.body.name = req.body.name[0].toUpperCase() + req.body.name.slice(1).toLowerCase()

            let docType = await DocTypeModel.findOne({where: {name: type_name}});
            if (docType) res.status(412).json({error: 'Такой тип уже существует'})

            next()
        }
        // res.status(412).send({error: 'Не передано имя типа'})
    }
}

module.exports = {
    create
}

