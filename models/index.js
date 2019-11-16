const DocTypeModel = require('./DocType');
const DocumentModel = require('./Document');
const ExtrafieldModel = require('./Extrafield');
const UserFieldModel = require('./UserField');
const LogModel = require('./Log');

DocTypeModel.hasMany(ExtrafieldModel);
DocTypeModel.hasMany(DocumentModel);

module.exports = {
    DocTypeModel,
    DocumentModel,
    ExtrafieldModel,
    UserFieldModel,
    LogModel
}
