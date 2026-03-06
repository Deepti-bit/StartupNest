import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, Trash2, Eye, Search, Calendar, IndianRupee, 
  Clock, CheckCircle, XCircle, TrendingUp, Filter, 
  ArrowUpDown, MapPin, CalendarDays, ExternalLink, X,
  ChevronDown, Check, SortAsc, SortDesc
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import EntrepreneurNavbar from './EntrepreneurNavbar';

const MySubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // States
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  
  // Dropdown UI states
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [deleteId, setDeleteId] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setSubmissions([
        {
          _id: "1",
          category: "HealthTech",
          industry: "Healthcare",
          description: "AI-based diagnosis for early-stage skin cancer detection.",
          date: "2024-10-12",
          funding: 500000,
          potential: 92,
          status: 1,
          launchYear: 2025,
          address: "Bangalore, KA",
        },
        {
          _id: "2",
          category: "Fintech",
          industry: "Finance",
          description: "Blockchain-based micro-lending for small scale farmers.",
          date: "2024-11-05",
          funding: 1200000,
          potential: 88,
          status: 2,
          launchYear: 2026,
          address: "Mumbai, MH",
        }
      ]);
      setLoading(false);
    }, 800);
  }, []);

  // --- Constants for Dropdowns ---
  const sortOptions = [
    { id: 'newest', label: 'Newest First', icon: <Calendar size={14}/> },
    { id: 'funding-high', label: 'Funding: High to Low', icon: <SortDesc size={14}/> },
    { id: 'funding-low', label: 'Funding: Low to High', icon: <SortAsc size={14}/> },
    { id: 'potential', label: 'Market Potential', icon: <TrendingUp size={14}/> },
    { id: 'year', label: 'Launch Year', icon: <Rocket size={14}/> },
  ];

  const filterOptions = [
    { id: 'all', label: 'All Status', icon: <Filter size={14}/> },
    { id: '1', label: 'Submitted', icon: <Clock size={14} className="text-blue-500"/> },
    { id: '2', label: 'Shortlisted', icon: <CheckCircle size={14} className="text-emerald-500"/> },
    { id: '3', label: 'Rejected', icon: <XCircle size={14} className="text-rose-500"/> },
  ];

  // --- Logic ---
  const processedData = submissions
    .filter(item => 
      (statusFilter === "all" || item.status.toString() === statusFilter) &&
      (item.category.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === "funding-high") return b.funding - a.funding;
      if (sortBy === "funding-low") return a.funding - b.funding;
      if (sortBy === "potential") return b.potential - a.potential;
      if (sortBy === "year") return b.launchYear - a.launchYear;
      return new Date(b.date) - new Date(a.date);
    });

  const getStatusBadge = (status) => {
    const s = {
      1: { text: "SUBMITTED", color: "text-blue-600", bg: "bg-blue-50" },
      2: { text: "SHORTLISTED", color: "text-emerald-600", bg: "bg-emerald-50" },
      3: { text: "REJECTED", color: "text-rose-600", bg: "bg-rose-50" }
    }[status];
    return (
      <div className={`px-3 py-1 rounded-lg font-black text-[9px] tracking-widest ${s.bg} ${s.color} border border-current/10`}>
        {s.text}
      </div>
    );
  };

  // --- Add this function to fix the error ---
  const handleDelete = () => {
    // 1. Filter out the deleted submission from the local state
    setSubmissions(submissions.filter(s => s._id !== deleteId));
    
    // 2. Close the confirmation modal
    setDeleteId(null);
    
    // 3. Show a professional toast notification
    toast.success('Submission retracted successfully', {
      icon: '🗑️',
      style: {
        borderRadius: '15px',
        background: '#333',
        color: '#fff',
        fontSize: '12px',
        fontWeight: 'bold'
      },
    });

    // Note: When your backend is ready, you would add the API call here:
    // axios.delete(`http://localhost:8080/startupSubmission/deleteStartupSubmission/${deleteId}`)
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-20">
      <EntrepreneurNavbar />
      <Toaster />

      {/* --- HERO SECTION --- */}
      <section className="bg-[#003366] pt-28 pb-20 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex justify-between items-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter">My <span className="text-blue-400 underline decoration-blue-500/30">Ventures</span></h1>
            <p className="text-blue-100/70 text-sm font-medium">Strategic overview of your active startup proposals.</p>
          </motion.div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-[2rem] text-white flex gap-6 shadow-2xl">
             <div className="text-center">
                <p className="text-2xl font-black">{submissions.length}</p>
                <p className="text-[10px] font-bold uppercase opacity-50">Total</p>
             </div>
             <div className="w-[1px] bg-white/10" />
             <div className="text-center text-emerald-400">
                <p className="text-2xl font-black">{submissions.filter(s=>s.status===2).length}</p>
                <p className="text-[10px] font-bold uppercase opacity-50">Active</p>
             </div>
          </div>
        </div>
      </section>

      {/* --- ADVANCED TOOLBAR --- */}
      <main className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
        <div className="bg-white p-3 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-wrap lg:flex-nowrap items-center gap-4 mb-10">
          
          {/* Enhanced Search */}
          <div className="relative flex-grow group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search ventures..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 text-sm font-medium transition-all"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* CUSTOM SORT DROPDOWN */}
          <div className="relative">
            <button 
              onClick={() => {setIsSortOpen(!isSortOpen); setIsFilterOpen(false)}}
              className={`flex items-center gap-3 px-5 py-3 rounded-2xl text-xs font-bold transition-all ${isSortOpen ? 'bg-[#003366] text-white shadow-lg shadow-blue-900/20' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
            >
              <ArrowUpDown size={14} />
              {sortOptions.find(o => o.id === sortBy).label}
              <ChevronDown size={14} className={`transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isSortOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 5, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50"
                >
                  {sortOptions.map((opt) => (
                    <button 
                      key={opt.id} onClick={() => {setSortBy(opt.id); setIsSortOpen(false)}}
                      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-[11px] font-bold transition-all ${sortBy === opt.id ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                      <div className="flex items-center gap-3">{opt.icon} {opt.label}</div>
                      {sortBy === opt.id && <Check size={14} />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* CUSTOM FILTER DROPDOWN */}
          <div className="relative">
            <button 
              onClick={() => {setIsFilterOpen(!isFilterOpen); setIsSortOpen(false)}}
              className={`flex items-center gap-3 px-5 py-3 rounded-2xl text-xs font-bold transition-all ${isFilterOpen ? 'bg-[#003366] text-white shadow-lg shadow-blue-900/20' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
            >
              <Filter size={14} />
              {filterOptions.find(o => o.id === statusFilter).label}
              <ChevronDown size={14} className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isFilterOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 5, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50"
                >
                  {filterOptions.map((opt) => (
                    <button 
                      key={opt.id} onClick={() => {setStatusFilter(opt.id); setIsFilterOpen(false)}}
                      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-[11px] font-bold transition-all ${statusFilter === opt.id ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                      <div className="flex items-center gap-3">{opt.icon} {opt.label}</div>
                      {statusFilter === opt.id && <Check size={14} />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* --- DENSE CARD GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode='popLayout'>
            {processedData.map((sub) => (
              <motion.div 
                layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                key={sub._id}
                className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-100 transition-all group relative"
              >
                {/* Header Stats */}
                <div className="flex justify-between items-center mb-5">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-[#003366] group-hover:text-white transition-colors">
                    <Rocket size={18} />
                  </div>
                  {getStatusBadge(sub.status)}
                </div>

                {/* Title Section */}
                <div className="mb-4">
                  <h3 className="text-base font-black text-slate-800 group-hover:text-[#003366] transition-colors">{sub.category}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">{sub.industry}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                    <span className="text-[9px] font-bold text-blue-500 flex items-center gap-1"><MapPin size={10}/> {sub.address}</span>
                  </div>
                </div>

                {/* Market Potential Progress Bar (New Feature) */}
                <div className="mb-5 space-y-1.5">
                   <div className="flex justify-between items-center">
                      <span className="text-[9px] font-black text-slate-400 uppercase">Market Score</span>
                      <span className="text-[10px] font-black text-emerald-600">{sub.potential}%</span>
                   </div>
                   <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} animate={{ width: `${sub.potential}%` }} 
                        className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500" 
                      />
                   </div>
                </div>

                {/* Data Points */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50/50 rounded-2xl mb-6 border border-slate-50">
                  <div className="space-y-0.5">
                    <p className="text-[8px] font-black text-slate-400 uppercase">Funding Ask</p>
                    <p className="text-sm font-black text-slate-700">₹{(sub.funding/100000).toFixed(1)}L</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[8px] font-black text-slate-400 uppercase">Est. Launch</p>
                    <p className="text-sm font-black text-slate-700 flex items-center gap-1.5"><CalendarDays size={12} className="text-blue-500"/> {sub.launchYear}</p>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex gap-2">
                  <button 
                    onClick={() => setSelectedProfile(sub)}
                    className="flex-1 bg-[#003366] text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-900/10 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Eye size={14} /> Full Details
                  </button>
                  {sub.status === 1 && (
                    <button 
                      onClick={() => setDeleteId(sub._id)}
                      className="px-3 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all active:scale-90"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>

      {/* --- MODAL SYSTEM --- */}
      <AnimatePresence>
        {selectedProfile && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProfile(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
             <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden">
                <div className="bg-[#003366] p-8 text-white">
                   <h2 className="text-2xl font-black leading-tight">Venture Analysis</h2>
                   <p className="text-blue-300 text-[10px] font-black uppercase tracking-widest mt-1">{selectedProfile.category}</p>
                </div>
                <div className="p-8 space-y-6">
                   <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">Executive Summary</h4>
                      <p className="text-slate-700 text-sm italic font-medium leading-relaxed">"{selectedProfile.description}"</p>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl border border-slate-100">
                         <p className="text-[9px] font-black text-slate-400 uppercase">Submitted Date</p>
                         <p className="text-xs font-bold text-slate-800">{selectedProfile.date}</p>
                      </div>
                      <div className="p-4 rounded-2xl border border-slate-100 flex items-center justify-between group cursor-pointer hover:bg-blue-50 transition-colors">
                         <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase">Pitch Deck</p>
                            <p className="text-xs font-bold text-blue-600">Download.pdf</p>
                         </div>
                         <ExternalLink size={16} className="text-blue-500 group-hover:translate-x-1 transition-transform" />
                      </div>
                   </div>
                   <button onClick={() => setSelectedProfile(null)} className="w-full py-4 bg-[#003366] text-white font-black rounded-2xl text-xs uppercase tracking-[0.2em] shadow-xl">Close Overview</button>
                </div>
             </motion.div>
          </div>
        )}

        {deleteId && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setDeleteId(null)} className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" />
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative bg-white w-full max-w-sm rounded-[2.5rem] p-10 text-center shadow-2xl border border-white/20">
                <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
                   <XCircle size={40} />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-2">Retract Application?</h3>
                <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">This action will permanently delete your submission from the system.</p>
                <div className="flex gap-4">
                   <button onClick={() => setDeleteId(null)} className="flex-1 py-4 font-bold text-slate-400 hover:text-slate-600 transition-colors">Cancel</button>
                   <button onClick={handleDelete} className="flex-1 py-4 bg-rose-600 text-white font-black rounded-2xl shadow-lg shadow-rose-200 active:scale-95 transition-all">Yes, Delete</button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MySubmissions;
