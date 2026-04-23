import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Truck, RefreshCcw, Zap, Heart, ShoppingCart, Globe } from 'lucide-react';
import api from '../utils/api';
import { motion, useScroll, useTransform } from 'framer-motion';

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        viewport={{ once: true }}
        className="group relative flex flex-col items-center text-center p-8 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-2xl transition-all duration-500 overflow-hidden"
    >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 rotate-3 group-hover:rotate-0">
            <Icon size={30} />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3 relative z-10">{title}</h3>
        <p className="text-slate-500 text-sm leading-relaxed relative z-10">{description}</p>
    </motion.div>
);

const Home = () => {
    const [featured, setFeatured] = useState([]);
    const [loading, setLoading] = useState(true);
    const { scrollYProgress } = useScroll();
    const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get('/products/getproduct');
                setFeatured(res.data.data.slice(0, 8));
            } catch (error) {
                console.error("Discovery failed", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
    };

    return (
        <div className="bg-white overflow-x-hidden">
            {/* Supreme Hero: Phase 01 */}
            <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-indigo-50/50 rounded-full blur-[150px] animate-pulse" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-50/30 rounded-full blur-[120px]" />
                </div>

                <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10 w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
                        <motion.div 
                            style={{ y: heroY, opacity: heroOpacity }}
                            className="lg:col-span-7 space-y-12"
                        >
                            <div className="space-y-6">
                                <motion.div 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="inline-flex items-center gap-4 px-6 py-2.5 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl shadow-slate-900/20"
                                >
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
                                    Deployment Phase 2026.04
                                </motion.div>
                                <h1 className="text-8xl md:text-[10rem] font-black text-slate-900 tracking-[-0.05em] leading-[0.8] uppercase italic">
                                    Define <br />
                                    <span className="text-indigo-600">The Core.</span>
                                </h1>
                            </div>

                            <p className="text-xl md:text-2xl text-slate-500 max-w-2xl font-medium leading-relaxed italic border-l-4 border-slate-50 pl-10">
                                Experience the intersection of luxury and high-performance craftsmanship. Curated essentials for the modern lifestyle protocol.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-8 pt-6">
                                <Link to="/shop" className="group h-20 px-14 rounded-[2rem] bg-slate-900 text-white font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-indigo-600 transition-all shadow-2xl active:scale-95">
                                    Explore Discovery
                                    <ArrowRight size={20} className="group-hover:translate-x-3 transition-transform" />
                                </Link>
                                <div className="flex items-center gap-6 px-10">
                                    <div className="h-10 w-px bg-slate-100" />
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">
                                        Join <span className="text-slate-900">12k+</span> <br /> Verified Participants
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, x: 50 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                            className="lg:col-span-5 relative hidden lg:block"
                        >
                            <div className="relative z-10 rounded-[5rem] overflow-hidden shadow-elite border-[20px] border-slate-50/50">
                                <img 
                                    src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200" 
                                    alt="Elite Showcase" 
                                    className="w-full h-[800px] object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-1000 scale-105 hover:scale-100"
                                />
                                <div className="absolute inset-x-0 bottom-0 p-12 bg-gradient-to-t from-slate-900/80 to-transparent backdrop-blur-sm">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-white font-black text-2xl tracking-tighter italic uppercase mb-1">Asset: Trench Protocol</p>
                                            <p className="text-indigo-400 font-bold tracking-widest text-[10px] uppercase italic">Registry Valuation: $249.00</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Supreme Bento: Curated Discovery */}
            <section className="py-40 bg-white">
                <div className="max-w-7xl mx-auto px-6 sm:px-12">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row justify-between items-end gap-10 mb-24 border-b border-slate-100 pb-16"
                    >
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600 mb-6 italic">Registry Exploration</h4>
                            <h2 className="text-7xl md:text-8xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                                Curated <br /> <span className="text-slate-400">Universes.</span>
                            </h2>
                        </div>
                        <Link to="/shop" className="group h-16 px-10 rounded-2xl bg-slate-50 text-slate-900 font-black text-[10px] uppercase tracking-widest flex items-center gap-4 hover:bg-slate-900 hover:text-white transition-all">
                            Access Full Archive
                            <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10 h-auto md:h-[900px]">
                        <motion.div 
                            whileHover={{ scale: 0.98 }}
                            className="md:col-span-2 md:row-span-2 relative rounded-[4rem] overflow-hidden group cursor-pointer shadow-xl"
                        >
                            <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale-[0.3] group-hover:grayscale-0" alt="Apex" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
                            <div className="absolute bottom-16 left-16">
                                <span className="bg-indigo-600 text-white px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest mb-6 inline-block">Active Status</span>
                                <h3 className="text-6xl font-black text-white tracking-tighter uppercase italic mb-6">Titan <br/> Series.</h3>
                                <div className="flex items-center gap-4 text-white/60 group-hover:text-white transition-colors">
                                    <p className="text-[10px] font-black uppercase tracking-widest italic leading-none">Review Discovery</p>
                                    <ArrowRight size={18} />
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            whileHover={{ scale: 0.98 }}
                            className="md:col-span-2 relative rounded-[3.5rem] overflow-hidden group cursor-pointer shadow-lg"
                        >
                            <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="Acoustic" />
                            <div className="absolute inset-0 bg-indigo-900/40 group-hover:bg-indigo-900/20 transition-all backdrop-blur-[2px] group-hover:backdrop-blur-none" />
                            <div className="absolute inset-x-0 bottom-10 px-10 flex justify-between items-end">
                                <div>
                                    <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic">Acoustic Logic.</h3>
                                    <p className="text-[9px] font-black text-white/60 tracking-widest uppercase mt-2">Precision Fidelity Systems</p>
                                </div>
                                <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white border border-white/20">
                                    <Zap size={20} />
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            whileHover={{ scale: 0.98 }}
                            className="relative rounded-[3rem] overflow-hidden group cursor-pointer shadow-lg"
                        >
                            <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" alt="Temporal" />
                            <div className="absolute inset-0 bg-slate-900/30" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <h3 className="text-white text-center">
                                    <span className="text-[9px] font-black uppercase tracking-[0.4em] block mb-2 opacity-60 italic">Temporal</span>
                                    <span className="text-2xl font-black uppercase tracking-tighter italic">Watches.</span>
                                </h3>
                            </div>
                        </motion.div>

                        <motion.div 
                            whileHover={{ scale: 0.98 }}
                            className="relative rounded-[3rem] overflow-hidden group cursor-pointer shadow-lg"
                        >
                            <img src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1000" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" alt="Essential" />
                            <div className="absolute inset-0 bg-slate-900/30" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <h3 className="text-white text-center">
                                    <span className="text-[9px] font-black uppercase tracking-[0.4em] block mb-2 opacity-60 italic">Protocol</span>
                                    <span className="text-2xl font-black uppercase tracking-tighter italic">Essentials.</span>
                                </h3>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Supreme Registry: Active Assets */}
            <section className="py-40 bg-slate-50/50">
                <div className="max-w-7xl mx-auto px-6 sm:px-12">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-28">
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600 italic">Global Distribution</h4>
                            <h2 className="text-7xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                                Discovery <br /> <span className="text-indigo-600">Archive.</span>
                            </h2>
                        </div>
                        <div className="h-px flex-1 bg-slate-100 mb-6 hidden md:block" />
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="animate-pulse">
                                    <div className="aspect-[4/5] bg-white rounded-[3rem] shadow-sm mb-8" />
                                    <div className="h-4 bg-white rounded-full w-2/3 mb-4" />
                                    <div className="h-8 bg-white rounded-full w-1/3" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <motion.div 
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-20"
                        >
                            {featured.map((product) => (
                                <motion.div key={product._id} variants={itemVariants} className="group cursor-pointer">
                                    <Link to={`/product/${product._id}`}>
                                        <div className="relative aspect-[4/5] rounded-[3.5rem] overflow-hidden bg-white border border-slate-50 mb-8 group-hover:shadow-elite transition-all duration-700">
                                            <div className="absolute inset-0 bg-gradient-to-tr from-slate-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <img src={product.image} alt={product.title} className="w-full h-full object-contain p-12 group-hover:scale-105 transition-transform duration-1000 grayscale-[0.2] group-hover:grayscale-0" />
                                            
                                            <div className="absolute top-8 right-8 flex flex-col gap-3 translate-x-20 group-hover:translate-x-0 transition-transform duration-700">
                                                <div className="w-14 h-14 rounded-2xl bg-white/80 backdrop-blur-xl shadow-xl flex items-center justify-center text-slate-900">
                                                    <ShoppingCart size={20} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-4">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic">{product.category}</p>
                                            </div>
                                            <h3 className="text-xl font-black text-slate-900 tracking-tighter mb-4 italic uppercase truncate group-hover:text-indigo-600 transition-colors uppercase">{product.title}</h3>
                                            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                                                <span className="text-3xl font-black text-slate-900 tracking-tighter italic leading-none">${product.price}</span>
                                                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full">
                                                    <Star size={12} className="text-amber-400" fill="currentColor" />
                                                    <span className="text-[10px] font-black text-slate-900 italic font-black">{product.rating}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Supreme Infrastructure: Brand Essence */}
            <section className="py-40 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 opacity-5 pointer-events-none rotate-12">
                    <Globe size={600} />
                </div>
                
                <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
                        {[
                            { icon: Shield, title: 'Authentic Protocol', desc: 'Every asset is rigorously verified to meet essence standards of excellence.', color: 'bg-indigo-600' },
                            { icon: Zap, title: 'Express Logistics', desc: 'Our global network ensures assets reach you with zero latency.', color: 'bg-emerald-600' },
                            { icon: Globe, title: 'Ethical Soul', desc: 'Sustainability integrated directly into our infrastructure.', color: 'bg-amber-600' }
                        ].map((v, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group p-12 bg-white/5 rounded-[4rem] border border-white/10 hover:bg-white/10 transition-all duration-500"
                            >
                                <div className={`w-20 h-20 ${v.color} rounded-3xl flex items-center justify-center mb-10 shadow-2xl group-hover:rotate-6 transition-transform`}>
                                    <v.icon size={36} />
                                </div>
                                <h3 className="text-3xl font-black mb-6 tracking-tighter italic uppercase">{v.title}</h3>
                                <p className="text-slate-400 font-medium leading-relaxed italic border-l-2 border-white/10 pl-6 uppercase text-[11px] tracking-wider">{v.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Supreme Communications: Newsletter */}
            <section className="py-60 bg-white relative overflow-hidden">
                <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="space-y-20"
                    >
                        <div className="space-y-8">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.6em] text-indigo-600 italic">Operational Communications</h4>
                            <h2 className="text-8xl md:text-[11rem] font-black text-slate-900 tracking-[-0.07em] mb-8 italic uppercase leading-[0.8] animate-in fade-in transition-all duration-1000">
                                Stay <span className="text-indigo-600">Iconic.</span>
                            </h2>
                            <p className="text-2xl text-slate-500 font-medium italic max-w-3xl mx-auto">Join the elite protocol. Receive primary intelligence on private archival access and upcoming deployments.</p>
                        </div>
                        
                        <div className="relative max-w-2xl mx-auto">
                            <input 
                                type="email" 
                                placeholder="PROTOCOL EMAIL" 
                                className="w-full h-24 bg-slate-50 border-transparent px-12 rounded-[2rem] outline-none focus:bg-white focus:shadow-elite border-4 focus:border-indigo-600 transition-all font-black text-sm tracking-[0.4em] placeholder:text-slate-200 uppercase"
                            />
                            <button className="absolute right-4 top-4 bottom-4 px-12 bg-slate-900 text-white rounded-2xl font-black text-[10px] tracking-[0.3em] hover:bg-indigo-600 transition-all shadow-2xl shadow-slate-900/20 uppercase italic">
                                Subscribe
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Home;
