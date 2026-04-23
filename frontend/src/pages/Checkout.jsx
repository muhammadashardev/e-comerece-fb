import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Truck, ShieldCheck, MapPin, Globe, CheckCircle2, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const InputField = ({ label, name, value, onChange, placeholder, required = true, type = 'text' }) => (
    <div className="relative group">
        <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-2.5 group-focus-within:text-indigo-500 transition-colors duration-300">
            {label}
        </label>
        <input
            type={type}
            required={required}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full h-14 px-5 bg-slate-50 border-2 border-transparent rounded-2xl focus:ring-0 focus:border-indigo-500 focus:bg-white transition-all duration-300 outline-none font-semibold text-slate-800 text-sm placeholder:text-slate-300 placeholder:font-normal"
        />
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 rounded-full" />
    </div>
);

const Checkout = () => {
    const { cartItems, getCartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [shippingAddress, setShippingAddress] = useState({
        address: '',
        city: '',
        postalCode: '',
        country: ''
    });

    const [paymentMethod, setPaymentMethod] = useState('CashOnDelivery');
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);

    const subtotal = getCartTotal();
    const shippingPrice = subtotal > 150 ? 0 : 15.00;
    const taxPrice = Number((0.15 * subtotal).toFixed(2));
    const totalPrice = subtotal + shippingPrice + taxPrice;

    if (cartItems.length === 0 && !orderSuccess) {
        navigate('/cart');
        return null;
    }

    const handleChange = (e) => {
        setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
    };

    const placeOrder = async (e) => {
        e.preventDefault();

        // Validate all fields
        if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
            toast.error('Please fill in all shipping address fields including Country');
            return;
        }

        const orderData = {
            orderItems: cartItems.map(item => ({
                product: item.product._id,
                title: item.product.title,
                image: item.product.image,
                price: item.product.price,
                qty: item.quantity
            })),
            shippingAddress,
            paymentMethod,
            itemsPrice: subtotal,
            shippingPrice,
            taxPrice,
            totalPrice
        };

        setIsProcessing(true);
        const loadingToast = toast.loading('Processing your order...');

        try {
            await api.post('/orders', orderData);
            toast.dismiss(loadingToast);
            setOrderSuccess(true);
            clearCart();
            setTimeout(() => navigate('/profile'), 3000);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to place order', { id: loadingToast });
            setIsProcessing(false);
        }
    };

    if (orderSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center space-y-8 max-w-lg"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                        className="w-28 h-28 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/30"
                    >
                        <CheckCircle2 size={56} className="text-white" />
                    </motion.div>
                    <div>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic mb-3">Order Placed!</h1>
                        <p className="text-slate-500 text-sm font-medium">Your order has been confirmed. Redirecting to your profile...</p>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <motion.div
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 3 }}
                            className="h-full bg-indigo-500 rounded-full"
                        />
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/20 pt-28 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="mb-14"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center">
                            <Package size={16} className="text-white" />
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-600">Secure Checkout</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.85] uppercase italic">
                        Complete <br /><span className="text-indigo-600">Your Order.</span>
                    </h1>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-10 xl:gap-16">

                    {/* LEFT: Form */}
                    <div className="flex-1">
                        <form onSubmit={placeOrder} className="space-y-10">

                            {/* Module 01: Shipping */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100"
                            >
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Step 01</p>
                                        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Shipping Address</h2>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="md:col-span-2">
                                        <InputField
                                            label="Street Address"
                                            name="address"
                                            value={shippingAddress.address}
                                            onChange={handleChange}
                                            placeholder="House no., Street, Area"
                                        />
                                    </div>
                                    <InputField
                                        label="City"
                                        name="city"
                                        value={shippingAddress.city}
                                        onChange={handleChange}
                                        placeholder="e.g. Karachi"
                                    />
                                    <InputField
                                        label="Postal Code"
                                        name="postalCode"
                                        value={shippingAddress.postalCode}
                                        onChange={handleChange}
                                        placeholder="e.g. 75600"
                                    />
                                    {/* ✅ BUG FIX: Country field was missing — now added */}
                                    <div className="md:col-span-2">
                                        <div className="relative group">
                                            <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-2.5 group-focus-within:text-indigo-500 transition-colors duration-300">
                                                Country <span className="text-rose-400">*</span>
                                            </label>
                                            <div className="relative">
                                                <Globe size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors pointer-events-none" />
                                                <input
                                                    type="text"
                                                    required
                                                    name="country"
                                                    value={shippingAddress.country}
                                                    onChange={handleChange}
                                                    placeholder="e.g. Pakistan"
                                                    className="w-full h-14 pl-10 pr-5 bg-slate-50 border-2 border-transparent rounded-2xl focus:ring-0 focus:border-indigo-500 focus:bg-white transition-all duration-300 outline-none font-semibold text-slate-800 text-sm placeholder:text-slate-300 placeholder:font-normal"
                                                />
                                            </div>
                                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 rounded-full" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Module 02: Payment */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100"
                            >
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                                        <CreditCard size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Step 02</p>
                                        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Payment Method</h2>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        { id: 'PayPal', label: 'PayPal / Online', sub: 'Secure digital payment', icon: '💳' },
                                        { id: 'CashOnDelivery', label: 'Cash on Delivery', sub: 'Pay when you receive', icon: '📦' }
                                    ].map((method) => (
                                        <label
                                            key={method.id}
                                            className={`relative flex items-center gap-5 p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                                                paymentMethod === method.id
                                                    ? 'border-indigo-500 bg-indigo-50/50 shadow-md shadow-indigo-100'
                                                    : 'border-slate-100 bg-slate-50 hover:border-slate-300 hover:bg-white'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                value={method.id}
                                                checked={paymentMethod === method.id}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="sr-only"
                                            />
                                            <span className="text-3xl">{method.icon}</span>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-black text-slate-900 mb-0.5">{method.label}</h4>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{method.sub}</p>
                                            </div>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${paymentMethod === method.id ? 'border-indigo-600' : 'border-slate-300'}`}>
                                                {paymentMethod === method.id && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Submit Button */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                <button
                                    type="submit"
                                    disabled={isProcessing}
                                    className={`w-full h-16 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-[0.3em] transition-all duration-300 shadow-xl shadow-slate-900/20 flex items-center justify-center gap-4 group ${isProcessing ? 'opacity-70 cursor-not-allowed' : 'active:scale-[0.98] hover:shadow-2xl hover:shadow-indigo-500/25'}`}
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Processing Order...
                                        </>
                                    ) : (
                                        <>
                                            <ShieldCheck size={20} />
                                            Place Order — ${totalPrice.toFixed(2)}
                                        </>
                                    )}
                                </button>
                                <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">
                                    🔒 Secure & Encrypted Checkout
                                </p>
                            </motion.div>
                        </form>
                    </div>

                    {/* RIGHT: Order Summary */}
                    <motion.aside
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.15 }}
                        className="w-full lg:w-[420px] xl:w-[460px]"
                    >
                        <div className="sticky top-28">
                            <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-2xl shadow-slate-900/20">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
                                    <h3 className="text-xl font-black uppercase italic tracking-tight text-white">Order Summary</h3>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-400/10 px-3 py-1.5 rounded-full">
                                        {cartItems.length} items
                                    </span>
                                </div>

                                {/* Items */}
                                <div className="space-y-5 mb-8 max-h-64 overflow-y-auto pr-2 custom-scrollbar-white">
                                    <AnimatePresence>
                                        {cartItems.map((item) => (
                                            <motion.div
                                                key={item.product._id}
                                                layout
                                                className="flex gap-4 group"
                                            >
                                                <div className="w-20 h-20 bg-white/5 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10 group-hover:border-indigo-500/30 transition-colors">
                                                    <img src={item.product.image} alt={item.product.title} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0 py-1">
                                                    <h4 className="text-[11px] font-black uppercase tracking-wide text-slate-200 truncate mb-1.5">{item.product.title}</h4>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[10px] font-bold text-slate-500">Qty: {item.quantity}</span>
                                                        <span className="text-sm font-black text-indigo-400">${(item.product.price * item.quantity).toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>

                                {/* Pricing */}
                                <div className="space-y-3.5 pt-6 border-t border-white/10">
                                    <div className="flex justify-between text-[11px] font-bold text-slate-400">
                                        <span>Subtotal</span>
                                        <span className="text-slate-200">${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-[11px] font-bold text-slate-400">
                                        <span>Shipping</span>
                                        <span className={shippingPrice === 0 ? 'text-emerald-400 font-black' : 'text-slate-200'}>
                                            {shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-[11px] font-bold text-slate-400">
                                        <span>Tax (15%)</span>
                                        <span className="text-slate-200">${taxPrice.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Total */}
                                <div className="mt-6 pt-6 border-t border-indigo-500/20">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">Total Amount</p>
                                            <p className="text-4xl font-black text-white tracking-tighter">${totalPrice.toFixed(2)}</p>
                                        </div>
                                        <div className="w-14 h-14 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center">
                                            <Truck size={24} className="text-indigo-400" />
                                        </div>
                                    </div>
                                </div>

                                {/* Trust Badges */}
                                <div className="mt-8 grid grid-cols-3 gap-3">
                                    {['Free Returns', '100% Secure', 'Fast Delivery'].map((badge) => (
                                        <div key={badge} className="text-center p-3 bg-white/5 rounded-xl border border-white/5">
                                            <p className="text-[9px] font-black uppercase tracking-wider text-slate-500">{badge}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.aside>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
