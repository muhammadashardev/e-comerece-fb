import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Star, ShoppingCart, ArrowLeft, Truck, ShieldCheck,
    Heart, Minus, Plus, Package, RotateCcw, Zap, CheckCircle
} from 'lucide-react';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/products/getproductbyid/${id}`);
                setProduct(res.data.data);
            } catch (error) {
                toast.error('Product not found');
                navigate('/shop');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id, navigate]);

    const handleAddToCart = () => {
        addToCart(product._id, quantity);
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2500);
    };

    const stockStatus = () => {
        if (!product) return null;
        if (product.stock === 0) return { label: 'Out of Stock', color: 'text-rose-500 bg-rose-50 border-rose-100', dot: 'bg-rose-500' };
        if (product.stock <= 5) return { label: `Only ${product.stock} left`, color: 'text-orange-600 bg-orange-50 border-orange-100', dot: 'bg-orange-500 animate-pulse' };
        return { label: 'In Stock', color: 'text-emerald-600 bg-emerald-50 border-emerald-100', dot: 'bg-emerald-500 animate-pulse' };
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-14 h-14 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
                    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Loading Product...</p>
                </div>
            </div>
        );
    }

    if (!product) return null;

    const status = stockStatus();
    const inWishlist = isInWishlist(product._id);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/10 pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Breadcrumb */}
                <motion.div
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-10"
                >
                    <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
                    <span className="text-slate-200">/</span>
                    <Link to="/shop" className="hover:text-indigo-600 transition-colors flex items-center gap-1.5 group">
                        <ArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform" />
                        Shop
                    </Link>
                    <span className="text-slate-200">/</span>
                    <span className="text-slate-600 truncate max-w-xs">{product.title}</span>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-start">

                    {/* LEFT: Product Image */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="lg:sticky lg:top-28"
                    >
                        <div className="relative bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-xl shadow-slate-100/80 group aspect-square">
                            {/* Background gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 via-transparent to-purple-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                            {/* Product image */}
                            <img
                                src={product.image}
                                alt={product.title}
                                className="w-full h-full object-contain p-12 group-hover:scale-105 transition-transform duration-700"
                            />

                            {/* Out of stock overlay */}
                            {product.stock === 0 && (
                                <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center">
                                    <span className="bg-rose-600 text-white px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest rotate-[-6deg] shadow-xl">
                                        Out of Stock
                                    </span>
                                </div>
                            )}

                            {/* Wishlist floating button */}
                            <button
                                onClick={() => toggleWishlist(product._id)}
                                className={`absolute top-5 right-5 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${
                                    inWishlist
                                        ? 'bg-rose-500 text-white scale-110'
                                        : 'bg-white text-slate-400 hover:text-rose-500 hover:scale-110'
                                }`}
                            >
                                <Heart size={20} className={inWishlist ? 'fill-white' : ''} />
                            </button>

                            {/* Category badge */}
                            <div className="absolute top-5 left-5">
                                <span className="px-3.5 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-black uppercase tracking-wider text-slate-600 shadow-sm border border-slate-100">
                                    {product.category}
                                </span>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-3 mt-5">
                            {[
                                { icon: Truck, label: 'Free Shipping', sub: 'Orders over $150' },
                                { icon: RotateCcw, label: 'Easy Returns', sub: '30-day policy' },
                                { icon: ShieldCheck, label: 'Secure Pay', sub: '100% protected' },
                            ].map(({ icon: Icon, label, sub }) => (
                                <div key={label} className="bg-white rounded-2xl p-4 border border-slate-100 text-center hover:border-indigo-200 hover:shadow-sm transition-all">
                                    <Icon size={18} className="text-indigo-500 mx-auto mb-2" />
                                    <p className="text-[10px] font-black text-slate-700 uppercase tracking-wide">{label}</p>
                                    <p className="text-[9px] text-slate-400 font-medium mt-0.5">{sub}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* RIGHT: Product Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                        className="flex flex-col gap-7"
                    >
                        {/* Category + Title */}
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="h-px w-6 bg-indigo-500" />
                                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-500">
                                    {product.category}
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl xl:text-6xl font-black text-slate-900 leading-[1] tracking-tighter uppercase italic mb-4">
                                {product.title}
                            </h1>

                            {/* Rating */}
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={15}
                                            className={i < Math.floor(product.rating || 4) ? 'text-amber-400' : 'text-slate-200'}
                                            fill={i < Math.floor(product.rating || 4) ? 'currentColor' : 'currentColor'}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm font-black text-slate-900">{product.rating || '4.5'}</span>
                                <span className="text-xs text-slate-400 font-medium">
                                    ({product.numReviews || 0} reviews)
                                </span>
                            </div>
                        </div>

                        {/* Price + Stock */}
                        <div className="flex items-center gap-6 py-6 border-y border-slate-100">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Price</p>
                                <p className="text-5xl font-black text-slate-900 tracking-tighter leading-none">
                                    ${product.price}
                                </p>
                            </div>
                            <div className="h-12 w-px bg-slate-100" />
                            {status && (
                                <div className={`flex items-center gap-2.5 px-4 py-2 rounded-xl border text-xs font-black uppercase tracking-wider ${status.color}`}>
                                    <div className={`w-2 h-2 rounded-full ${status.dot}`} />
                                    {status.label}
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <p className="text-slate-500 text-base leading-relaxed font-medium border-l-4 border-indigo-100 pl-5">
                                {product.description}
                            </p>
                        </div>

                        {/* Quantity + Actions */}
                        <div className="space-y-4">
                            <p className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400">Select Quantity</p>

                            <div className="flex flex-col sm:flex-row items-stretch gap-4">
                                {/* Quantity Selector */}
                                <div className="flex items-center bg-slate-50 rounded-2xl p-1.5 border border-slate-100 self-start">
                                    <button
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl transition-all"
                                    >
                                        <Minus size={17} />
                                    </button>
                                    <span className="w-12 text-center font-black text-xl text-slate-900">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(q => Math.min(product.stock || 99, q + 1))}
                                        disabled={product.stock === 0}
                                        className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl transition-all disabled:opacity-30"
                                    >
                                        <Plus size={17} />
                                    </button>
                                </div>

                                {/* Add to Cart */}
                                <button
                                    onClick={handleAddToCart}
                                    disabled={product.stock === 0 || addedToCart}
                                    className={`flex-1 h-14 rounded-2xl flex items-center justify-center gap-3 font-black text-sm uppercase tracking-[0.2em] transition-all duration-300 shadow-lg ${
                                        addedToCart
                                            ? 'bg-emerald-500 text-white shadow-emerald-200'
                                            : product.stock === 0
                                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                            : 'bg-slate-900 text-white hover:bg-indigo-600 shadow-slate-900/20 hover:shadow-indigo-500/30 active:scale-[0.98]'
                                    }`}
                                >
                                    <AnimatePresence mode="wait">
                                        {addedToCart ? (
                                            <motion.span
                                                key="added"
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -8 }}
                                                className="flex items-center gap-2"
                                            >
                                                <CheckCircle size={18} /> Added to Cart!
                                            </motion.span>
                                        ) : (
                                            <motion.span
                                                key="add"
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -8 }}
                                                className="flex items-center gap-2"
                                            >
                                                <ShoppingCart size={18} />
                                                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </button>

                                {/* Wishlist */}
                                <button
                                    onClick={() => toggleWishlist(product._id)}
                                    className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 flex-shrink-0 ${
                                        inWishlist
                                            ? 'border-rose-400 bg-rose-50 text-rose-500'
                                            : 'border-slate-200 bg-white text-slate-400 hover:border-rose-300 hover:text-rose-500'
                                    }`}
                                >
                                    <Heart size={20} className={inWishlist ? 'fill-rose-500' : ''} />
                                </button>
                            </div>

                            {/* Buy Now shortcut */}
                            {product.stock > 0 && (
                                <Link
                                    to="/cart"
                                    onClick={() => addToCart(product._id, quantity)}
                                    className="block w-full h-12 border-2 border-slate-200 rounded-2xl flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest text-slate-600 hover:border-indigo-500 hover:text-indigo-600 transition-all"
                                >
                                    <Zap size={15} />
                                    Buy Now — Go to Cart
                                </Link>
                            )}
                        </div>

                        {/* Product Meta */}
                        <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-3.5">
                            {[
                                { label: 'SKU', value: `SKU-${product._id.slice(-8).toUpperCase()}` },
                                { label: 'Category', value: product.category },
                                { label: 'Availability', value: product.stock > 0 ? `${product.stock} units` : 'Unavailable' },
                                { label: 'Payment', value: 'PayPal / Cash on Delivery' },
                            ].map(({ label, value }) => (
                                <div key={label} className="flex items-center justify-between text-sm py-1 border-b border-slate-50 last:border-0">
                                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">{label}</span>
                                    <span className="font-bold text-slate-700 text-xs">{value}</span>
                                </div>
                            ))}
                        </div>

                        {/* Delivery info */}
                        <div className="flex items-center gap-3 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
                            <Package size={20} className="text-indigo-500 flex-shrink-0" />
                            <div>
                                <p className="text-xs font-black text-indigo-700 uppercase tracking-wide">Estimated Delivery</p>
                                <p className="text-[11px] text-indigo-500 font-medium mt-0.5">3–5 business days · Free for orders above $150</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
