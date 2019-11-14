const corsOptions = {
    origin: '*',
    credentials: true,
    allowedHeaders: [ 'Content-Type', 'Authorization' ]
}

const logger = require('morgan')('dev');
const bodyParserJson = require('body-parser').json();
const bodyParserUrl = require('body-parser').urlencoded({extended: true});
const cors = require('cors')(corsOptions);
const errors = require('./errors')

module.exports = [
    logger,
    bodyParserJson,
    bodyParserUrl,
    cors,
    // errors
]
