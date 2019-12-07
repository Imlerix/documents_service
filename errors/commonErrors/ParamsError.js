module.exports = class ParamsError extends Error {
    constructor(message){
        super(message);
        this.name = this.constructor.name;
        this.error = this.constructor.name;
        this.message = message || "Параметр не был передан"
    }
}
