require('dotenv-flow').config();
const express = require('express');
const http = require('http');

const sequelize = require('./lib/db');
const seedDB = require('./lib/db_seed');
const middlewares = require('./middlewares');
const routes = require('./routes');

const app = express();

middlewares.forEach(middleware =>
    app.use(middleware)
);
routes.forEach(el =>
    app.use(el.path, el.route)
);

const start = async () => {
    try {
        let server = http.createServer(app);
        await sequelize.sync(
                {force: true}
            );
        console.log(`Sequelize is ready to work with "${process.env.DB_NAME}" database...`);
        await seedDB();
        await server.listen(process.env.PORT);
        console.log(`Server is now running on port ${process.env.PORT} ...`)
    } catch (e) {
        console.log(e)
    }
}

start()
