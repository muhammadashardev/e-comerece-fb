const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// Helper for generating Modern HTML OTP Template
const generateOTPTemplate = (otp, type = 'Verification') => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            .container { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #f9fafb; border-radius: 12px; }
            .card { background: #ffffff; padding: 32px; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); text-align: center; }
            .header { font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 24px; }
            .otp-box { background-color: #f3f4f6; padding: 24px; border-radius: 12px; margin: 24px 0; }
            .otp-code { font-size: 36px; font-weight: 800; color: #4f46e5; letter-spacing: 8px; }
            .message { color: #4b5563; line-height: 1.6; margin-bottom: 24px; }
            .footer { font-size: 14px; color: #9ca3af; margin-top: 32px; }
            .brand { color: #4f46e5; font-weight: 700; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="card">
                <div class="header">Secure ${type}</div>
                <p class="message">Hello! Use the following code to complete your ${type.toLowerCase()} process. This code is valid for 10 minutes.</p>
                <div class="otp-box"><div class="otp-code">${otp}</div></div>
                <p class="message">If you didn't request this, you can safely ignore this email.</p>
                <div class="footer">&copy; 2024 <span class="brand">E-Commerce App</span>. All rights reserved.</div>
            </div>
        </div>
    </body>
    </html>
    `;
};

// Generate Tokens
const signAccessToken = (user) => jwt.sign({ id: user._id, role: user.role }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
const signRefreshToken = (id) => jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

const createSendToken = async (user, statusCode, res) => {
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user._id);

    // Save refresh token in DB
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const cookieOptions = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    };

    res.cookie('refreshToken', refreshToken, cookieOptions);
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        accessToken,
        data: { user }
    });
};

// 1) REGISTER
exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ status: 'fail', message: 'Missing required fields' });

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ status: 'fail', message: 'Email already exists' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 10 * 60 * 1000;

        // Force role to 'user' for security
        const newUser = await User.create({ name, email, password, role: 'user', otp, otpExpires });

        try {
            await sendEmail({
                email: newUser.email,
                subject: 'Verify your E-Commerce account',
                message: `Your verification code is ${otp}`,
                html: generateOTPTemplate(otp, 'Verification')
            });
            res.status(201).json({ status: 'success', message: 'A secure verification code has been sent to your email.' });
        } catch (err) {
            console.error('EMAIL ERROR:', err);
            console.log('--- DEVELOPER OTP ---', otp);
            return res.status(201).json({ 
                status: 'success', 
                message: 'Error sending email. Use this OTP from terminal to verify:',
                developerOtp: otp // Also sending in response for easier testing
            });
        }
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// 1.5) RESEND OTP
exports.resendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ status: 'fail', message: 'Please provide email' });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ status: 'fail', message: 'No user found' });
        if (user.isVerified) return res.status(400).json({ status: 'fail', message: 'User is already verified' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000;
        await user.save({ validateBeforeSave: false });

        try {
            await sendEmail({
                email: user.email,
                subject: 'Your new verification code',
                message: `Your new verification code is ${otp}`,
                html: generateOTPTemplate(otp, 'Verification')
            });
            res.status(200).json({ status: 'success', message: 'A new code has been sent to your email.' });
        } catch (err) {
            console.error('EMAIL ERROR:', err);
            console.log('--- DEVELOPER OTP RESEND ---', otp);
            return res.status(200).json({ 
                status: 'success', 
                message: 'Error sending email. Use this OTP from terminal:',
                developerOtp: otp
            });
        }
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// 2) VERIFY OTP
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) return res.status(400).json({ status: 'fail', message: 'Please provide email and OTP' });

        const user = await User.findOne({ email, otp, otpExpires: { $gt: Date.now() } });
        if (!user) return res.status(400).json({ status: 'fail', message: 'Invalid or expired code' });

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await createSendToken(user, 200, res);
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// 3) LOGIN
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ status: 'fail', message: 'Please provide email and password' });

        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.correctPassword(password, user.password))) {
            return res.status(401).json({ status: 'fail', message: 'Incorrect email or password' });
        }

        if (!user.isVerified) return res.status(401).json({ status: 'fail', message: 'Please verify your email first' });

        await createSendToken(user, 200, res);
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// 4) REFRESH TOKEN (With Rotation)
exports.refreshToken = async (req, res) => {
    try {
        const oldRefreshToken = req.cookies.refreshToken;
        if (!oldRefreshToken) return res.status(401).json({ status: 'fail', message: 'No refresh token' });

        const decoded = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id);

        if (!user || user.refreshToken !== oldRefreshToken) return res.status(401).json({ status: 'fail', message: 'Invalid token' });

        // Rotation: Issue NEW tokens
        await createSendToken(user, 200, res);
    } catch (err) {
        res.status(401).json({ status: 'fail', message: 'Token refresh failed' });
    }
};

// 5) FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
    try {
        if (!req.body.email) return res.status(400).json({ status: 'fail', message: 'Please provide email' });
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).json({ status: 'fail', message: 'No user found' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000;
        await user.save({ validateBeforeSave: false });

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Reset Code',
                message: `Your reset code is ${otp}`,
                html: generateOTPTemplate(otp, 'Password Reset')
            });
            res.status(200).json({ status: 'success', message: 'Secure code sent to email' });
        } catch (err) {
            console.log('--- DEVELOPER OTP ---', otp);
            return res.status(200).json({ 
                status: 'success', 
                message: 'Error sending email. Use this OTP from terminal to reset:',
                developerOtp: otp
            });
        }
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// 6) RESET PASSWORD
exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, password } = req.body;
        if (!email || !otp || !password) return res.status(400).json({ status: 'fail', message: 'Missing required fields' });

        const user = await User.findOne({ email, otp, otpExpires: { $gt: Date.now() } });
        if (!user) return res.status(400).json({ status: 'fail', message: 'Invalid or expired code' });

        user.password = password;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();
        await createSendToken(user, 200, res);
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// 7) LOGOUT
exports.logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            const user = await User.findOne({ refreshToken });
            if (user) {
                user.refreshToken = undefined;
                await user.save({ validateBeforeSave: false });
            }
        }
        res.clearCookie('refreshToken');
        res.status(200).json({ status: 'success', message: 'Logged out successfully' });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};
