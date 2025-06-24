const express = require('express');
const policyController = require('../controller/policyController');
const router = express.Router();


router.get("/getalldata", policyController.getAllData);
router.post('/calculate', policyController.CalculatePolicyDetails);
router.post('/illustrations', policyController.getAllIllustrations);
router.get('/illustration/:id', policyController.getIllustrationById);



router.get('/types', policyController.getTypes);

module.exports = router;