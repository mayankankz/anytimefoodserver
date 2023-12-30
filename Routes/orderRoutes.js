
const express = require('express');
const { placeOrderValidation } = require('../middleware/validators');
const { placeOrder, getAllCustomerOrders } = require('../controllers/ordersController');




const router = express.Router();

router.post('/placeorder', placeOrder);

router.get('/customer/orders/:id', getAllCustomerOrders);


module.exports = router;
