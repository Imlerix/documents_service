const router = require('express').Router();
const documentController = require('../controllers/documentController');
const extraFieldController = require("../controllers/extraFieldController");

router.get('/', documentController.route.getAllDocs);
router.get('/:id/person/:person_id', documentController.route.getPersonDoc);

router.post('/addDocumentToPerson', documentController.route.addDocumentToPerson)

router.put('/editPersonData', extraFieldController.route.editExtraForPerson);

module.exports = router;
