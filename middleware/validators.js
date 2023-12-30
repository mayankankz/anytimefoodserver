const { body} = require('express-validator');

const registerValidation = [
  body('username').notEmpty().withMessage('Username cannot be empty'),
  body('mobilenumber').isMobilePhone().withMessage('Invalid mobile number.'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
]

const loginValidation = [
  body('email').notEmpty().withMessage('Username cannot be empty.'),
  body('password').notEmpty().withMessage('Password cannot be empty.'),
]
const placeOrderValidation = [
  body('customerId').notEmpty().withMessage('Customer ID cannot be empty'),
  body('items').notEmpty().withMessage('Items cannot be empty'),
  body('phone').notEmpty().withMessage('Phone cannot be empty'),
  body('address').notEmpty().withMessage('Address cannot be empty'),
  body('paymentType').notEmpty().withMessage('Payment Type cannot be empty'),
  
];

module.exports = {
  registerValidation,
  placeOrderValidation,
  loginValidation
};
