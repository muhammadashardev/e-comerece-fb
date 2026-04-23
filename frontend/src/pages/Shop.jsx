import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Star, Search, Heart, SlidersHorizontal, X, ChevronDown, Sparkles, Box, Zap, Tag } from 'lucide-react';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const [searchParams, setSearchParams] = useSearchParams();

    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState('default');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const query = searchParams.get('q');
        if (query) setSearchTerm(query);
    }, [searchParams]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get('/products/getproduct');
                setProducts(res.data.data || []);
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];

    const filteredProducts = products
        .filter(product => {
            const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            if (sortBy === 'price-asc') return a.price - b.price;
            if (sortBy === 'price-desc') return b.price - a.price;
            if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
            return 0;
        });

    const handleAddToCart = (e, productId) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(productId, 1);
    };

    const handleWishlistToggle = (e, productId) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(productId);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('All');
        setSortBy('default');
    };

    const hasActiveFilters = searchTerm || selectedCategory !== 'All' || sortBy !== 'default';

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/20">

            {/* Hero Banner */}
            <div className="bg-slate-900 text-white pt-28 pb-14 px-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5 pointer-events-none">
                    <div className="absolute top-8 right-20 w-64 h-64 bg-indigo-500 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-10 w-96 h-40 bg-purple-500 rounded-full blur-3xl" />
                </div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <Sparkles size={14} className="text-indigo-400" />
                            <span className="text-[11px] font-black uppercase tracking-[0.35em] text-indigo-400">
                                {loading ? '...' : `${filteredProducts.length} Products Available`}
                            </span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] uppercase italic mb-4">
                            Shop <span className="text-indigo-400">All</span> <br className="hidden md:block" />Products.
                        </h1>
                        <p className="text-slate-400 text-sm font-medium max-w-md mt-3">
                            Discover our curated collection of premium products. Filter by category, sort by price or rating.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                {/* Search + Controls Bar */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col md:flex-row gap-4 mb-8"
                >
                    {/* Search Input */}
                    <div className="relative flex-1 group">
                        <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-12 pl-13 pr-5 bg-white border border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all font-medium text-slate-800 placeholder:text-slate-400 text-sm"
                        />
                        {searchTerm && (
                            <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    {/* Sort Select */}
                    <div className="relative">
                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="h-12 pl-5 pr-10 bg-white border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 font-bold text-sm text-slate-700 cursor-pointer appearance-none min-w-[180px]"
                        >
                            <option value="default">Sort: Default</option>
                            <option value="price-asc">Price: Low → High</option>
                            <option value="price-desc">Price: High → Low</option>
                            <option value="rating">Top Rated</option>
                        </select>
                    </div>

                    {/* Filter Toggle (mobile) */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`h-12 px-5 flex items-center gap-2.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all border lg:hidden ${showFilters ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 text-slate-700'}`}
                    >
                        <SlidersHorizontal size={16} />
                        Filters
                    </button>

                    {/* Clear Filters */}
                    {hasActiveFilters && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={clearFilters}
                            className="h-12 px-5 flex items-center gap-2 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 font-black text-xs uppercase tracking-wider hover:bg-rose-100 transition-all"
                        >
                            <X size={14} />
                            Clear
                        </motion.button>
                    )}
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* SIDEBAR */}
                    <AnimatePresence>
                        {(showFilters || true) && (
                            <motion.aside
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`w-full lg:w-64 xl:w-72 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}
                            >
                                <div className="sticky top-28 space-y-6">

                                    {/* Categories */}
                                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                                        <div className="flex items-center gap-2 mb-5">
                                            <Tag size={15} className="text-indigo-500" />
                                            <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-700">Categories</h3>
                                        </div>
                                        <div className="space-y-1.5">
                                            {categories.map(cat => (
                                                <button
                                                    key={cat}
                                                    onClick={() => setSelectedCategory(cat)}
                                                    className={`group w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                                                        selectedCategory === cat
                                                            ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                                    }`}
                                                >
                                                    <span>{cat}</span>
                                                    {selectedCategory === cat && (
                                                        <motion.div layoutId="cat-dot" className="w-2 h-2 bg-indigo-400 rounded-full" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Promo Card */}
                                    <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-6 text-white overflow-hidden relative">
                                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
                                        <div className="absolute -bottom-8 -left-4 w-32 h-32 bg-white/5 rounded-full" />
                                        <Zap size={28} className="text-yellow-300 mb-3 relative z-10" />
                                        <h4 className="font-black text-lg leading-tight uppercase italic mb-2 relative z-10">Free Shipping</h4>
                                        <p className="text-indigo-200 text-xs font-medium leading-relaxed relative z-10">On orders above $150. Shop more, save more!</p>
                                    </div>
                                </div>
                            </motion.aside>
                        )}
                    </AnimatePresence>

                    {/* PRODUCT GRID */}
                    <main className="flex-1 min-w-0">
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="animate-pulse bg-white rounded-3xl p-5 border border-slate-100">
                                        <div className="aspect-square bg-slate-100 rounded-2xl mb-5" />
                                        <div className="h-3 bg-slate-100 rounded-full w-1/3 mb-3" />
                                        <div className="h-5 bg-slate-100 rounded-full w-2/3 mb-5" />
                                        <div className="h-10 bg-slate-100 rounded-xl" />
                                    </div>
                                ))}
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="py-24 text-center bg-white rounded-3xl border border-slate-100"
                            >
                                <Box size={56} className="mx-auto text-slate-200 mb-5" strokeWidth={1} />
                                <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase italic">No Products Found</h3>
                                <p className="text-slate-400 text-sm mb-8">Try adjusting your search or filters</p>
                                <button
                                    onClick={clearFilters}
                                    className="h-12 px-10 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all"
                                >
                                    Clear Filters
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                layout
                                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                            >
                                <AnimatePresence mode="popLayout">
                                    {filteredProducts.map((product, i) => (
                                        <motion.div
                                            layout
                                            key={product._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ duration: 0.4, delay: i * 0.04 }}
                                            className="group"
                                        >
                                            <Link to={`/product/${product._id}`} className="block bg-white rounded-3xl overflow-hidden border border-slate-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-500">

                                                {/* Image */}
                                                <div className="relative aspect-square overflow-hidden bg-slate-50">
                                                    <img
                                                        src={product.image}
                                                        alt={product.title}
                                                        className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-700"
                                                    />

                                                    {/* Stock Badge */}
                                                    {product.stock === 0 && (
                                                        <div className="absolute inset-x-0 bottom-0 py-3 bg-rose-600/90 backdrop-blur-sm text-white text-center">
                                                            <span className="text-[10px] font-black uppercase tracking-widest">Out of Stock</span>
                                                        </div>
                                                    )}

                                                    {/* Action Buttons */}
                                                    <div className="absolute top-4 right-4 flex flex-col gap-2.5 translate-x-16 group-hover:translate-x-0 transition-transform duration-500">
                                                        <button
                                                            onClick={(e) => handleWishlistToggle(e, product._id)}
                                                            className="w-11 h-11 rounded-2xl bg-white shadow-lg flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all hover:scale-110 active:scale-95"
                                                        >
                                                            <Heart size={18} className={isInWishlist(product._id) ? 'fill-rose-500 text-rose-500' : ''} />
                                                        </button>
                                                        <button
                                                            onClick={(e) => handleAddToCart(e, product._id)}
                                                            disabled={product.stock === 0}
                                                            className="w-11 h-11 rounded-2xl bg-slate-900 text-white shadow-lg flex items-center justify-center hover:bg-indigo-600 transition-all hover:scale-110 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed"
                                                        >
                                                            <ShoppingCart size={17} />
                                                        </button>
                                                    </div>

                                                    {/* Category Badge */}
                                                    <div className="absolute top-4 left-4">
                                                        <span className="px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full text-[10px] font-black uppercase tracking-wider text-slate-600">
                                                            {product.category}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Info */}
                                                <div className="p-5">
                                                    <h3 className="font-black text-slate-900 text-base tracking-tight mb-1 truncate group-hover:text-indigo-600 transition-colors">
                                                        {product.title}
                                                    </h3>

                                                    <div className="flex items-center justify-between mt-4">
                                                        <span className="text-2xl font-black text-slate-900 tracking-tighter">${product.price}</span>
                                                        <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-full">
                                                            <Star size={12} className="text-amber-500" fill="currentColor" />
                                                            <span className="text-xs font-black text-amber-700">{product.rating || '4.5'}</span>
                                                        </div>
                                                    </div>

                                                    {/* Add to Cart Bar */}
                                                    <button
                                                        onClick={(e) => handleAddToCart(e, product._id)}
                                                        disabled={product.stock === 0}
                                                        className="mt-4 w-full h-11 bg-slate-50 border border-slate-100 hover:bg-slate-900 hover:text-white text-slate-700 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 group/btn disabled:opacity-40 disabled:cursor-not-allowed"
                                                    >
                                                        <ShoppingCart size={15} className="group-hover/btn:animate-bounce" />
                                                        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                                    </button>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        )}

                        {/* Results Count */}
                        {!loading && filteredProducts.length > 0 && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-12"
                            >
                                Showing {filteredProducts.length} of {products.length} products
                            </motion.p>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Shop;
