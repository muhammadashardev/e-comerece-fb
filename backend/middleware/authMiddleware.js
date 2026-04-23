const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
exports.protect = async (req, res, next) => {
    try {
        let token;
       if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies && req.cookies.accessToken) {
            token = req.cookies.accessToken;
        }

        if (!token) {
            return res.status(401).json({ status: 'fail', message: 'You are not logged in. Please log in to get access.' });
        }

        // 2) Verify token
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        // 3) Check if user still exists
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return res.status(401).json({ status: 'fail', message: 'The user belonging to this token no longer exists.' });
        }

        // GRANT ACCESS TO PROTECTED ROUTE
        console.log(`DEBUG: User ${currentUser._id} authenticated with role ${currentUser.role}`);
        req.user = currentUser;
        next();
    } catch (err) {
        console.error('AUTH ERROR:', err.message);
        return res.status(401).json({ status: 'fail', message: 'Invalid token or token expired.' });
    }

};

// Role-based access control
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles ['admin', 'user']. role='user'
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                status: 'fail',
                message: 'You do not have permission to perform this action'
            });
        }
        next();
    };
};
