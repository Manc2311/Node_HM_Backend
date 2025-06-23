const express = require('express');
const mainController = require('../controller/mainController');
const router = express.Router();

router.get("/getalldata",mainController.getAllData)

module.exports = router;
