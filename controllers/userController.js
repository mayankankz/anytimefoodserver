const { validationResult } = require('express-validator');
const User = require('../models/Users');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
exports.registerUser = async (req, res, next) => {
    const { username, email, password, mobilenumber } = req.body;
    
    try {
        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                errors: errors.array(),
            });
        }

        // Check if email or mobile number is already registered
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [
                    { email },
                    { mobilenumber },
                ],
            },
        });

        if (existingUser) {
            return res.status(409).json({
                status: 'error',
                message: 'Email or mobile number is already registered',
            });
        }

        const hasedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = await User.create({
            username,
            email,
            password : hasedPassword,
            mobilenumber,
        });

        res.status(201).json({
            status: 'success',
            message: 'User created successfully',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                mobilenumber: user.mobilenumber,
                Role: user.isAdmin ? 'Admin' : 'Customer'
            },
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
            error: error.message, // Include the actual error message for debugging
        });
    }
};


exports.loginService = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                errors: errors.array(),
            });
        }

        // Find the user by email
        const user = await User.findOne({ where: { email } });

        // Check if the user exists
        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials',
            });
        }

        // Check if the password is correct
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials',
            });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.id, email: user.email }, 'your-secret-key', { expiresIn: '1h' });
        res.cookie('token', token, {
            httpOnly: true,
            expiresIn: 3600 * 60 *60,
            secure: true,
           
        })
        console.log(user);
        res.status(200).json({
            status: 'success',
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                mobilenumber: user.mobilenumber,
                Role: user.isAdmin ? 'Admin' : 'Customer'
            },
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
            error: error.message, // Include the actual error message for debugging
        });
    }
};