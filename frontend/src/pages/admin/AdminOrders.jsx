import React, { useState, useEffect } from 'react';
import { Package, Search, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const OrderStatusBadge = ({ status }) => {
    const styles = {
        'Pending': 'bg-rose-50 text-rose-600',
        'Processing': 'bg-amber-50 text-amber-600',
        'Shipped': 'bg-blue-50 text-blue-600',
        'Delivered': 'bg-emerald-50 text-emerald-600',
        'Cancelled': 'bg-slate-100 text-slate-400',
    };

    const style = styles[status] || styles['Pending'];
    return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${style}`}>
            {status}
        </span>
    );
};

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await api.get('/orders/');
            setOrders(res.data.orders || []);
        } catch (error) {
            toast.error('Failed to fetch orders');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        const loadingToast = toast.loading('Updating status...');
        try {
            await api.put(`/orders/${orderId}/status`, { status: newStatus });
            toast.success('Order status updated', { id: loadingToast });
            fetchOrders();
        } catch (error) {
            toast.error('Failed to update status', { id: loadingToast });
        }
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Header & Operations Ticker */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-8 pb-8 border-b border-slate-100">
                <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600 mb-4">Logistics Command</h4>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic mb-2">Operations <span className="text-indigo-600">Registry.</span></h1>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global fulfillment and settlement monitoring</p>
                </div>
                <div className="relative group w-full md:w-auto">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search protocol ID..." 
                        className="h-16 pl-14 pr-8 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none font-bold text-slate-900 w-full md:w-80 shadow-sm"
                    />
                </div>
            </div>

            {/* Operational Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                {[
                    { label: 'Active Protocols', value: orders.filter(o => o.orderStatus !== 'Delivered').length, sub: 'In-Transit / Processing', color: 'text-amber-500' },
                    { label: 'Settled', value: orders.filter(o => o.orderStatus === 'Delivered').length, sub: 'Finalized Logistics', color: 'text-emerald-500' },
                    { label: 'Total Valuation', value: `$${orders.reduce((acc, o) => acc + (o.totalPrice || 0), 0).toLocaleString()}`, sub: 'Gross Revenue Assets', color: 'text-indigo-600' },
                    { label: 'Fulfillment Rate', value: '98.4%', sub: 'System Efficiency', color: 'text-slate-900' }
                ].map((stat, i) => (
                    <div key={i} className="glass-elite p-8 rounded-[2rem] border border-slate-100 bg-white shadow-elite group transition-all duration-500">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">{stat.label}</p>
                        <h3 className={`text-3xl font-black ${stat.color} tracking-tighter italic mb-1`}>{stat.value}</h3>
                        <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">{stat.sub}</p>
                    </div>
                ))}
            </div>

            {/* Operations Table */}
            <div className="glass-elite rounded-[3rem] border border-slate-100 shadow-elite overflow-hidden bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-400 text-[9px] uppercase font-black tracking-widest border-b border-slate-50">
                                <th className="px-10 py-7 italic">Protocol ID</th>
                                <th className="px-10 py-7">Consignee</th>
                                <th className="px-10 py-7">Temporal Stamp</th>
                                <th className="px-10 py-7">Logistics Hub Status</th>
                                <th className="px-10 py-7 text-right">Settlement</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-10 py-32 text-center">
                                        <div className="w-10 h-10 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
                                    </td>
                                </tr>
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-10 py-32 text-center">
                                        <div className="flex flex-col items-center">
                                            <Package className="text-slate-100 mb-4" size={48} />
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] italic">No active operations found.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order._id} className="group hover:bg-slate-50/80 transition-all duration-300">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white/50 group-hover:text-indigo-400 transition-colors">
                                                    <Package size={16} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[11px] font-black text-slate-900 tracking-widest">#{order._id.slice(-8).toUpperCase()}</span>
                                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Encrypted Entry</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex flex-col">
                                                <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{order.user?.name || 'Unknown Entity'}</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{order.user?.email || 'N/A'}</p>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</span>
                                                <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest mt-0.5">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-4">
                                                <OrderStatusBadge status={order.orderStatus || 'Pending'} />
                                                <select 
                                                    value={order.orderStatus || 'Pending'}
                                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                    className="opacity-0 group-hover:opacity-100 focus:opacity-100 h-9 px-4 bg-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-900 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Processing">Processing</option>
                                                    <option value="Shipped">Shipped</option>
                                                    <option value="Delivered">Delivered</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                </select>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-right font-black text-slate-900 tracking-tighter text-sm underline-offset-4 decoration-indigo-200 decoration-2">
                                            ${order.totalPrice?.toFixed(2) || '0.00'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminOrders;
