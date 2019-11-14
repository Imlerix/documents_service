const Sequelize = require('sequelize');
const sequelize = require('../../lib/db');
const {
    DocTypeModel
} = require('../../models');

const create = {
    async check (req, res, next){
        let type_name = req.body.name = req.body.name[0].toUpperCase() + req.body.name.slice(1).toLowerCase()
        if (type_name){
            let docType = await DocTypeModel.findOne({where: {name: type_name}});
            if (docType) res.status(412).send({error: 'Такой тип уже существует'})
        } else {
            res.status(412).send({error: 'Не передано имя типа'})
        }
        next()
    }
}

module.exports = {
    create
}

