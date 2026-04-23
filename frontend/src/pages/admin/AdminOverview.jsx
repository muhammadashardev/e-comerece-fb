import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Package, ShoppingCart, DollarSign, CheckSquare, Clock, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const StatCard = ({ title, value, icon: Icon, colorClass, trend }) => (
    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 p-6 transition-all hover:shadow-xl hover:-translate-y-1 duration-300">
        <div className="flex justify-between items-start mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass} shadow-lg shadow-current/10`}>
                <Icon size={24} />
            </div>
            {trend && (
                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${trend > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {trend > 0 ? '+' : ''}{trend}%
                </span>
            )}
        </div>
        <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
            <h3 className="text-2xl font-black text-slate-900">{value}</h3>
        </div>
    </div>
);

const AdminOverview = () => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        recentOrders: [],
        pendingTasks: [],
        loading: true,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [productsRes, ordersRes, tasksRes] = await Promise.all([
                    api.get('/products/getproduct'),
                    api.get('/orders/'),
                    api.get('/todos')
                ].map(p => p.catch(e => ({ data: { products: [], orders: [], data: { todos: [] } } }))));

                const products = productsRes?.data?.data || productsRes?.data?.products || [];
                const orders = ordersRes?.data?.data || ordersRes?.data?.orders || [];
                const tasks = tasksRes?.data?.data?.todos || [];
                
                const revenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

                setStats({
                    totalProducts: products.length,
                    totalOrders: orders.length,
                    totalRevenue: revenue,
                    recentOrders: orders.slice(0, 5),
                    pendingTasks: tasks.filter(t => !t.completed).slice(0, 3),
                    loading: false
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
                setStats(prev => ({ ...prev, loading: false }));
            }
        };

        fetchStats();
    }, []);

    if (stats.loading) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Executive Header */}
            <div className="mb-8">
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic mb-2">Operations <span className="text-indigo-600">Overview.</span></h2>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Real-time assets and mission telemetry</p>
            </div>

            {/* Bento Ticker */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { title: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-indigo-600', trend: '+12.4%', sub: 'Asset Valuation' },
                    { title: 'Operations', value: stats.totalOrders, icon: ShoppingCart, color: 'text-emerald-500', trend: '+8.1%', sub: 'Fulfilled Units' },
                    { title: 'Inventory', value: stats.totalProducts, icon: Package, color: 'text-amber-500', sub: 'Active SKUs' },
                    { title: 'The Collective', value: '1,284', icon: Users, color: 'text-rose-500', trend: '-2.4%', sub: 'Verified Members' }
                ].map((stat, i) => (
                    <motion.div 
                        key={i}
                        whileHover={{ y: -5 }}
                        className="glass-elite p-8 rounded-[2.5rem] border border-slate-100 shadow-elite relative group overflow-hidden bg-white hover:bg-slate-50 transition-all duration-500"
                    >
                        <div className="flex justify-between items-start mb-8">
                            <div className={`w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center ${stat.color} group-hover:rotate-6 transition-transform shadow-sm`}>
                                <stat.icon size={28} />
                            </div>
                            {stat.trend && (
                                <span className={`text-[10px] font-black px-3 py-1.5 rounded-full ${stat.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'} shadow-sm`}>
                                    {stat.trend}
                                </span>
                            )}
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{stat.title}</p>
                            <h3 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-2 italic">
                                {stat.value}
                            </h3>
                            <p className="text-[8px] font-bold text-slate-300 uppercase tracking-[0.2em]">{stat.sub}</p>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                ))}
            </div>

            {/* Matrix Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Registry Table */}
                <div className="lg:col-span-2 glass-elite rounded-[3rem] border border-slate-100 shadow-elite overflow-hidden bg-white">
                    <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Acquisition Registry</h3>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Latest system transactions</p>
                        </div>
                        <Link to="/admin/orders" className="h-12 px-6 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl">
                            All Logs
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50 text-slate-400 text-[9px] uppercase font-black tracking-widest">
                                    <th className="px-10 py-6 italic">Identifier</th>
                                    <th className="px-10 py-6">Protocol Status</th>
                                    <th className="px-10 py-6 text-right">Valuation</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {stats.recentOrders.length > 0 ? stats.recentOrders.map((order) => (
                                    <tr key={order._id} className="group hover:bg-slate-50/80 transition-all duration-300">
                                        <td className="px-10 py-7">
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-black text-slate-900 tracking-widest uppercase">#{order._id.slice(-8).toUpperCase()}</span>
                                                <span className="text-[8px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Verified Entry</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-7">
                                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm ${
                                                order.orderStatus === 'Delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600 animate-pulse'
                                            }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${order.orderStatus === 'Delivered' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                                {order.orderStatus || 'Pending'}
                                            </div>
                                        </td>
                                        <td className="px-10 py-7 text-right">
                                            <span className="text-sm font-black text-slate-900 underline-offset-4 decoration-indigo-200 decoration-2">${order.totalPrice?.toFixed(2)}</span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="3" className="px-10 py-24 text-center">
                                            <div className="flex flex-col items-center">
                                                <Clock className="text-slate-100 mb-4" size={48} />
                                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] italic">Awaiting New Protocols...</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Operations Checklist */}
                <div className="glass-elite rounded-[3rem] border border-slate-100 shadow-elite p-10 flex flex-col bg-white">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Active Tasks</h3>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Personnel Directives</p>
                        </div>
                        <Link to="/admin/todos" className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white hover:bg-indigo-600 transition-all shadow-xl shadow-slate-900/10">
                            <Plus size={20} />
                        </Link>
                    </div>
                    <div className="flex-1 space-y-4">
                        {stats.pendingTasks.length > 0 ? stats.pendingTasks.map((task, i) => (
                            <motion.div 
                                key={task._id} 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center gap-6 p-6 rounded-[1.5rem] bg-slate-50 border border-slate-100 group hover:bg-white hover:shadow-lg transition-all duration-500 border-l-[6px] border-l-indigo-600"
                            >
                                <div className="flex flex-col flex-1 overflow-hidden">
                                    <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight truncate mb-1">{task.task}</p>
                                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Priority: {task.priority || 'Standard'}</p>
                                </div>
                                <CheckSquare size={16} className="text-slate-200 group-hover:text-indigo-600 transition-colors" />
                            </motion.div>
                        )) : (
                            <div className="h-full flex flex-col items-center justify-center text-center py-10 opacity-50">
                                <CheckSquare className="text-slate-200 mb-6" size={64} />
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] italic">System Cleared</p>
                            </div>
                        )}
                    </div>
                    <Link to="/admin/todos" className="mt-12 w-full h-16 bg-slate-50 text-slate-400 border border-slate-100 rounded-[1.5rem] flex items-center justify-center text-[10px] font-black uppercase tracking-[0.3em] hover:bg-slate-900 hover:text-white transition-all duration-500">
                        Operational Logbook
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;
