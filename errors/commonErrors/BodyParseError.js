module.exports = class BodyParseError extends Error {
    constructor(message, isVerify, fieldsCount){
        super(message);
        this.name = this.constructor.name;
        this.error = this.constructor.name;

        if (message) this.message = message
        else {
            if (fieldsCount === 0) this.message = 'Поля не были переданы'
            if (!isVerify && isVerify !== null) this.message = 'Неверные поля были переданы'
            if (!fieldsCount && isVerify === null) this.message = 'Ошибка в передачи полей запроса'
        }
    }
}
