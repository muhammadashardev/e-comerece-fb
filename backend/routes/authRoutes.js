const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/resend-otp', authController.resendOTP);
router.post('/verify-otp', authController.verifyOTP);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/logout', authController.logout);

// Example protected route for testing
router.get('/me', authMiddleware.protect, (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            user: req.user
        }
    });
});

// Example admin-only route
router.get('/admin-only', authMiddleware.protect, authMiddleware.restrictTo('admin'), (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Welcome Admin!'
    });
});

module.exports = router;
