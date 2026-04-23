const Wishlist = require('../models/Wishlistmodel');
const Product = require('../models/Productmodel');

// Toggle item in wishlist (Add if not there, remove if there)
exports.togglewishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user._id;

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ status: 'fail', message: 'Product not found' });
        }

        let wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            // Create new wishlist if doesn't exist
            wishlist = await Wishlist.create({
                user: userId,
                products: [productId]
            });
            await wishlist.populate('products');
            return res.status(200).json({ status: 'success', message: 'Product added to wishlist', wishlist: wishlist });
        }

        // Check if product in wishlist
        const productIndex = wishlist.products.indexOf(productId);

        if (productIndex > -1) {
            // Remove product
            wishlist.products.splice(productIndex, 1);
            await wishlist.save();
            await wishlist.populate('products');
            return res.status(200).json({ status: 'success', message: 'Product removed from wishlist', wishlist: wishlist });
        } else {
            // Add product
            wishlist.products.push(productId);
            await wishlist.save();
            await wishlist.populate('products');
            return res.status(200).json({ status: 'success', message: 'Product added to wishlist', wishlist: wishlist });
        }
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// Get user wishlist
exports.getwishlist = async (req, res) => {
    try {
        const userId = req.user._id;
        const wishlist = await Wishlist.findOne({ user: userId }).populate('products');

        if (!wishlist) {
            return res.status(200).json({
                status: 'success',
                message: 'Wishlist is empty',
                data: { products: [] }
            });
        }

        res.status(200).json({
            status: 'success',
            wishlist: wishlist
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// Explicit remove from wishlist
exports.removefromwishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user._id;

        const wishlist = await Wishlist.findOne({ user: userId });
        if (!wishlist) {
            return res.status(404).json({ status: 'fail', message: 'Wishlist not found' });
        }

        wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
        await wishlist.save();
        await wishlist.populate('products');

        res.status(200).json({
            status: 'success',
            message: 'Product removed from wishlist',
            wishlist: wishlist
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
