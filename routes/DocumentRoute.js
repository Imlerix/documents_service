const router = require('express').Router();
//Controllers
const documentController = require('../controllers/documentController');
const extraFieldController = require("../controllers/extraFieldController");

//GET
router.get('/search', documentController.route.searchByQuery);
router.get('/', documentController.route.getAllDocs);
//POST
router.post('/addDocumentToPerson', documentController.route.addDocumentToPerson);
//PUT
router.put('/editPersonData', extraFieldController.route.editExtraForPerson);
//DELETE
router.delete('/', documentController.route.deleteDocument)

module.exports = router;
