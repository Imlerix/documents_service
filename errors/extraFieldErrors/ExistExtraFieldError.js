const ExistError = require('../commonErrors/ExistError')

module.exports = class ExistExtraFieldError extends ExistError {
    constructor(isNot){
        super('ExtraField', isNot);
        this.name = this.constructor.name;
        this.error = this.constructor.name;
    }
}
