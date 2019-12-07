const ExistError = require('../commonErrors/ExistError')

module.exports = class ExistDoctypeError extends ExistError {
    constructor(isNot){
        super('DocType', isNot);
        this.name = this.constructor.name;
        this.error = this.constructor.name;
    }
}
