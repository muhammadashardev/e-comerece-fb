import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle, Circle, AlertCircle, Clock } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const AdminTodo = () => {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newTask, setNewTask] = useState('');
    const [priority, setPriority] = useState('Medium');

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            setLoading(true);
            const res = await api.get('/todos');
            setTodos(res.data.data.todos);
        } catch (error) {
            toast.error('Failed to load tasks');
        } finally {
            setLoading(false);
        }
    };

    const handleAddTodo = async (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        const loadingToast = toast.loading('Adding task...');
        try {
            const res = await api.post('/todos', { task: newTask, priority });
            setTodos([res.data.data.todo, ...todos]);
            setNewTask('');
            setPriority('Medium');
            toast.success('Task added!', { id: loadingToast });
        } catch (error) {
            toast.error('Failed to add task', { id: loadingToast });
        }
    };

    const toggleComplete = async (todo) => {
        try {
            const res = await api.patch(`/todos/${todo._id}`, { completed: !todo.completed });
            setTodos(todos.map(t => t._id === todo._id ? res.data.data.todo : t));
            if (!todo.completed) {
                toast.success('Task completed! 🎉');
            }
        } catch (error) {
            toast.error('Update failed');
        }
    };

    const deleteTodo = async (id) => {
        try {
            await api.delete(`/todos/${id}`);
            setTodos(todos.filter(t => t._id !== id));
            toast.success('Task removed');
        } catch (error) {
            toast.error('Delete failed');
        }
    };

    const getPriorityIcon = (p) => {
        switch (p) {
            case 'High': return <AlertCircle className="text-rose-500" size={16} />;
            case 'Medium': return <Clock className="text-amber-500" size={16} />;
            default: return <Circle className="text-slate-400" size={16} />;
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Header */}
            <div className="text-center">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600 mb-6">Internal Operations</h4>
                <h1 className="text-6xl font-black text-slate-900 tracking-tighter uppercase italic mb-8">Personnel <br /> <span className="text-indigo-600">Directives.</span></h1>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Current mission-critical objectives and task registry</p>
            </div>

            {/* Directive Deployment Module */}
            <form onSubmit={handleAddTodo} className="glass-elite p-10 rounded-[3rem] border border-slate-100 shadow-elite bg-white relative overflow-hidden group">
                <div className="flex flex-col md:flex-row gap-6 relative z-10">
                    <div className="flex-1 relative">
                        <input 
                            type="text" 
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            placeholder="Define new directive..."
                            className="w-full h-20 px-8 bg-slate-50 border border-slate-50 rounded-[1.5rem] focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none font-bold text-slate-900 placeholder:text-slate-300"
                        />
                    </div>
                    <select 
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="h-20 px-8 bg-slate-50 border border-slate-50 rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest text-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer appearance-none"
                    >
                        <option value="Low">Low Priority</option>
                        <option value="Medium">Medium Priority</option>
                        <option value="High">High Priority</option>
                    </select>
                    <button 
                        type="submit"
                        className="h-20 bg-slate-900 text-white font-black px-12 rounded-[1.5rem] flex items-center justify-center gap-4 shadow-2xl hover:bg-indigo-600 transition-all active:scale-95 group"
                    >
                        <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                        Deploy
                    </button>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </form>

            {/* Directives Registry */}
            <div className="space-y-6">
                {loading ? (
                    <div className="py-24 text-center">
                        <div className="w-12 h-12 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
                    </div>
                ) : todos.length === 0 ? (
                    <div className="glass-elite border-2 border-dashed border-slate-100 p-24 rounded-[3rem] text-center bg-slate-50/20">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] italic leading-relaxed">System Operational Status: Optimal.<br/>No Active Directives Pending.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        <AnimatePresence mode='popLayout'>
                            {todos.map((todo, i) => (
                                <motion.div 
                                    key={todo._id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.5, delay: i * 0.05 }}
                                    className={`group flex items-center gap-8 p-8 rounded-[2.5rem] border transition-all duration-500 ${
                                        todo.completed 
                                        ? 'bg-slate-50/50 border-slate-100 grayscale opacity-50' 
                                        : 'bg-white border-slate-100 shadow-sm hover:shadow-elite hover:border-indigo-100'
                                    }`}
                                >
                                    <button 
                                        onClick={() => toggleComplete(todo)}
                                        className={`w-10 h-10 border-2 rounded-xl flex items-center justify-center transition-all ${todo.completed ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-200 text-transparent hover:border-indigo-400 group-hover:scale-110'}`}
                                    >
                                        <CheckCircle size={20} />
                                    </button>

                                    <div className="flex-1 min-w-0 py-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className={`w-2 h-2 rounded-full ${todo.priority === 'High' ? 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.5)]' : todo.priority === 'Medium' ? 'bg-amber-500' : 'bg-slate-300'} ${todo.priority === 'High' ? 'animate-pulse' : ''}`} />
                                            <span className={`text-[9px] font-black uppercase tracking-widest ${
                                                todo.priority === 'High' ? 'text-rose-500' : todo.priority === 'Medium' ? 'text-amber-500' : 'text-slate-400'
                                            }`}>
                                                {todo.priority} Protocol
                                            </span>
                                        </div>
                                        <h4 className={`text-xl font-black tracking-tight leading-tight transition-all truncate ${todo.completed ? 'line-through text-slate-400' : 'text-slate-900 group-hover:text-indigo-600'}`}>
                                            {todo.task}
                                        </h4>
                                    </div>

                                    <button 
                                        onClick={() => deleteTodo(todo._id)}
                                        className="w-12 h-12 flex items-center justify-center text-slate-200 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
            
            <div className="pt-10 flex justify-center">
                <div className="flex items-center gap-4 text-slate-200 grayscale opacity-50">
                    <AlertCircle size={14} />
                    <span className="text-[8px] font-black uppercase tracking-widest text-center">Authorized Directives Protocol v2.1-Executive</span>
                </div>
            </div>
        </div>
    );
};

export default AdminTodo;
