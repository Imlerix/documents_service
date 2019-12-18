const router = require('express').Router();
//Controllers


//GET
router.get('', async (req, res, next) => {
    res.answer_body = "Docs-service for Mospolytech"
    res.status(200).send("Docs-service for Mospolytech")
    next()
} );

module.exports = router;
