
const {
    LogModel
} = require('../models');

const getAll = async function (options) {
    return options.where.method ? await LogModel.findAll(options) : await LogModel.findAll()
}

const updateLogAfterResponse = async function(logId, logObjectNew){
    return await LogModel.update({
        response_body: JSON.stringify(logObjectNew, null, 2)
    }, {
        where: {
            id: logId
        }
    })
}

const route = {
    async getAllLogs(req, res, next) {
        try{
            let {
                method,
            } = req.query;
            method = method && method.toUpperCase()

            let options = {
                where: {
                    method
                }
            }
            let response = await getAll(options)
            res.json(response);
            next()
        }catch (err) {
            err = {
                error: err.name,
                message: err.message
            }
            res.status(404).json(err)
        }
    },
}

module.exports = {
    getAll,
    updateLogAfterResponse,
    route
}

