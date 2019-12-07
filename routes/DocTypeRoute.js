const router = require('express').Router();
//Controllers
const docTypesController = require("../controllers/docTypesController");
const extraFieldController = require("../controllers/extraFieldController");
//Validators
const docTypeValidator = require('../middlewares/validators/docTypeValidator');

//GET
router.get('/', docTypesController.route.getAllTypes);
// //POST
router.post('/addExtraField', extraFieldController.route.createExtrafield);
router.post('/', docTypeValidator.create.check, docTypesController.route.createDocType);
// //DELETE
router.delete('/deleteExtraField', extraFieldController.route.deleteExtraFields)
router.delete('/', docTypesController.route.deleteDocType)

module.exports = router;
