const ExistError = require('../commonErrors/ExistError')

module.exports = class ExistDocError extends ExistError {
    constructor(isNot){
        super('Document', isNot);
        this.name = this.constructor.name;
        this.error = this.constructor.name;
    }
}
