import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Package, Calendar, MapPin, ShieldCheck, Box, ShoppingBag, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';

const statusConfig = {
    'Pending':    { color: 'bg-amber-50 text-amber-700 border-amber-200',   icon: Clock,        dot: 'bg-amber-400' },
    'Processing': { color: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: Package,      dot: 'bg-indigo-400' },
    'Shipped':    { color: 'bg-blue-50 text-blue-700 border-blue-200',       icon: Truck,        dot: 'bg-blue-400' },
    'Delivered':  { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle, dot: 'bg-emerald-400' },
    'Cancelled':  { color: 'bg-rose-50 text-rose-700 border-rose-200',       icon: XCircle,     dot: 'bg-rose-400' },
};

const OrderStatusBadge = ({ status }) => {
    const cfg = statusConfig[status] || statusConfig['Pending'];
    const Icon = cfg.icon;
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border ${cfg.color}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {status || 'Pending'}
        </span>
    );
};

const Profile = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get('/orders/mine');
                setOrders(res.data.orders || []);
            } catch (error) {
                console.error("Failed to fetch orders", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchOrders();
        }
    }, [user]);

    if (!user) {
        return (
            <div className="pt-24 min-h-screen flex items-center justify-center bg-white">
                <div className="text-center space-y-8 max-w-md px-6">
                    <div className="w-24 h-24 bg-slate-900 rounded-[2rem] mx-auto flex items-center justify-center text-white shadow-2xl">
                        <User size={40} />
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Access <span className="text-indigo-600">Denied.</span></h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Please establish a connection through the login protocol</p>
                    <Link to="/login" className="block w-full h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-900/10">
                        Initiate Connection
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/20 pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-10 pb-8 border-b border-slate-100"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-600">Account Active</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                        My <span className="text-indigo-600">Profile.</span>
                    </h1>
                    <p className="text-slate-400 text-sm font-medium mt-2">Welcome back, <strong className="text-slate-700">{user.name}</strong></p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Sidebar */}
                    <aside className="lg:col-span-4 space-y-5">
                        {/* Profile Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm"
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center text-white text-4xl font-black mb-5 shadow-lg shadow-indigo-200">
                                    {user.name[0].toUpperCase()}
                                </div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">{user.name}</h2>
                                <p className="text-slate-400 text-sm font-medium mb-6">{user.email}</p>
                                
                                <div className="w-full grid grid-cols-2 gap-3">
                                    <div className="bg-slate-50 rounded-2xl p-4 text-center border border-slate-100">
                                        <p className="text-2xl font-black text-indigo-600">{orders.length}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Orders</p>
                                    </div>
                                    <div className="bg-slate-50 rounded-2xl p-4 text-center border border-slate-100">
                                        <p className="text-2xl font-black text-emerald-600">{new Date(user.createdAt || Date.now()).getFullYear()}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Joined</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Security Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="bg-slate-900 rounded-3xl p-6 text-white"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <ShieldCheck size={18} className="text-emerald-400" />
                                <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400">Secured Account</span>
                            </div>
                            <p className="text-slate-400 text-xs leading-relaxed">Your account is protected with industry-standard encryption. All your data is safe with us.</p>
                        </motion.div>
                    </aside>

                    {/* Orders List */}
                    <main className="lg:col-span-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <ShoppingBag size={18} className="text-indigo-500" />
                                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Order History</h3>
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">
                                    {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
                                </span>
                            </div>

                            {loading ? (
                                <div className="space-y-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-36 bg-white animate-pulse rounded-3xl border border-slate-100" />
                                    ))}
                                </div>
                            ) : orders.length === 0 ? (
                                <div className="py-20 text-center bg-white rounded-3xl border border-slate-100">
                                    <Box size={48} className="mx-auto text-slate-200 mb-5" strokeWidth={1} />
                                    <h4 className="text-xl font-black text-slate-900 mb-2 uppercase italic">No Orders Yet</h4>
                                    <p className="text-slate-400 text-sm mb-8">Start shopping to see your orders here</p>
                                    <Link to="/shop" className="inline-block h-12 px-10 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all">
                                        Browse Products
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <AnimatePresence>
                                        {orders.map((order, idx) => (
                                            <motion.div
                                                key={order._id}
                                                initial={{ opacity: 0, y: 15 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.08 }}
                                                className="group bg-white rounded-3xl border border-slate-100 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50 transition-all duration-400 overflow-hidden"
                                            >
                                                {/* Order Header */}
                                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 border-b border-slate-50">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                                                            <Package size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Order ID</p>
                                                            <p className="font-black text-slate-900 text-sm tracking-tight">#{order._id.slice(-10).toUpperCase()}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4 sm:flex-shrink-0">
                                                        {/* ✅ BUG FIX: was order.orderStatus (undefined), now order.status */}
                                                        <OrderStatusBadge status={order.status || 'Pending'} />
                                                        <div className="flex items-center gap-2 text-slate-400">
                                                            <Calendar size={13} />
                                                            <span className="text-[11px] font-bold">{new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Order Items */}
                                                <div className="p-5">
                                                    <div className="flex gap-3 mb-4 flex-wrap">
                                                        {order.orderItems.map((item, index) => (
                                                            <Link key={index} to={`/product/${item.product}`} className="flex items-center gap-3 bg-slate-50 rounded-xl p-2.5 pr-4 hover:bg-indigo-50 hover:border-indigo-100 border border-transparent transition-all group/item">
                                                                <div className="w-12 h-12 bg-white rounded-xl overflow-hidden border border-slate-100 flex-shrink-0">
                                                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <p className="text-xs font-bold text-slate-700 truncate max-w-32">{item.title}</p>
                                                                    <p className="text-[10px] text-slate-400">Qty: {item.qty} · ${item.price}</p>
                                                                </div>
                                                            </Link>
                                                        ))}
                                                    </div>

                                                    {/* Footer */}
                                                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                                        <div className="flex items-center gap-2 text-slate-500">
                                                            <MapPin size={13} />
                                                            <span className="text-[11px] font-medium">
                                                                {order.shippingAddress?.city}, {order.shippingAddress?.country}
                                                            </span>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total</p>
                                                            <p className="text-xl font-black text-slate-900 tracking-tight">${order.totalPrice?.toFixed(2)}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}
                        </motion.div>
                    </main>
                </div>
            </div>
        </div>
    );

};

export default Profile;
