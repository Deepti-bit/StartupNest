import React, { useEffect, useState } from 'react';
import { 
  Rocket, Users, Lightbulb, PlusCircle, Loader2, 
  AlertCircle, ChevronRight, TrendingUp, Calendar, MapPin
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../Services/api'; 
import EntrepreneurNavbar from '../EntrepreneurComponents/EntrepreneurNavbar';

const EntrepreneurHome = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dashboardData, setDashboardData] = useState({
        ideasCount: 0,
        mentorsCount: 0,
        recentSubmissions: []
    });

    const userName = localStorage.getItem('userName') || 'Founder';

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setLoading(true);
                // This calls the endpoint we created in the previous step
                const response = await api.get('/user/entrepreneur/dashboard');
                setDashboardData(response.data);
                setError(null);
            } catch (err) {
                console.error("Dashboard Fetch Error:", err);
                setError("Could not sync with the ecosystem. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    const statsList = [
        { 
            label: 'Ideas Submitted', 
            value: dashboardData.ideasCount, 
            icon: <Lightbulb className="text-amber-500" size={24} />,
            color: "bg-amber-50"
        },
        { 
            label: 'Available Mentors', 
            value: dashboardData.mentorsCount, 
            icon: <Users className="text-blue-500" size={24} />,
            color: "bg-blue-50"
        },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
                <p className="text-gray-500 font-bold animate-pulse uppercase tracking-widest text-xs">Synchronizing Dashboard...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] font-sans">
            <EntrepreneurNavbar />

            <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
                
                {/* --- HEADER SECTION --- */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }} 
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                            Welcome back, <span className="text-indigo-600">{userName}!</span> 👋
                        </h1>
                        <p className="text-slate-500 mt-2 font-medium">
                            Your startup ecosystem is active. Here is your current progress.
                        </p>
                    </motion.div>
                    
                    <motion.button 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/entrepreneur/submit-idea')}
                        className="flex items-center justify-center gap-3 bg-[#002a5c] hover:bg-black text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all shadow-xl shadow-blue-900/10"
                    >
                        <PlusCircle size={18} />
                        Submit New Venture
                    </motion.button>
                </header>

                {/* --- ERROR ALERT --- */}
                {error && (
                    <div className="mb-10 p-5 bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl flex items-center gap-4">
                        <div className="bg-rose-500 p-2 rounded-lg text-white">
                            <AlertCircle size={20} />
                        </div>
                        <p className="font-bold text-sm">{error}</p>
                    </div>
                )}

                {/* --- STATS GRID --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {statsList.map((stat, i) => (
                        <motion.div 
                            key={i} 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6 hover:shadow-md transition-shadow"
                        >
                            <div className={`p-5 ${stat.color} rounded-2xl`}>
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 font-black uppercase tracking-widest">{stat.label}</p>
                                <p className="text-4xl font-black text-slate-900 mt-1">{stat.value}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-10">
                    
                    {/* --- RECENT SUBMISSIONS (Main Content) --- */}
                    <div className="lg:col-span-2 space-y-8">
                        <section className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                                <h2 className="font-black text-xl text-slate-800 tracking-tight">Recent Venture Proposals</h2>
                                <button 
                                    onClick={() => navigate('/entrepreneur/my-submissions')} 
                                    className="text-indigo-600 text-xs font-black uppercase tracking-widest hover:text-indigo-800 flex items-center gap-1"
                                >
                                    View All <ChevronRight size={14} />
                                </button>
                            </div>

                            <div className="p-8">
                                <AnimatePresence>
                                    {dashboardData.recentSubmissions?.length > 0 ? (
                                        <div className="space-y-4">
                                            {dashboardData.recentSubmissions.map((sub, idx) => (
                                                <motion.div 
                                                    key={sub._id}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.1 }}
                                                    className="flex items-center justify-between p-5 rounded-2xl bg-white border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all group cursor-pointer"
                                                    onClick={() => navigate('/entrepreneur/my-submissions')}
                                                >
                                                    <div className="flex items-center gap-5">
                                                        <div className="bg-slate-50 p-3 rounded-xl group-hover:bg-white group-hover:shadow-sm transition-all text-indigo-600">
                                                            <Rocket size={20}/>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-black text-slate-800 text-sm tracking-tight capitalize">
                                                                Venture in {sub.address || 'Unknown Location'}
                                                            </h4>
                                                            <div className="flex items-center gap-3 mt-1 text-slate-400">
                                                                <span className="flex items-center gap-1 text-[10px] font-bold">
                                                                    <Calendar size={12} /> {new Date(sub.submissionDate).toLocaleDateString()}
                                                                </span>
                                                                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                                                <span className="text-[10px] font-bold">ID: {sub._id.substring(18)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                                            sub.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                                            sub.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                                                            'bg-amber-50 text-amber-600 border-amber-100'
                                                        }`}>
                                                            {sub.status || 'Pending'}
                                                        </span>
                                                        <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-600" />
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-16">
                                            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Rocket className="text-slate-200" size={32} />
                                            </div>
                                            <p className="text-slate-400 text-sm font-medium italic">You haven't submitted any startup ideas yet.</p>
                                            <button 
                                                onClick={() => navigate('/entrepreneur/submit-idea')}
                                                className="mt-4 text-indigo-600 font-bold text-xs uppercase tracking-widest hover:underline"
                                            >
                                                Launch your first venture
                                            </button>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </section>
                    </div>

                    {/* --- SIDEBAR --- */}
                    <div className="space-y-8">
                        <motion.div 
                            whileHover={{ y: -5 }}
                            className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-200 relative overflow-hidden group"
                        >
                            <TrendingUp className="absolute -right-4 -bottom-4 text-white/10 group-hover:scale-110 transition-transform" size={140} />
                            <h3 className="text-xl font-black mb-3 relative z-10">Scale your vision.</h3>
                            <p className="text-indigo-100 text-sm leading-relaxed mb-6 relative z-10">
                                Need expert eyes on your pitch? Connect with our global network of mentors.
                            </p>
                            <button 
                                onClick={() => navigate('/entrepreneur/opportunities')}
                                className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg relative z-10 active:scale-95 transition-all"
                            >
                                Browse Mentors
                            </button>
                        </motion.div>

                        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                            <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
                                <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
                                Founder Tip
                            </h3>
                            <p className="text-sm text-slate-500 leading-relaxed italic">
                                "Focus on solving a specific problem for a specific group of people. Don't try to build everything at once. Your MVP should be minimal, but viable."
                            </p>
                            <div className="mt-6 pt-6 border-t border-slate-50 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                                    <Rocket size={18} className="text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-800 uppercase">Growth Protocol</p>
                                    <p className="text-[9px] text-slate-400 font-bold">Updated Daily</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default EntrepreneurHome;