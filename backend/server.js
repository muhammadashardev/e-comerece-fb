const express = require('express');
const dotenv = require('dotenv');
dotenv.config(); // Must be at the top!
console.log('--- SERVER STARTING / RELOADING ---');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/Productroutes');
const cartRoutes = require('./routes/Cartroutes');
const wishlistRoutes = require('./routes/Wishlistroutes');
const orderRoutes = require('./routes/Orderroutes');
const todoRoutes = require('./routes/Todoroutes');


// Validate Environment Variables
const requiredEnvs = ['PORT', 'MONGO_URI', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET', 'EMAIL_USER', 'EMAIL_PASS'];
requiredEnvs.forEach(env => {
    if (!process.env[env]) {
        console.error(`ERROR: Missing required environment variable ${env} in .env file!`);
    }
});

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true
}));

// Request Logger (Helpful for debugging Postman calls)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    if (req.body && Object.keys(req.body).length > 0) {
        // Obscure password in logs
        const loggedBody = { ...req.body };
        if (loggedBody.password) loggedBody.password = '********';
        console.log('Body:', loggedBody);
    }
    next();
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/wishlist', wishlistRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/todos', todoRoutes);

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    // 1. Log the full error to the terminal for debugging
    console.log('--- ERROR START ---');
    console.log('Time:', new Date().toISOString());
    console.log('Path:', req.url);
    console.error('Error Details:', err);
    console.log('--- ERROR END ---');

    // 2. Default error state
    let statusCode = 500;
    let message = 'Something went wrong! Please check the server logs.';
    let status = 'error';

    // 3. Extract status code and message if available
    if (err.statusCode) statusCode = err.statusCode;
    if (err.status) status = err.status;
    if (err.message) message = err.message;

    // 4. Handle specific common errors
    if (err.name === 'ValidationError') {
        statusCode = 400;
        status = 'fail';
    }
    
    if (err.code === 11000) {
        statusCode = 400;
        status = 'fail';
        const field = err.keyValue ? Object.keys(err.keyValue)[0] : 'record';
        message = `Duplicate field value: ${field}. Please use another value!`;
    }

    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        statusCode = 401;
        status = 'fail';
        message = 'Authentication failed. Please log in again.';
    }

    if (err.name === 'MulterError') {
        statusCode = 400;
        status = 'fail';
        message = `Upload Error: ${err.message}`;
        if (err.code === 'LIMIT_FILE_SIZE') {
            message = 'File is too large! Maximum limit is 5MB.';
        }
    }

    if (err.name === 'TimeoutError' || err.http_code === 499) {
        statusCode = 408; // Request Timeout
        status = 'error';
        message = 'The upload took too long and was timed out. Please try a smaller file or better connection.';
    }

    // 5. Final response
    res.status(statusCode).json({
        status,
        message,
        debug_err: err,
        debug_stack: err.stack 
    });
});




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
