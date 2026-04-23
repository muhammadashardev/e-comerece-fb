const Cart = require('../models/Cartmodel');
const Product = require('../models/Productmodel');

// Add item to cart
exports.addtocart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user._id;

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ status: 'fail', message: 'Product not found' });
        }

        // Find user's cart
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            // Create new cart if doesn't exist
            cart = await Cart.create({
                user: userId,
                items: [{ product: productId, quantity: quantity || 1 }]
            });
        } else {
            // Check if product already in cart
            const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

            if (itemIndex > -1) {
                // Increment quantity
                cart.items[itemIndex].quantity += (quantity || 1);
            } else {
                // Add new item
                cart.items.push({ product: productId, quantity: quantity || 1 });
            }
            await cart.save();
        }

        // Populate before returning
        await cart.populate('items.product');

        res.status(200).json({
            status: 'success',
            message: 'Product added to cart',
            cart: cart
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// Get user cart
exports.getcart = async (req, res) => {
    try {
        const userId = req.user._id;
        const cart = await Cart.findOne({ user: userId }).populate('items.product');

        if (!cart) {
            return res.status(200).json({
                status: 'success',
                message: 'Cart is empty',
                data: { items: [] }
            });
        }

        res.status(200).json({
            status: 'success',
            cart: cart
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// Update item quantity
exports.updatequantity = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user._id;

        if (quantity < 1) {
            return res.status(400).json({ status: 'fail', message: 'Quantity must be at least 1' });
        }

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ status: 'fail', message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex === -1) {
            return res.status(404).json({ status: 'fail', message: 'Product not found in cart' });
        }

        cart.items[itemIndex].quantity = quantity;
        await cart.save();

        await cart.populate('items.product');

        res.status(200).json({
            status: 'success',
            message: 'Quantity updated',
            cart: cart
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// Remove item from cart
exports.removefromcart = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user._id;

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ status: 'fail', message: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        await cart.save();

        await cart.populate('items.product');

        res.status(200).json({
            status: 'success',
            message: 'Item removed from cart',
            cart: cart
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
