const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../Middleware/Auth.middleware');

router.post('/login', authController.login);
// console.log('Auth Controller methods:', Object.keys(authController));

// Public routes
router.post('/register', authController.register);

router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.put('/profile', authMiddleware, authController.updateProfile);
router.post('/verify-email', authMiddleware, authController.verifyEmail);
router.post('/send-otp', authController.sendOTP);
router.post('/verify-otp', authController.verifyOTP);
router.get('/verify', authController.verifyToken);

module.exports = router;