module.exports = class CreateError extends Error {
    constructor(message){
        super(message);
        this.name = this.constructor.name;
        this.error = this.constructor.name;

        this.message = message || 'DocType с таким именем уже существует'
    }
}
