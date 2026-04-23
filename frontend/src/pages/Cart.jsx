import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus, ShieldCheck, Truck, Tag } from 'lucide-react';

const Cart = () => {
    const { cartItems, updateQuantity, removeFromCart, getCartTotal, loading } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleCheckout = () => {
        if (!user) {
            navigate('/login');
        } else {
            navigate('/checkout');
        }
    };

    const subtotal = getCartTotal();
    const shipping = subtotal > 150 ? 0 : 15.00;
    const total = subtotal + shipping;

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/20 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
                    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Loading Cart...</p>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/20 flex flex-col items-center justify-center gap-8 px-4">
                <motion.div
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 150 }}
                    className="w-32 h-32 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 border border-slate-100"
                >
                    <ShoppingBag size={52} strokeWidth={1.5} />
                </motion.div>
                <div className="text-center">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic mb-2">
                        Your Cart is Empty
                    </h2>
                    <p className="text-slate-400 text-sm font-medium">Add some products to get started</p>
                </div>
                <Link
                    to="/shop"
                    className="h-12 px-10 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl flex items-center gap-2"
                >
                    <ShoppingBag size={15} />
                    Browse Products
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/20 pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-10 pb-8 border-b border-slate-100"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <ShoppingBag size={16} className="text-indigo-500" />
                        <span className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-500">
                            {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'} in Cart
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                        Shopping <span className="text-indigo-600">Cart.</span>
                    </h1>
                </motion.div>

                <div className="flex flex-col xl:flex-row gap-8">

                    {/* Cart Items */}
                    <div className="flex-1 space-y-4">
                        <AnimatePresence mode="popLayout">
                            {cartItems.map((item, i) => (
                                <motion.div
                                    layout
                                    key={item.product._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20, scale: 0.95 }}
                                    transition={{ delay: i * 0.07 }}
                                    className="group bg-white rounded-3xl p-5 border border-slate-100 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50 transition-all duration-400"
                                >
                                    <div className="flex gap-5 items-center">

                                        {/* Product Image */}
                                        <Link to={`/product/${item.product._id}`} className="w-24 h-24 bg-slate-50 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-100 hover:opacity-80 transition-opacity">
                                            <img
                                                src={item.product.image}
                                                alt={item.product.title}
                                                className="w-full h-full object-contain p-3"
                                            />
                                        </Link>

                                        {/* Product Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                <div className="min-w-0">
                                                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5">{item.product.category}</p>
                                                    <Link to={`/product/${item.product._id}`}>
                                                        <h3 className="font-black text-slate-900 text-base tracking-tight truncate hover:text-indigo-600 transition-colors">
                                                            {item.product.title}
                                                        </h3>
                                                    </Link>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.product._id)}
                                                    className="w-9 h-9 flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all flex-shrink-0"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between mt-3">
                                                {/* Quantity Controls */}
                                                <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-100">
                                                    <button
                                                        onClick={() => updateQuantity(item.product._id, Math.max(1, item.quantity - 1))}
                                                        className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-white rounded-lg transition-all"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="w-10 text-center font-black text-sm text-slate-900">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.product._id, Math.min(item.product.stock, item.quantity + 1))}
                                                        className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-white rounded-lg transition-all"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>

                                                {/* Price */}
                                                <div className="text-right">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                        ${item.product.price} × {item.quantity}
                                                    </p>
                                                    <p className="text-xl font-black text-slate-900 tracking-tight">
                                                        ${(item.product.price * item.quantity).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Continue Shopping */}
                        <Link
                            to="/shop"
                            className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-slate-400 hover:text-indigo-600 transition-colors mt-4 px-1"
                        >
                            ← Continue Shopping
                        </Link>
                    </div>

                    {/* Order Summary Sidebar */}
                    <motion.aside
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="w-full xl:w-[380px] flex-shrink-0"
                    >
                        <div className="sticky top-28">
                            <div className="bg-slate-900 text-white rounded-3xl p-7 shadow-2xl shadow-slate-900/20">

                                <h3 className="text-xl font-black uppercase italic tracking-tight mb-6 pb-5 border-b border-white/10">
                                    Order Summary
                                </h3>

                                {/* Pricing Breakdown */}
                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold text-slate-400">Subtotal</span>
                                        <span className="font-black text-white">${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold text-slate-400">Shipping</span>
                                        <span className={`font-black ${shipping === 0 ? 'text-emerald-400' : 'text-white'}`}>
                                            {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                                        </span>
                                    </div>

                                    {/* Free shipping progress */}
                                    {shipping > 0 && (
                                        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                                            <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-2">
                                                <span>Progress to free shipping</span>
                                                <span className="text-indigo-400">${(150 - subtotal).toFixed(2)} left</span>
                                            </div>
                                            <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${Math.min(100, (subtotal / 150) * 100)}%` }}
                                                    transition={{ duration: 0.8 }}
                                                    className="h-full bg-indigo-500 rounded-full"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Total */}
                                <div className="pt-5 border-t border-white/10 mb-7">
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Total</p>
                                            <p className="text-4xl font-black text-white tracking-tighter">${total.toFixed(2)}</p>
                                        </div>
                                        <Tag size={20} className="text-indigo-400 mb-1" />
                                    </div>
                                </div>

                                {/* Checkout Button */}
                                <button
                                    onClick={handleCheckout}
                                    className="group w-full h-14 bg-indigo-500 hover:bg-white text-white hover:text-slate-900 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all duration-300 shadow-xl flex items-center justify-center gap-3 active:scale-[0.98]"
                                >
                                    Proceed to Checkout
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>

                                {/* Trust Signals */}
                                <div className="flex items-center justify-center gap-2 mt-5 text-slate-500">
                                    <ShieldCheck size={14} />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Secure Checkout · SSL Encrypted</span>
                                </div>
                                <div className="flex items-center justify-center gap-2 mt-2 text-slate-600">
                                    <Truck size={13} />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Free shipping on orders over $150</span>
                                </div>
                            </div>
                        </div>
                    </motion.aside>
                </div>
            </div>
        </div>
    );
};

export default Cart;
