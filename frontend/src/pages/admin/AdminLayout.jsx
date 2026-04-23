import React from 'react';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, LogOut, CheckSquare } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

const AdminLayout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Implement logout logic here later if needed
        localStorage.removeItem('accessToken');
        navigate('/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} />, exact: true },
        { name: 'Products', path: '/admin/products', icon: <Package size={20} /> },
        { name: 'Orders', path: '/admin/orders', icon: <ShoppingCart size={20} /> },
        { name: 'Tasks', path: '/admin/todos', icon: <CheckSquare size={20} /> },
    ];

    return (
        <div className="flex h-screen bg-white text-slate-900 font-sans overflow-hidden">
            <Toaster position="top-right" />
            
            {/* Elite Sidebar */}
            <aside className="w-80 h-full p-6 flex flex-col z-30">
                <div className="h-full glass-elite rounded-[3rem] shadow-elite flex flex-col overflow-hidden border border-slate-100">
                    <div className="p-10">
                        <Link to="/" className="flex items-center gap-4 group">
                            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-xl group-hover:bg-indigo-600 transition-all duration-500 shadow-2xl rotate-3 group-hover:rotate-0">
                                E
                            </div>
                            <div className="flex flex-col">
                                <span className="font-black text-2xl tracking-tighter text-slate-900 leading-none">ESSENCE</span>
                                <span className="text-[8px] font-black uppercase tracking-[0.4em] text-indigo-600 mt-1">Command Hub</span>
                            </div>
                        </Link>
                    </div>
                    
                    <nav className="flex-1 px-4 space-y-2 mt-4">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                end={item.exact}
                                className={({ isActive }) =>
                                    `flex items-center gap-4 px-6 py-4 rounded-[1.5rem] transition-all duration-500 group relative ${
                                        isActive 
                                        ? 'bg-slate-900 text-white shadow-2xl shadow-slate-900/20 translate-x-1' 
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                    }`
                                }
                            >
                                <span className="relative z-10 transition-transform group-hover:scale-110">{item.icon}</span>
                                <span className="font-black text-xs uppercase tracking-widest relative z-10">{item.name}</span>
                                <div className="absolute right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-1 h-1 bg-indigo-500 rounded-full" />
                                </div>
                            </NavLink>
                        ))}
                    </nav>

                    <div className="p-6">
                        <button 
                            onClick={handleLogout}
                            className="flex items-center gap-4 px-6 py-5 w-full rounded-[1.5rem] bg-rose-50 text-rose-600 font-black text-xs uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all duration-500 group"
                        >
                            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                            <span>Terminate Session</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Operations Area */}
            <main className="flex-1 flex flex-col h-full relative p-6 pl-0">
                <div className="flex-1 glass-elite rounded-[3.5rem] shadow-elite flex flex-col overflow-hidden bg-slate-50/20 border border-slate-100">
                    <header className="h-24 flex items-center justify-between px-12 border-b border-slate-100/50 bg-white/40 backdrop-blur-md sticky top-0 z-20">
                        <div className="flex items-center gap-4">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            <div className="flex flex-col">
                                <h1 className="text-sm font-black text-slate-900 uppercase tracking-widest">System Operational</h1>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Telemetry Active</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-8">
                            <div className="hidden sm:flex items-center gap-6 pr-8 border-r border-slate-100">
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Active Protocols</p>
                                    <p className="text-sm font-black text-slate-900 tracking-tighter">V4.0.2-Stable</p>
                                </div>
                                <button className="glass-elite w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:shadow-lg transition-all">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                                </button>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="text-right hidden sm:block">
                                    <p className="text-xs font-black text-slate-900 uppercase tracking-tight">Executive Identity</p>
                                    <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-[0.2em]">Authorized Access</p>
                                </div>
                                <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-xl shadow-2xl relative group cursor-pointer overflow-hidden">
                                    <div className="absolute inset-0 bg-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                    <span className="relative z-10">A</span>
                                </div>
                            </div>
                        </div>
                    </header>
                    
                    <div className="flex-1 overflow-auto p-12 custom-scrollbar">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
