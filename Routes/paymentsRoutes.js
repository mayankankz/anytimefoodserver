const express = require('express')
const  {
  checkout,
  getKey,
  paymentVerification,
} =  require("../controllers/paymentController.js");

const router = express.Router();

router.post("/checkout" ,checkout);
router.get('/getkey', getKey)
router.post("/paymentverification",paymentVerification);

module.exports = router;