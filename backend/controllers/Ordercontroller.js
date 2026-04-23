const Order = require('../models/Ordermodel');
const Product = require('../models/Productmodel');
const Cart = require('../models/Cartmodel');

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private
exports.addOrderItems = async (req, res, next) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        } = req.body;

        // Validate order items
        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ status: 'fail', message: 'No order items provided' });
        }

        // ✅ Validate all required shipping address fields (including country)
        const { address, city, postalCode, country } = shippingAddress || {};
        if (!address || !city || !postalCode || !country) {
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide complete shipping address: address, city, postalCode, and country are all required'
            });
        }

        // Validate payment method
        if (!paymentMethod) {
            return res.status(400).json({ status: 'fail', message: 'Payment method is required' });
        }

        // 1. Create order in database
        const order = new Order({
            orderItems: orderItems.map((x) => ({
                ...x,
                product: x.product,
                _id: undefined
            })),
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        });

        const createdOrder = await order.save();

        // 2. Update product stock (prevent going below 0)
        for (const item of orderItems) {
            const product = await Product.findById(item.product);
            if (product) {
                product.stock = Math.max(0, product.stock - item.qty);
                await product.save();
            }
        }

        // 3. Clear user's cart after successful order
        await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

        res.status(201).json({
            status: 'success',
            data: createdOrder
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get order by ID
// @route   GET /api/v1/orders/:id
// @access  Private
exports.getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (!order) {
            return res.status(404).json({ status: 'fail', message: 'Order not found' });
        }

        // Check if the order belongs to the user or if the user is an admin
        if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ status: 'fail', message: 'Not authorized to view this order' });
        }

        res.status(200).json({
            status: 'success',
            data: order
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get logged in user orders
// @route   GET /api/v1/orders/mine
// @access  Private
exports.getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

        res.status(200).json({
            status: 'success',
            orders: orders
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update order to paid (for future use with payment gateways)
// @route   PUT /api/v1/orders/:id/pay
// @access  Private
exports.updateOrderToPaid = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ status: 'fail', message: 'Order not found' });
        }

        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address,
        };

        const updatedOrder = await order.save();

        res.status(200).json({
            status: 'success',
            data: updatedOrder
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all orders
// @route   GET /api/v1/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name email');
        
        res.status(200).json({
            status: 'success',
            orders: orders
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update order status
// @route   PUT /api/v1/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ status: 'fail', message: 'Order not found' });
        }

        order.status = req.body.status || order.status;
        
        if (req.body.status === 'Delivered' && !order.isDelivered) {
             order.isDelivered = true;
             order.deliveredAt = Date.now();
        }

        const updatedOrder = await order.save();

        res.status(200).json({
            status: 'success',
            data: updatedOrder
        });
    } catch (err) {
        next(err);
    }
};
