import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, UserCheck, UserX, FileText, 
  Search, Loader2, LogOut, LayoutDashboard, Users, UserCog, Clock
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../Services/api';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Pending'); 
  const [actionLoading, setActionLoading] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/user/all-users');
      setUsers(res.data);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdate = async (userId, updatePayload) => {
    setActionLoading(userId);
    try {
      await api.put('/user/update-user', { userId, ...updatePayload });
      toast.success("Action successful");
      fetchUsers(); 
    } catch (err) {
      toast.error("Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter(u => {
    if (filter === 'Pending') return u.status === 'pending';
    if (filter === 'Mentor') return u.role === 'Mentor';
    if (filter === 'Entrepreneur') return u.role === 'Entrepreneur';
    return true; 
  });

  const pendingCount = users.filter(u => u.status === 'pending').length;

  const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans">
      <aside className="w-64 bg-[#002a5c] text-white p-8 hidden lg:flex flex-col justify-between fixed h-full">
        <div>
          <div className="flex items-center gap-2 mb-12">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-[#002a5c] font-black text-lg">S</span>
            </div>
            <span className="text-sm font-black tracking-tighter uppercase">StartupNest <span className="text-blue-400">Admin</span></span>
          </div>

          <nav className="space-y-4">
            <NavItem 
                icon={<Clock size={18} />} 
                label="Verification Queue" 
                active={filter === 'Pending'} 
                onClick={() => setFilter('Pending')} 
                badge={pendingCount}
            />
            <div className="pt-4 pb-2 text-[10px] font-black text-blue-200/30 uppercase tracking-[0.2em]">Management</div>
            <NavItem icon={<LayoutDashboard size={18} />} label="All Users" active={filter === 'All'} onClick={() => setFilter('All')} />
            <NavItem icon={<Users size={18} />} label="Mentors" active={filter === 'Mentor'} onClick={() => setFilter('Mentor')} />
            <NavItem icon={<UserCog size={18} />} label="Entrepreneurs" active={filter === 'Entrepreneur'} onClick={() => setFilter('Entrepreneur')} />
          </nav>
        </div>

        <button onClick={logout} className="flex items-center gap-2 text-blue-200/50 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
          <LogOut size={16} /> Sign Out
        </button>
      </aside>

      <main className="flex-1 ml-64 p-6 md:p-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                {filter === 'Pending' ? 'Verification Queue' : `${filter} Management`}
            </h1>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-1">
                {filteredUsers.length} records found
            </p>
          </div>
        </header>

        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-3">
            <Loader2 className="animate-spin" size={32} />
            <span className="text-[10px] font-black uppercase tracking-widest">Loading Database...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <AnimatePresence mode='wait'>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <UserCard 
                    key={user._id} 
                    user={user} 
                    index={index} 
                    onUpdate={handleUpdate}
                    isLoading={actionLoading === user._id}
                    isPendingView={filter === 'Pending'}
                  />
                ))
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
                  <ShieldCheck className="mx-auto text-slate-200 mb-4" size={48} />
                  <p className="text-slate-400 font-bold text-sm">No {filter.toLowerCase()} users found.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
};


const NavItem = ({ icon, label, active, onClick, badge }) => (
  <div onClick={onClick} className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-white/10 text-white shadow-lg' : 'text-blue-200/60 hover:bg-white/5 hover:text-white'}`}>
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>
    </div>
    {badge > 0 && <span className="bg-blue-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full">{badge}</span>}
  </div>
);

const UserCard = ({ user, index, onUpdate, isLoading, isPendingView }) => {
  const resumeUrl = `http://localhost:8080/${user.resumePath}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05 }}
      className={`bg-white p-6 rounded-[2rem] shadow-sm border ${isPendingView ? 'border-amber-100 bg-amber-50/10' : 'border-slate-100'} flex flex-col gap-4`}
    >
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-white ${user.role === 'Mentor' ? 'bg-indigo-500' : 'bg-emerald-500'}`}>
            {user.userName.charAt(0)}
          </div>
          <div>
            <h3 className="font-black text-slate-800">{user.userName}</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{user.email}</p>
            <div className="flex gap-2 items-center mt-1">
                <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${user.status === 'active' ? 'bg-green-100 text-green-600' : user.status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'}`}>
                {user.status}
                </span>
                <span className="text-[8px] font-black text-slate-300 uppercase tracking-tighter">{user.role}</span>
            </div>
          </div>
        </div>
        
        {user.resumePath && (
          <button 
            onClick={() => window.open(resumeUrl, '_blank')} 
            className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-100 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors text-[9px] font-black uppercase tracking-widest"
          >
            <FileText size={12} /> CV
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
        {!isPendingView ? (
          <div>
            <label className="text-[8px] font-black uppercase text-slate-400 mb-1 block">Role</label>
            <select 
              className="w-full text-[10px] font-bold p-2 bg-slate-50 border-none rounded-lg outline-none"
              value={user.role}
              onChange={(e) => onUpdate(user._id, { role: e.target.value })}
              disabled={isLoading}
            >
              <option value="Mentor">Mentor</option>
              <option value="Entrepreneur">Entrepreneur</option>
            </select>
          </div>
        ) : (
            <div className="flex items-center">
                <p className="text-[9px] text-slate-400 font-bold leading-tight">Review documentation before granting access.</p>
            </div>
        )}

        <div className={isPendingView ? "col-span-1" : ""}>
          <label className="text-[8px] font-black uppercase text-slate-400 mb-1 block">Decision</label>
          <div className="flex gap-2">
            {user.status !== 'active' && (
              <button 
                onClick={() => onUpdate(user._id, { status: 'active' })}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-2 flex justify-center items-center shadow-lg shadow-blue-200 transition-all"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 size={14} className="animate-spin" /> : <UserCheck size={16} />}
              </button>
            )}
            {user.status !== 'rejected' && (
              <button 
                onClick={() => onUpdate(user._id, { status: 'rejected' })}
                className="flex-1 bg-white hover:bg-rose-50 text-rose-500 border border-rose-100 rounded-xl p-2 flex justify-center items-center transition-all"
                disabled={isLoading}
              >
                <UserX size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;