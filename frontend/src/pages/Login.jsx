import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        
        try {
            await login({ email, password });
            navigate('/');
        } catch (err) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-stretch bg-white">
            {/* Context Side (Desktop) */}
            <div className="hidden lg:flex w-1/2 bg-slate-900 relative items-center justify-center overflow-hidden p-20">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000" 
                        alt="Background" 
                        className="w-full h-full object-cover opacity-30 grayscale hover:grayscale-0 transition-all duration-1000 scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                </div>
                
                <div className="relative z-10 max-w-lg text-center">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <h2 className="text-8xl font-black text-white tracking-tighter mb-8 italic uppercase leading-none">
                            The <span className="text-indigo-400">Vault.</span>
                        </h2>
                        <p className="text-xl text-slate-400 font-medium leading-relaxed uppercase tracking-widest">
                            Access your curated essence repository and manage your global acquisitions.
                        </p>
                    </motion.div>
                </div>

                {/* Bottom Accents */}
                <div className="absolute bottom-12 left-12 flex items-center gap-4 text-white/20">
                    <div className="w-12 h-12 rounded-2xl border border-white/20 flex items-center justify-center font-black">E</div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Essence Security Protocol</span>
                </div>
            </div>

            {/* Form Side */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-20 relative overflow-hidden">
                {/* Decorative Blur */}
                <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-50 rounded-full blur-[120px] opacity-60" />

                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full max-w-md relative z-10"
                >
                    <div className="mb-16">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: 40 }}
                            className="h-1 bg-indigo-600 mb-6"
                        />
                        <h1 className="text-6xl font-black text-slate-900 tracking-tighter mb-4 uppercase">
                            Establish <br /> <span className="text-indigo-600">Access.</span>
                        </h1>
                        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Identify yourself to continue</p>
                    </div>

                    {error && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5 mb-8 bg-red-50 text-red-600 rounded-3xl text-[10px] font-black uppercase tracking-widest border border-red-100 flex items-center gap-3">
                            <span className="w-2 h-2 bg-red-600 rounded-full" />
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-4">
                            <div className="relative group">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block transition-colors group-focus-within:text-indigo-600">Secure Email</label>
                                <input 
                                    type="email" 
                                    required
                                    className="w-full h-16 px-6 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none font-bold text-slate-900 placeholder:text-slate-200"
                                    placeholder="your-identifier@essence.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="relative group">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block transition-colors group-focus-within:text-indigo-600">Access Keyword</label>
                                <input 
                                    type="password" 
                                    required
                                    autoComplete="current-password"
                                    className="w-full h-16 px-6 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none font-bold text-slate-900 placeholder:text-slate-200"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative w-5 h-5 border-2 border-slate-200 rounded-lg group-hover:border-indigo-600 transition-colors">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity">
                                        <div className="w-2 h-2 bg-indigo-600 rounded-sm" />
                                    </div>
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Stay Identified</span>
                            </label>
                            <a href="#" className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-slate-900 transition-colors">Restore Access</a>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className={`w-full h-20 bg-slate-900 hover:bg-indigo-600 text-white rounded-3xl font-black text-xs uppercase tracking-[0.3em] transition-all shadow-2xl flex items-center justify-center gap-4 group ${isLoading ? 'opacity-70 cursor-not-allowed' : 'active:scale-[0.98]'}`}
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Verify Identity
                                    <motion.div 
                                        animate={{ x: [0, 5, 0] }} 
                                        transition={{ repeat: Infinity, duration: 1 }}
                                    >→</motion.div>
                                </>
                            )}
                        </button>
                        
                        <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-12">
                            New to the Collective? <Link to="/signup" className="text-indigo-600 hover:text-slate-900 transition-colors">Apply for Membership</Link>
                        </p>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
