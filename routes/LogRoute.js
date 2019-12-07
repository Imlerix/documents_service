const router = require('express').Router();
//Controllers
const logController = require('../controllers/logController');

//GET
router.get('/', logController.route.getAllLogs);

module.exports = router;
