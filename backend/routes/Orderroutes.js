const express = require('express');
const router = express.Router();
const {
    addOrderItems,
    getOrderById,
    getMyOrders,
    updateOrderToPaid,
    getAllOrders,
    updateOrderStatus
} = require('../controllers/Ordercontroller');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// All order routes are protected
router.use(protect);

router.post('/', addOrderItems);
router.get('/mine', getMyOrders);

// Admin routes
router.get('/', restrictTo('admin'), getAllOrders);
router.put('/:id/status', restrictTo('admin'), updateOrderStatus);

// General protected routes
router.get('/:id', getOrderById);
router.put('/:id/pay', updateOrderToPaid);

module.exports = router;
