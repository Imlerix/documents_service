const router = require('express').Router();
const docTypesController = require("../controllers/docTypesController");
const extraFieldController = require("../controllers/extraFieldController");
const docTypeValidator = require('../middlewares/validators/docTypeValidator');

router.get('/', docTypesController.route.getAllTypes);

router.post('/', docTypeValidator.create.check, docTypesController.route.createDocType);
router.post('/addExtraField', extraFieldController.route.createExtrafield);

module.exports = router;
