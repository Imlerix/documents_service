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
        headers,
        query
    } = req;
    const {
        statusCode
    } = res;

    query = JSON.stringify(query, null, 2);
    params = JSON.stringify(params, null, 2);
    headers = JSON.stringify(headers, null, 2);
    body = JSON.stringify(body, null, 2);

    try{
        let log;
        if(path.indexOf('/logs') === -1)
            log = await LogModel.create({
                req: path,
                method,
                status_code: statusCode,
                req_body: body,
                req_params: query || params,
                response_body: JSON.stringify(res.answer_body, null, 2),
                source: headers.toString(),
                created_at: Date.now()
            })
    } catch (e) {
        console.log(e)
    }

    next()
}


module.exports = MainLog;

