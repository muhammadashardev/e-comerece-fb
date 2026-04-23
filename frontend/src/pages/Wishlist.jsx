import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trash2, ShoppingCart, Star, Lock, Sparkles } from 'lucide-react';

const Wishlist = () => {
    const { wishlistItems, removeFromWishlist, loading } = useWishlist();
    const { addToCart } = useCart();
    const { user } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50/20 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-slate-100 border-t-rose-500 rounded-full animate-spin" />
                    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Loading Wishlist...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50/20 flex flex-col items-center justify-center gap-8 px-4">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="w-24 h-24 bg-rose-50 border-2 border-rose-100 rounded-3xl flex items-center justify-center"
                >
                    <Lock size={36} className="text-rose-400" />
                </motion.div>
                <div className="text-center">
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic mb-2">Login Required</h2>
                    <p className="text-slate-400 text-sm font-medium">Please sign in to view your wishlist</p>
                </div>
                <Link to="/login" className="h-12 px-10 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl">
                    Sign In
                </Link>
            </div>
        );
    }

    if (wishlistItems.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50/10 flex flex-col items-center justify-center gap-8 px-4">
                <motion.div
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 150 }}
                    className="relative w-32 h-32 bg-rose-50 rounded-3xl flex items-center justify-center border border-rose-100"
                >
                    <Sparkles className="absolute -top-3 -right-3 text-rose-300" size={24} />
                    <Heart size={52} strokeWidth={1.5} className="text-rose-300" />
                </motion.div>
                <div className="text-center">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic mb-2">
                        Your Wishlist is Empty
                    </h2>
                    <p className="text-slate-400 text-sm font-medium">Save items you love by clicking the heart icon</p>
                </div>
                <Link to="/shop" className="h-12 px-10 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl">
                    Browse Products
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50/10 pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-10 pb-8 border-b border-slate-100"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <Heart size={18} className="text-rose-500 fill-rose-500" />
                        <span className="text-[11px] font-black uppercase tracking-[0.3em] text-rose-500">
                            {wishlistItems.length} Saved Items
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                        My <span className="text-rose-500">Wishlist.</span>
                    </h1>
                    <p className="text-slate-400 text-sm font-medium mt-2">
                        Products you've saved for later
                    </p>
                </motion.div>

                {/* Product Grid */}
                <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                    <AnimatePresence mode="popLayout">
                        {wishlistItems.map((product, i) => (
                            <motion.div
                                layout
                                key={product._id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
                                transition={{ duration: 0.4, delay: i * 0.05 }}
                                className="group bg-white rounded-3xl overflow-hidden border border-slate-100 hover:border-rose-200 hover:shadow-xl hover:shadow-rose-50 transition-all duration-400"
                            >
                                <Link to={`/product/${product._id}`} className="block">
                                    {/* Image */}
                                    <div className="relative aspect-square overflow-hidden bg-slate-50">
                                        <img
                                            src={product.image}
                                            alt={product.title}
                                            className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-700"
                                        />

                                        {product.stock === 0 && (
                                            <div className="absolute inset-x-0 bottom-0 py-2.5 bg-rose-600/90 backdrop-blur-sm text-white text-center">
                                                <span className="text-[10px] font-black uppercase tracking-widest">Out of Stock</span>
                                            </div>
                                        )}

                                        {/* Remove Button */}
                                        <button
                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeFromWishlist(product._id); }}
                                            className="absolute top-3 right-3 w-10 h-10 rounded-2xl bg-white shadow-lg flex items-center justify-center text-slate-300 hover:text-rose-500 hover:scale-110 transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>

                                        {/* Category */}
                                        <div className="absolute top-3 left-3">
                                            <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[9px] font-black uppercase tracking-wider text-slate-500">
                                                {product.category}
                                            </span>
                                        </div>
                                    </div>
                                </Link>

                                {/* Info */}
                                <div className="p-5">
                                    <h3 className="font-black text-slate-900 text-sm tracking-tight truncate mb-1 group-hover:text-rose-500 transition-colors">
                                        {product.title}
                                    </h3>

                                    {/* Rating */}
                                    <div className="flex items-center gap-1 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={11} className={i < Math.floor(product.rating || 4) ? 'text-amber-400' : 'text-slate-200'} fill="currentColor" />
                                        ))}
                                        <span className="text-[10px] font-bold text-slate-400 ml-1">{product.rating || '4.0'}</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-xl font-black text-slate-900 tracking-tighter">${product.price?.toFixed(2)}</span>

                                        <button
                                            onClick={() => addToCart(product._id, 1)}
                                            disabled={product.stock === 0}
                                            className="flex items-center gap-2 h-9 px-4 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-indigo-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                            <ShoppingCart size={13} />
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};

export default Wishlist;
