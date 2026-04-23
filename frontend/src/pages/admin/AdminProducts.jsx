import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import Modal from '../../components/Modal';
import { motion } from "framer-motion";

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentProductId, setCurrentProductId] = useState(null);

    const initialFormState = {
        title: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        rating: '0',
        numReviews: '0',
        image: null
    };

    const [formData, setFormData] = useState(initialFormState);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await api.get('/products/getproduct');
            setProducts(res.data.data || []);
        } catch (error) {
            toast.error('Failed to fetch products');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const openAddModal = () => {
        setIsEditMode(false);
        setFormData(initialFormState);
        setImagePreview(null);
        setCurrentProductId(null);
        setIsModalOpen(true);
    };

    const openEditModal = (product) => {
        setIsEditMode(true);
        setCurrentProductId(product._id);
        setFormData({
            title: product.title,
            description: product.description,
            price: product.price,
            category: product.category,
            stock: product.stock,
            rating: product.rating,
            numReviews: product.numReviews,
            image: null // Keep null unless user uploads new
        });
        setImagePreview(product.image);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/products/deleteproduct/${id}`);
                toast.success('Product deleted successfully');
                fetchProducts();
            } catch (error) {
                toast.error('Failed to delete product');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'image' && !formData[key]) return; // Skip if no new image in edit
            data.append(key, formData[key]);
        });

        const loadingToast = toast.loading(isEditMode ? 'Updating product...' : 'Creating product...');

        try {
            if (isEditMode) {
                await api.put(`/products/updateproduct/${currentProductId}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Product updated successfully', { id: loadingToast });
            } else {
                await api.post('/products/createproduct', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Product created successfully', { id: loadingToast });
            }
            setIsModalOpen(false);
            fetchProducts();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Something went wrong', { id: loadingToast });
        }
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Header & Core Actions */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-8 pb-8 border-b border-slate-100">
                <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600 mb-4">Inventory Protocols</h4>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic mb-2">Product <span className="text-indigo-600">Registry.</span></h1>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Authorized asset management portal</p>
                </div>
                <button 
                    onClick={openAddModal}
                    className="h-20 px-10 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] transition-all shadow-2xl flex items-center justify-center gap-4 hover:bg-indigo-600 active:scale-95 group"
                >
                    <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                    Archive New Asset
                </button>
            </div>

            {/* Registry Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {[
                    { label: 'Total Units', value: products.reduce((acc, p) => acc + p.stock, 0), sub: 'Gross Inventory', color: 'text-indigo-600' },
                    { label: 'Low Stock Alerts', value: products.filter(p => p.stock < 10).length, sub: 'Immediate Action Required', color: 'text-rose-500' },
                    { label: 'Portfolio Value', value: `$${products.reduce((acc, p) => acc + (p.price * p.stock), 0).toLocaleString()}`, sub: 'Estimated Capital', color: 'text-emerald-500' }
                ].map((stat, i) => (
                    <div key={i} className="glass-lite p-8 rounded-[2rem] border border-slate-100 bg-white shadow-elite group">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">{stat.label}</p>
                        <h3 className={`text-3xl font-black ${stat.color} tracking-tighter italic mb-1`}>{stat.value}</h3>
                        <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">{stat.sub}</p>
                    </div>
                ))}
            </div>

            {/* Asset Table */}
            <div className="glass-elite rounded-[3rem] border border-slate-100 shadow-elite overflow-hidden bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-400 text-[9px] uppercase font-black tracking-widest border-b border-slate-50">
                                <th className="px-10 py-7 italic">Archive Entry</th>
                                <th className="px-10 py-7">Classification</th>
                                <th className="px-10 py-7 text-right">Valuation</th>
                                <th className="px-10 py-7">Sustainability</th>
                                <th className="px-10 py-7 text-right">Authority</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-10 py-32 text-center">
                                        <div className="w-10 h-10 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
                                    </td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-10 py-32 text-center">
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] italic">No Assets Registered.</p>
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product._id} className="group hover:bg-slate-50/80 transition-all duration-300">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-6">
                                                <div className="w-20 h-20 rounded-3xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200/50 group-hover:scale-105 transition-transform">
                                                    {product.image ? (
                                                        <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-200"><ImageIcon size={32} /></div>
                                                    )}
                                                </div>
                                                <div className="max-w-xs space-y-1">
                                                    <p className="text-xs font-black text-slate-900 uppercase tracking-widest truncate">{product.title}</p>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate">{product.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className="px-4 py-2 bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase tracking-widest rounded-xl shadow-sm border border-indigo-100/50">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8 text-right font-black text-slate-900 tracking-tighter text-sm underline-offset-4 decoration-indigo-200 decoration-2">${product.price.toFixed(2)}</td>
                                        <td className="px-10 py-8">
                                            <div className="flex flex-col gap-3">
                                                <div className="flex justify-between items-center text-[8px] font-black tracking-widest">
                                                    <span className={product.stock > 10 ? 'text-emerald-500' : 'text-rose-500 animate-pulse'}>
                                                        {product.stock > 0 ? `${product.stock} UNITS RESAINING` : 'DEPLETED'}
                                                    </span>
                                                </div>
                                                <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden p-[2px]">
                                                    <motion.div 
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${Math.min(product.stock * 2, 100)}%` }}
                                                        transition={{ duration: 1 }}
                                                        className={`h-full rounded-full ${product.stock > 10 ? 'bg-emerald-500' : 'bg-rose-500'}`} 
                                                    ></motion.div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                                                <button onClick={() => openEditModal(product)} className="w-12 h-12 bg-white text-slate-400 hover:text-indigo-600 hover:shadow-xl rounded-2xl transition-all flex items-center justify-center border border-slate-100" title="Edit Entry">
                                                    <Edit2 size={18} />
                                                </button>
                                                <button onClick={() => handleDelete(product._id)} className="w-12 h-12 bg-white text-slate-400 hover:text-rose-600 hover:shadow-xl rounded-2xl transition-all flex items-center justify-center border border-slate-100" title="Archive Entry">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                title={isEditMode ? 'Modify Registry Entry' : 'New Asset Registration'}
            >
                <form onSubmit={handleSubmit} className="space-y-8 p-4">
                    <div className="space-y-6">
                        <div className="group relative">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block group-focus-within:text-indigo-600 transition-colors">Asset Identity (Title)</label>
                            <input 
                                type="text" name="title" value={formData.title} onChange={handleInputChange} required 
                                className="w-full h-16 px-6 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none font-bold text-slate-900" 
                            />
                        </div>
                        <div className="group relative">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block group-focus-within:text-indigo-600 transition-colors">Asset Specifications (Description)</label>
                            <textarea 
                                name="description" value={formData.description} onChange={handleInputChange} required rows="3" 
                                className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none font-bold text-slate-900 resize-none"
                            ></textarea>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="group relative">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block group-focus-within:text-indigo-600 transition-colors">Unit Valuation</label>
                                <input 
                                    type="number" step="0.01" name="price" value={formData.price} onChange={handleInputChange} required 
                                    className="w-full h-16 px-6 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none font-bold text-slate-900" 
                                />
                            </div>
                            <div className="group relative">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block group-focus-within:text-indigo-600 transition-colors">Stock Reserves</label>
                                <input 
                                    type="number" name="stock" value={formData.stock} onChange={handleInputChange} required 
                                    className="w-full h-16 px-6 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none font-bold text-slate-900" 
                                />
                            </div>
                        </div>
                        <div className="group relative">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block group-focus-within:text-indigo-600 transition-colors">Classification (Category)</label>
                            <input 
                                type="text" name="category" value={formData.category} onChange={handleInputChange} required 
                                className="w-full h-16 px-6 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none font-bold text-slate-900" 
                            />
                        </div>
                        
                        <div className="group relative">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 block group-focus-within:text-indigo-600 transition-colors">Visual Archive (Image)</label>
                            <div className="flex items-center gap-6">
                                {imagePreview && (
                                    <div className="w-24 h-24 rounded-3xl overflow-hidden flex-shrink-0 border-2 border-slate-100 shadow-lg">
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <div className="flex-1 relative">
                                    <input 
                                        type="file" accept="image/*" onChange={handleImageChange} required={!isEditMode}
                                        className="hidden" id="file-upload"
                                    />
                                    <label htmlFor="file-upload" className="flex items-center justify-center gap-3 w-full h-16 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[1.5rem] cursor-pointer hover:bg-slate-100 hover:border-indigo-400 transition-all text-slate-400 font-black text-[10px] uppercase tracking-widest">
                                        <ImageIcon size={20} />
                                        Establish Visual File
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="pt-10 flex gap-6 mt-8 border-t border-slate-50">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 h-16 font-black uppercase tracking-widest text-[10px] text-slate-400 hover:text-slate-900 transition-colors">
                            Abort
                        </button>
                        <button type="submit" className="flex-[2] h-16 bg-slate-900 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-2xl">
                            {isEditMode ? 'Authorize Modifications' : 'Register Asset'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default AdminProducts;
