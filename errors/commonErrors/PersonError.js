module.exports = class PersonError extends Error {
    constructor(message){
        super(message);
        this.name = this.constructor.name;
        this.error = this.constructor.name;
        this.message = message || "Пользователь не был передан"
    }
}
