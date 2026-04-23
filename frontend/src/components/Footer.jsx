import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, ShieldCheck, Globe, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-slate-400 pt-32 pb-20 overflow-hidden relative font-sans">
            {/* Background Texture */}
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-white rounded-full blur-[200px]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 mb-32">
                    {/* Primary Identity Module */}
                    <div className="lg:col-span-5 space-y-12">
                        <Link to="/" className="inline-flex items-center gap-5 group">
                            <div className="w-14 h-14 bg-white text-slate-900 rounded-2xl flex items-center justify-center font-[900] text-2xl group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500 shadow-2xl rotate-3 group-hover:rotate-0">
                                E
                            </div>
                            <h2 className="text-4xl font-[900] text-white tracking-[-0.05em] uppercase italic">
                                ESSENCE<span className="text-indigo-500">.</span>
                            </h2>
                        </Link>
                        <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-sm italic border-l-2 border-white/5 pl-8 uppercase text-[10px] tracking-[0.2em]">
                            Global Curator of High-Performance Lifestyle Assets. Engineered for Excellence. Distributed with Precision.
                        </p>
                        <div className="flex items-center gap-6">
                            {[Instagram, Twitter, Youtube, Facebook].map((Icon, i) => (
                                <a key={i} href="#" className="w-12 h-12 rounded-2xl border border-white/5 flex items-center justify-center hover:bg-white hover:text-slate-900 transition-all duration-300">
                                    <Icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Operational Links */}
                    <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-12">
                        {/* Registry Discovery */}
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white mb-10 italic">Registry</h4>
                            <ul className="space-y-5">
                                {['Latest Collection', 'About Protocol', 'Global Services', 'Identity Portal'].map((link, i) => (
                                    <li key={i}>
                                        <Link to="/shop" className="text-[11px] font-black uppercase tracking-widest hover:text-indigo-400 transition-colors block">
                                            {link}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Support Infrastructure */}
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white mb-10 italic">Support</h4>
                            <ul className="space-y-5">
                                {['Logistics Policy', 'Help Center', 'Track Asset', 'Privacy Protocol'].map((link, i) => (
                                    <li key={i}>
                                        <a href="#" className="text-[11px] font-black uppercase tracking-widest hover:text-indigo-400 transition-colors block">
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact Telemetry */}
                        <div className="space-y-10">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white italic">Telemetry</h4>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <MapPin size={18} className="text-indigo-500 flex-shrink-0" />
                                    <span className="text-[10px] font-black uppercase tracking-widest leading-relaxed">Global Hub 01, NY <br/>Protocol Suite 404</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Mail size={18} className="text-indigo-500 flex-shrink-0" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">OPS@ESSENCE.IO</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Registry Certification */}
                <div className="pt-16 border-t border-white/5 flex flex-col xl:flex-row justify-between items-center gap-12">
                    <div className="flex flex-col items-center xl:items-start gap-4">
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600">
                            &copy; {new Date().getFullYear()} ESSENCE GLOBAL PROTOCOL. ALL RIGHTS RESERVED.
                        </p>
                        <div className="flex items-center gap-6 text-[8px] font-black text-slate-800 uppercase tracking-widest italic">
                            <span className="flex items-center gap-2"><ShieldCheck size={12} /> SECURED SYSTEM v4.2.0</span>
                            <span className="flex items-center gap-2"><Globe size={12} /> GLOBAL NODE 014</span>
                            <span className="flex items-center gap-2"><Zap size={12} /> OPTIMAL LATENCY</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-10 grayscale contrast-200 brightness-150 opacity-20">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-6" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-10" />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
