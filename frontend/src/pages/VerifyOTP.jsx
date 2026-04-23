import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

const VerifyOTP = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    
    const { verifyOTP } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    
    // We expect the email to be passed in navigation state
    const email = location.state?.email;

    useEffect(() => {
        if (!email) {
            toast.error('Missing verification email. Please signup or login again.');
            navigate('/signup');
        }
    }, [email, navigate]);

    useEffect(() => {
        let interval;
        if (timer > 0 && !canResend) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else {
            setCanResend(true);
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [timer, canResend]);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;
        
        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        // Focus next input automatically
        if (element.nextSibling && element.value !== '') {
            element.nextSibling.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && otp[index] === '' && e.target.previousSibling) {
            e.target.previousSibling.focus();
        }
    };

    const handleResend = async () => {
        if (!canResend) return;
        
        const loadingToast = toast.loading('Sending a new code...');
        try {
            const res = await api.post('/auth/resend-otp', { email });
            if (res.data.status === 'success') {
                if (res.data.developerOtp) {
                    toast.success(`New OTP is: ${res.data.developerOtp}`, { id: loadingToast, duration: 10000 });
                } else {
                    toast.success('New verification code sent!', { id: loadingToast });
                }
                setTimer(60);
                setCanResend(false);
                setOtp(['', '', '', '', '', '']);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to resend code', { id: loadingToast });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpString = otp.join('');
        
        if (otpString.length !== 6) {
            return toast.error('Please enter the fully 6-digit code');
        }

        setIsLoading(true);
        const loadingToast = toast.loading('Verifying code...');
        
        try {
            await verifyOTP({ email, otp: otpString });
            toast.success('Email verified successfully!', { id: loadingToast });
            navigate('/');
        } catch (err) {
            toast.error(err.message || 'Invalid or expired code', { id: loadingToast });
            // Clear inputs on error
            setOtp(['', '', '', '', '', '']);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-8 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-50 rounded-full blur-[150px] opacity-60" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-50 rounded-full blur-[120px] opacity-40" />

            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-xl relative z-10"
            >
                <div className="text-center mb-16">
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-2xl rotate-3"
                    >
                        <ShieldCheck className="text-white" size={32} />
                    </motion.div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600 mb-6 font-bold">Security Protocol</h4>
                    <h1 className="text-6xl font-black text-slate-900 tracking-tighter mb-8 uppercase italic leading-none">
                        Identity <br /> <span className="text-indigo-600">Validation.</span>
                    </h1>
                    <p className="text-slate-500 font-medium uppercase tracking-widest text-[10px] max-w-xs mx-auto leading-relaxed">
                        A unique 6-digit credential has been dispatched to <br />
                        <span className="text-slate-900 font-black">{email}</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-12">
                    {/* OTP Inputs Grid */}
                    <div className="flex justify-center gap-4 sm:gap-6">
                        {otp.map((data, index) => (
                            <motion.input
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="w-12 h-16 sm:w-16 sm:h-20 text-center text-3xl font-black bg-slate-50 text-slate-900 rounded-[1.25rem] border-2 border-slate-100 focus:border-indigo-500 focus:bg-white focus:ring-0 transition-all outline-none"
                                type="text"
                                maxLength="1"
                                value={data}
                                onChange={e => handleChange(e.target, index)}
                                onKeyDown={e => handleKeyDown(e, index)}
                            />
                        ))}
                    </div>

                    <div className="space-y-6">
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className={`w-full h-20 bg-slate-900 hover:bg-indigo-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] transition-all shadow-2xl flex items-center justify-center gap-4 group ${isLoading ? 'opacity-70 cursor-not-allowed' : 'active:scale-[0.98]'}`}
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Establish Link
                                    <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1 }}>→</motion.div>
                                </>
                            )}
                        </button>

                        <div className="text-center">
                            {canResend ? (
                                <button 
                                    onClick={handleResend}
                                    className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-slate-900 transition-colors"
                                >
                                    Re-Dispatch Credential
                                </button>
                            ) : (
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    Next Protocol Dispatch available in <span className="text-slate-900">{timer}s</span>
                                </p>
                            )}
                        </div>
                    </div>
                </form>
                
                <div className="mt-20 flex justify-center gap-8">
                    <Link to="/login" className="text-[8px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-all">Back to Protocols</Link>
                    <div className="w-[1px] h-3 bg-slate-200" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-300">Essence Security v4.0</span>
                </div>
            </motion.div>
        </div>

    );
};

export default VerifyOTP;
