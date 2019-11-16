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

    try{
        let log = await LogModel.create({
            req: path,
            method,
            status_code: statusCode,
            req_body: body,
            req_params: params.toString(),
            source: headers.toString(),
            created_at: Date.now()
        })
    } catch (e) {
        console.log(e)
    }


    next()
}


module.exports = MainLog;

