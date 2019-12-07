module.exports = class QueryParamsError extends Error {
    constructor(message, paramsCount, isSingle){
        super(message);
        this.name = this.constructor.name;
        this.error = this.constructor.name;

        if (message) this.message = message
        else if (paramsCount || isSingle) {
            if (paramsCount === 0) this.message = 'Параметры не были переданы'
            if (isSingle && paramsCount > 1) this.message = 'Для запроса требуется всего один параметр'
            if (isSingle === null && paramsCount === 1) this.message = 'Для запроса требуется больше одного параметра'
        }else {
            this.message = 'Параметры неверно переданы'
        }
    }
}
