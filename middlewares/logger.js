const Sequelize = require('sequelize');
const sequelize = require('../lib/db');
const {
    LogModel
} = require('../models');

const MainLog = async function(req, res, next){
    let {
        method,
        body,
        params,
        path,
        headers
    } = req;
    const {
        statusCode
    } = res;

    params = JSON.stringify(params, null, 2);
    headers = JSON.stringify(headers, null, 2);
    body = JSON.stringify(body, null, 2);

    try{
        let log;
        // if(path.indexOf('/logs') === -1)
        log = await LogModel.create({
            req: path,
            method,
            status_code: statusCode,
            req_body: body,
            req_params: params.toString(),
            source: headers.toString(),
            created_at: Date.now()
        })
        res.logId = log.id;
    } catch (e) {
        console.log(e)
    }

    next()
}


module.exports = MainLog;

