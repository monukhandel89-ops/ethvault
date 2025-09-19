const express = require('express');
const router = express.Router();
const pariveshApiTestController = require('../controllers/pariveshApiTestController');
const {
  mint,
  balance
} = require("../controllers/pariveshApiTestController");

// mint ERC20 contract

router.route('/mint').post(mint);


// balance
router.route('/balance/:address').get(balance);

module.exports = router;
