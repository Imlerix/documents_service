module.exports = class ExistError extends Error {
    constructor(message, isNot){
        super(message);
        this.name = this.constructor.name;
        this.error = this.constructor.name;

        this.message = `${message}${isNot ? '' : ' не'} существует`
    }
}
