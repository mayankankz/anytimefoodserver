
const express = require('express');
const { registerValidation, loginValidation, } = require('../middleware/validators');
const { registerUser, loginService } = require('../controllers/userController');



const router = express.Router();

router.post('/register',registerValidation, registerUser);

router.post('/login',loginValidation, loginService);


module.exports = router;
