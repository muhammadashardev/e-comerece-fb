import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../utils/api';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (password !== passwordConfirm) {
            return setError('Passwords do not match');
        }

        setIsLoading(true);
        try {
            const res = await api.post('/auth/signup', { name, email, password, passwordConfirm });
            
            if (res.data.status === 'success' || res.data.status === 'pending_verification') {
                if (res.data.developerOtp) {
                    // This is a local workaround if email fails to send.
                    toast.success(`OTP is: ${res.data.developerOtp}`, { duration: 10000 });
                } else {
                    toast.success('Signup successful! Check your email for OTP.');
                }
                
                // Route to OTP verification screen
                navigate('/verify-otp', { state: { email } });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed.');
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
                        src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000" 
                        alt="Background" 
                        className="w-full h-full object-cover opacity-20 grayscale hover:grayscale-0 transition-all duration-1000 scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-transparent to-transparent" />
                </div>
                
                <div className="relative z-10 max-w-lg">
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <h2 className="text-7xl font-black text-white tracking-tighter mb-12 uppercase italic leading-none">
                            The Elite <br /><span className="text-indigo-400">Collective.</span>
                        </h2>
                        <div className="space-y-8">
                            {[
                                'Priority Access to Limited Drops',
                                'Bespoke Curated Recommendations',
                                'Global Complimentary Shipping',
                                'End-to-End Asset Protection'
                            ].map((text, i) => (
                                <div key={i} className="flex items-center gap-4 text-slate-400 group">
                                    <div className="w-1 h-1 bg-indigo-500 rounded-full group-hover:scale-150 transition-transform" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] font-medium">{text}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                <div className="absolute bottom-12 left-12 flex items-center gap-4 text-white/20">
                    <div className="w-12 h-12 rounded-2xl border border-white/20 flex items-center justify-center font-black">M</div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Membership Protocol v4.0</span>
                </div>
            </div>

            {/* Form Side */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-20 relative overflow-hidden">
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-50 rounded-full blur-[120px] opacity-40" />

                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full max-w-md relative z-10"
                >
                    <div className="mb-12">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: 40 }}
                            className="h-1 bg-indigo-600 mb-6"
                        />
                        <h1 className="text-6xl font-black text-slate-900 tracking-tighter mb-4 uppercase">
                            Join The <br /> <span className="text-indigo-600">Circle.</span>
                        </h1>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Submit your credentials for approval</p>
                    </div>

                    {error && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5 mb-8 bg-red-50 text-red-600 rounded-3xl text-[10px] font-black uppercase tracking-widest border border-red-100 flex items-center gap-3">
                            <span className="w-2 h-2 bg-red-600 rounded-full" />
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            <div className="relative group">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block transition-colors group-focus-within:text-indigo-600 font-bold">Full Name</label>
                                <input 
                                    type="text" 
                                    required
                                    className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none font-bold text-slate-900 placeholder:text-slate-200 text-sm"
                                    placeholder="Enter full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="relative group">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block transition-colors group-focus-within:text-indigo-600 font-bold">Protocol Email</label>
                                <input 
                                    type="email" 
                                    required
                                    className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none font-bold text-slate-900 placeholder:text-slate-200 text-sm"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="relative group">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block transition-colors group-focus-within:text-indigo-600 font-bold">Keyword</label>
                                    <input 
                                        type="password" 
                                        required
                                        autoComplete="new-password"
                                        className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none font-bold text-slate-900 placeholder:text-slate-200 text-sm"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <div className="relative group">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block transition-colors group-focus-within:text-indigo-600 font-bold">Validate</label>
                                    <input 
                                        type="password" 
                                        required
                                        autoComplete="new-password"
                                        className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none font-bold text-slate-900 placeholder:text-slate-200 text-sm"
                                        placeholder="••••••••"
                                        value={passwordConfirm}
                                        onChange={(e) => setPasswordConfirm(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className={`w-full h-20 bg-slate-900 hover:bg-indigo-600 text-white rounded-3xl font-black text-xs uppercase tracking-[0.3em] transition-all shadow-2xl flex items-center justify-center gap-4 group ${isLoading ? 'opacity-70 cursor-not-allowed' : 'active:scale-[0.98]'}`}
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Submit Application
                                        <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1 }}>→</motion.div>
                                    </>
                                )}
                            </button>
                        </div>
                        
                        <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-12">
                            Already part of the Circle? <Link to="/login" className="text-indigo-600 hover:text-slate-900 transition-colors">SignIn Protocol</Link>
                        </p>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default Signup;
