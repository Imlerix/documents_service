const router = require('express').Router();
//Controllers


//GET
router.get('', async (req, res, next) => res.send("Docs-service for Mospolytech"));

module.exports = router;
