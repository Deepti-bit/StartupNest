import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, UserCheck, UserX, FileText, ExternalLink, 
  Search, Filter, Loader2, LogOut, LayoutDashboard, Users 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../Services/api';

const AdminDashboard = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  // --- 1. FETCH PENDING MENTORS ---
  const fetchPendingMentors = async () => {
    try {
      const res = await api.get('/user/pending-mentors');
      setMentors(res.data);
    } catch (err) {
      toast.error("Failed to load mentor requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingMentors();
  }, []);

  // --- 2. APPROVE / REJECT LOGIC ---
  const handleDecision = async (userId, status) => {
    setActionLoading(userId);
    try {
      await api.post('/user/approve-mentor', { userId, status });
      toast.success(`Mentor ${status === 'active' ? 'Approved' : 'Rejected'} successfully`);
      // Update local state to remove the processed mentor
      setMentors(prev => prev.filter(m => m._id !== userId));
    } catch (err) {
      toast.error("Action failed. Try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans">
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-[#002a5c] text-white p-8 hidden lg:flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-12">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-[#002a5c] font-black text-lg">S</span>
            </div>
            <span className="text-sm font-black tracking-tighter uppercase">StartupNest <span className="text-blue-400">Admin</span></span>
          </div>

          <nav className="space-y-4">
            <NavItem icon={<LayoutDashboard size={18} />} label="Overview" active />
            <NavItem icon={<Users size={18} />} label="Pending Mentors" badge={mentors.length} />
          </nav>
        </div>

        <button onClick={logout} className="flex items-center gap-2 text-blue-200/50 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
          <LogOut size={16} /> Sign Out
        </button>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Verification Queue</h1>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-1">Reviewing {mentors.length} pending applications</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input type="text" placeholder="Search mentors..." className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500 transition-all w-64 shadow-sm" />
            </div>
          </div>
        </header>

        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-3">
            <Loader2 className="animate-spin" size={32} />
            <span className="text-[10px] font-black uppercase tracking-widest">Loading Records...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <AnimatePresence>
              {mentors.map((mentor, index) => (
                <MentorRequestCard 
                  key={mentor._id} 
                  mentor={mentor} 
                  index={index} 
                  onAction={handleDecision}
                  isLoading={actionLoading === mentor._id}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {!loading && mentors.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
            <ShieldCheck className="mx-auto text-slate-200 mb-4" size={48} />
            <p className="text-slate-400 font-bold text-sm">No pending verification requests.</p>
          </motion.div>
        )}
      </main>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const NavItem = ({ icon, label, active, badge }) => (
  <div className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-white/10 text-white shadow-lg' : 'text-blue-200/60 hover:bg-white/5 hover:text-white'}`}>
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>
    </div>
    {badge > 0 && <span className="bg-blue-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full">{badge}</span>}
  </div>
);

const MentorRequestCard = ({ mentor, index, onAction, isLoading }) => {
  // Construct the full URL for the resume
  const resumeUrl = `http://localhost:8080/${mentor.resumePath}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-6 hover:shadow-md transition-shadow"
    >
      <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-black text-xl flex-shrink-0">
        {mentor.userName.charAt(0)}
      </div>

      <div className="flex-1 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-black text-slate-800 tracking-tight">{mentor.userName}</h3>
            <div className="flex flex-col gap-1 mt-1">
              <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1 uppercase tracking-widest"><FileText size={10} /> {mentor.email}</span>
              <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1 uppercase tracking-widest"><Users size={10} /> {mentor.mobile}</span>
            </div>
          </div>
          
          <button 
            onClick={() => window.open(resumeUrl, '_blank')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-blue-50 text-slate-500 hover:text-blue-600 rounded-lg transition-colors text-[9px] font-black uppercase tracking-widest"
          >
            View CV <ExternalLink size={12} />
          </button>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            disabled={isLoading}
            onClick={() => onAction(mentor._id, 'active')}
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
          >
            {isLoading ? <Loader2 className="animate-spin" size={14} /> : <><UserCheck size={14} /> Approve Access</>}
          </button>
          
          <button
            disabled={isLoading}
            onClick={() => onAction(mentor._id, 'rejected')}
            className="px-4 py-3 bg-white hover:bg-rose-50 text-rose-500 border border-rose-100 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all"
          >
            <UserX size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;