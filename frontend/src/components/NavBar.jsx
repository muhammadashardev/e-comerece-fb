
import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, LogOut, Menu, X, Search, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import {AnimatePresence, motion} from 'framer-motion';

const NavBar = () => {
    const { user, logout } = useAuth();
    const { getCartCount } = useCart();
    const { wishlistItems } = useWishlist();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/shop?q=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
            setSearchQuery('');
        }
    };

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="fixed top-8 left-0 right-0 z-50 px-6 sm:px-12 pointer-events-none">
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className={`max-w-7xl mx-auto rounded-[2.5rem] transition-all duration-700 pointer-events-auto border border-white/10 ${
                    isScrolled 
                    ? 'glass-elite bg-white/80 backdrop-blur-xl shadow-elite py-4 px-10' 
                    : 'bg-white/40 backdrop-blur-md py-6 px-12'
                }`}
            >
                <div className="flex justify-between items-center">
                    {/* Supreme Logo */}
                    <Link to="/" className="flex items-center gap-4 group">
                        <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-2xl group-hover:bg-indigo-600 transition-all duration-500 shadow-2xl rotate-3 group-hover:rotate-0">
                            E
                        </div>
                        <span className="font-[900] text-3xl tracking-[-0.05em] text-slate-900 hidden sm:block italic uppercase">
                            ESSENCE<span className="text-indigo-600">.</span>
                        </span>
                    </Link>

                    {/* Desktop Protocol Menu */}
                    <div className="hidden lg:flex items-center space-x-12">
                        {['Home', 'Shop', 'About', 'Services'].map((item) => (
                            <NavLink 
                                key={item}
                                to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} 
                                className={({isActive}) => `text-[10px] font-black tracking-[0.3em] uppercase transition-all hover:text-indigo-600 relative group flex flex-col items-center gap-1 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`}
                            >
                                {({isActive}) => (
                                    <>
                                        {item}
                                        <motion.span 
                                            className={`w-1.5 h-1.5 bg-indigo-600 rounded-full ${isActive ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100 transition-opacity`}
                                            layoutId="nav-dot"
                                        />
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </div>

                    {/* Telemetry Icons */}
                    <div className="flex items-center space-x-8">
                        <div className="hidden lg:flex items-center gap-6 border-r border-slate-100 pr-8">
                            <div className="flex items-center gap-3 relative group">
                                <motion.div 
                                    initial={false}
                                    animate={{ width: isSearchOpen ? 250 : 0, opacity: isSearchOpen ? 1 : 0 }}
                                    className="overflow-hidden"
                                >
                                    <input 
                                        type="text" 
                                        placeholder="SEARCH ARCHIVE..." 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                        className="h-12 w-full px-6 bg-slate-50 border-none rounded-2xl text-[10px] font-black tracking-widest outline-none focus:ring-2 focus:ring-indigo-600 transition-all uppercase placeholder:text-slate-300"
                                    />
                                </motion.div>
                                <button 
                                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                                    className="p-2 transition-all text-slate-400 hover:text-slate-900 hover:scale-110"
                                >
                                    {isSearchOpen ? <X size={20} /> : <Search size={22} />}
                                </button>
                            </div>

                            <Link to="/wishlist" className="relative p-2 text-slate-400 hover:text-rose-500 transition-all hover:scale-110">
                                <Heart size={22} />
                                <AnimatePresence>
                                    {wishlistItems.length > 0 && (
                                        <motion.span 
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                            className="absolute top-0 right-0 w-4 h-4 bg-rose-600 text-white text-[9px] font-black flex items-center justify-center rounded-full shadow-lg"
                                        >
                                            {wishlistItems.length}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </Link>
                        </div>

                        <Link to="/cart" className="relative p-2 text-slate-400 hover:text-indigo-600 transition-all hover:scale-110">
                            <ShoppingBag size={22} />
                            <AnimatePresence>
                                {getCartCount() > 0 && (
                                    <motion.span 
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className="absolute top-0 right-0 w-4 h-4 bg-slate-900 text-white text-[9px] font-black flex items-center justify-center rounded-full shadow-lg"
                                    >
                                        {getCartCount()}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>

                        {user ? (
                            <div className="flex items-center gap-5">
                                <Link to="/profile" className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center hover:border-indigo-600 hover:shadow-lg transition-all overflow-hidden group">
                                    <User size={20} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                                </Link>
                                <button onClick={handleLogout} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                                    <LogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login" className="hidden sm:block text-[10px] font-black tracking-widest text-slate-500 hover:text-slate-900 transition-colors">
                                    SIGN IN
                                </Link>
                                <Link to="/signup" className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl text-[10px] font-black tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-2xl shadow-indigo-600/20 uppercase italic">
                                    Join Core
                                </Link>
                            </div>
                        )}
                        
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 text-slate-900">
                            {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
                        </button>
                    </div>
                </div>
            

                {/* Mobile Menu Dropdown */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="lg:hidden mt-8 border-t border-slate-100/50 pt-8 pb-4"
                        >
                            <div className="flex flex-col space-y-8">
                                {['Home', 'Shop', 'About', 'Services'].map((item) => (
                                    <Link 
                                        key={item}
                                        to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} 
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-3xl font-black italic tracking-tighter text-slate-900 uppercase hover:text-indigo-600 transition-colors"
                                    >
                                        {item}
                                    </Link>
                                ))}
                                <div className="h-px bg-slate-100" />
                                {user ? (
                                    <div className="grid grid-cols-2 gap-4">
                                        <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="h-16 flex items-center justify-center bg-slate-50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-900">Profile</Link>
                                        <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="h-16 flex items-center justify-center border-2 border-red-50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500">Logout</button>
                                    </div>
                                ) : (
                                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="h-20 bg-slate-900 flex items-center justify-center text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-[10px] italic">Access Portal</Link>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>
        </div>
    );
};

export default NavBar;
