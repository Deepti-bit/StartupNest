import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import {
  Rocket, TrendingUp, Users, CheckCircle2, XCircle, Clock,
  IndianRupee, ArrowUpRight, Loader2, RefreshCw, Eye,
  FilePlus2, Briefcase, ListChecks, ChevronRight, X,
  AlertTriangle, MapPin, CalendarDays, Sparkles
} from 'lucide-react';
import MentorNavbar from './MentorNavbar';
import api from '../Services/api';

/* ─── theme hook ─── */
function useTheme() {
  const [isDark, setIsDark] = useState(() => localStorage.getItem('sn-theme') !== 'light');
  useEffect(() => {
    const sync = () => setIsDark(localStorage.getItem('sn-theme') !== 'light');
    const iv = setInterval(sync, 200);
    window.addEventListener('storage', sync);
    return () => { clearInterval(iv); window.removeEventListener('storage', sync); };
  }, []);
  return isDark;
}

/* ─── toast ─── */
let _setToasts = null;
function ToastContainer() {
  const [toasts, setToasts] = useState([]);
  _setToasts = setToasts;
  const remove = id => setToasts(p => p.filter(t => t.id !== id));
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div key={t.id}
            initial={{ opacity: 0, x: 60, scale: .92 }} animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60 }}
            className="pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-2xl shadow-xl min-w-[240px]"
            style={{ background: t.type === 'success' ? 'linear-gradient(135deg,#ecfdf5,#d1fae5)' : 'linear-gradient(135deg,#fff1f2,#ffe4e6)', border: `1px solid ${t.type === 'success' ? '#6ee7b7' : '#fca5a5'}` }}>
            <span style={{ color: t.type === 'success' ? '#065f46' : '#991b1b' }}>{t.type === 'success' ? '✓' : '✕'}</span>
            <p className="flex-1 text-[12px] font-semibold" style={{ color: t.type === 'success' ? '#065f46' : '#991b1b' }}>{t.message}</p>
            <button onClick={() => remove(t.id)} className="opacity-40"><X size={11} /></button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
function toast(message, type = 'success', duration = 3500) {
  if (!_setToasts) return;
  const id = Date.now() + Math.random();
  _setToasts(p => [...p, { id, message, type }]);
  setTimeout(() => _setToasts(p => p.filter(t => t.id !== id)), duration);
}

/* ─── Status badge ─── */
function StatusBadge({ status }) {
  const cfg = {
    ShortListed: { color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.22)', label: 'Approved' },
    Approved:    { color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.22)', label: 'Approved' },
    Rejected:    { color: '#f43f5e', bg: 'rgba(244,63,94,0.12)',  border: 'rgba(244,63,94,0.22)',  label: 'Rejected' },
    Pending:     { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.22)', label: 'Pending'  },
  }[status] || { color: '#64748b', bg: 'rgba(100,116,139,0.10)', border: 'rgba(100,116,139,0.18)', label: status };
  return (
    <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest"
      style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color }}>
      {cfg.label}
    </span>
  );
}

/* ─── Custom Tooltip for chart ─── */
function CustomTooltip({ active, payload, label, isDark }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-2xl px-4 py-3 shadow-xl"
      style={{ background: isDark ? '#0d1628' : '#ffffff', border: '1px solid rgba(14,165,233,0.20)', fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif" }}>
      <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: isDark ? '#64748b' : '#94a3b8' }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} className="text-[13px] font-black" style={{ color: p.color }}>
          {p.name}: <span style={{ color: isDark ? '#f1f5f9' : '#0a1628' }}>{p.value}</span>
        </p>
      ))}
    </div>
  );
}

/* ─── Stat Card ─── */
function StatCard({ label, value, icon: Icon, color, bg, onClick, isDark }) {
  const card   = isDark ? '#0d1628' : '#ffffff';
  const border = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const textPri = isDark ? '#f1f5f9' : '#0a1628';
  const textSec = isDark ? '#64748b' : '#94a3b8';
  return (
    <motion.div whileHover={{ y: -3, boxShadow: `0 12px 32px ${color}22` }} whileTap={{ scale: .97 }}
      onClick={onClick}
      className="relative rounded-2xl p-5 overflow-hidden cursor-pointer"
      style={{ background: card, border: `1px solid ${border}`, boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.25)' : '0 4px 20px rgba(0,0,0,0.05)' }}>
      <div className="absolute top-0 left-0 w-full h-[2px]" style={{ background: `linear-gradient(90deg,${color},${color}88)` }} />
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: bg }}>
          <Icon size={18} style={{ color }} />
        </div>
        <ArrowUpRight size={14} style={{ color: textSec }} />
      </div>
      <p className="text-[10px] font-black uppercase tracking-[.15em] mb-1" style={{ color: textSec }}>{label}</p>
      <motion.p key={value} initial={{ scale: .8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="text-[2rem] font-black leading-none" style={{ color: textPri, letterSpacing: '-0.04em' }}>
        {value}
      </motion.p>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════════════ */
export default function MentorDashboard() {
  const navigate = useNavigate();
  const isDark   = useTheme();

  const [subs,      setSubs]      = useState([]);
  const [profiles,  setProfiles]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [refreshing,setRefreshing]= useState(false);
  const [selected,  setSelected]  = useState(null);  // detail modal
  const [actionLoading, setActionLoading] = useState(null);

  const mentorId = localStorage.getItem('ID') || localStorage.getItem('userId');
  const userName = localStorage.getItem('userName') || 'Mentor';

  // ── theme tokens ─────────────────────────────────────────────────────────
  const bg      = isDark ? '#080c14' : '#f0f4f8';
  const card    = isDark ? '#0d1628' : '#ffffff';
  const border  = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const textPri = isDark ? '#f1f5f9' : '#0a1628';
  const textSec = isDark ? '#64748b' : '#94a3b8';
  const textMid = isDark ? '#94a3b8' : '#475569';
  const divider = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const rowHov  = isDark ? 'rgba(14,165,233,0.04)' : 'rgba(14,165,233,0.03)';
  const thBg    = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)';
  const gridLine = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)';
  const axisColor = isDark ? '#475569' : '#94a3b8';
  const fieldBg = isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc';

  // ── fetch ────────────────────────────────────────────────────────────────
  const fetchAll = useCallback(async (silent = false) => {
    if (!silent) setLoading(true); else setRefreshing(true);
    try {
      const [subsRes, profRes] = await Promise.allSettled([
        api.post('/startupSubmission/getAllStartupSubmissions', { page: 1, limit: 100, sortBy: 'submissionDate', sortOrder: 'desc' }),
        api.get(`/startupProfile/getStartupProfilesByMentorId/${mentorId}`),
      ]);

      if (subsRes.status === 'fulfilled') {
        const d = subsRes.value?.data;
        const items = d?.data?.items || d?.items || d?.data || d || [];
        setSubs(Array.isArray(items) ? items : []);
      }
      if (profRes.status === 'fulfilled') {
        const d = profRes.value?.data;
        setProfiles(Array.isArray(d) ? d : []);
      }
    } catch (e) {
      toast('Failed to load data.', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [mentorId]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const updateStatus = async (id, status) => {
    setActionLoading(id);
    try {
      await api.put(`/startupSubmission/updateStartupSubmission/${id}`, { status });
      toast(`Submission ${status === 'ShortListed' ? 'approved' : 'rejected'} successfully.`, 'success');
      setSubs(prev => prev.map(s => s._id === id ? { ...s, status } : s));
      if (selected?._id === id) setSelected(prev => ({ ...prev, status }));
    } catch (e) {
      toast('Status update failed.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // ── computed stats ────────────────────────────────────────────────────────
  const stats = {
    total:      subs.length,
    approved:   subs.filter(s => s.status === 'ShortListed' || s.status === 'Approved').length,
    rejected:   subs.filter(s => s.status === 'Rejected').length,
    pending:    subs.filter(s => s.status === 'Pending' || !s.status).length,
    profiles:   profiles.length,
    totalFunding: subs.reduce((acc, s) => acc + (Number(s.expectedFunding) || 0), 0),
  };

  // ── bar chart data (by profile/category) ─────────────────────────────────
  const chartData = profiles.map(p => {
    const profileSubs = subs.filter(s => s.startupProfileId === p._id);
    return {
      name: p.category?.length > 10 ? p.category.slice(0, 10) + '…' : (p.category || 'N/A'),
      Pending:  profileSubs.filter(s => !s.status || s.status === 'Pending').length,
      Approved: profileSubs.filter(s => s.status === 'ShortListed' || s.status === 'Approved').length,
      Rejected: profileSubs.filter(s => s.status === 'Rejected').length,
    };
  }).filter(d => d.Pending + d.Approved + d.Rejected > 0);

  // ── weekly activity data (last 7 days) ───────────────────────────────────
  const weekData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const dayStr = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString('en-IN', { weekday: 'short' });
    return {
      name: label,
      Submissions: subs.filter(s => (s.submissionDate || '').slice(0, 10) === dayStr).length,
    };
  });

  const recentSubs = [...subs].slice(0, 8);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4"
      style={{ background: bg, fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        html,body,#root,*{scrollbar-width:none;-ms-overflow-style:none;}*::-webkit-scrollbar{display:none;width:0;}`}</style>
      <Loader2 className="animate-spin" size={32} style={{ color: '#0ea5e9' }} />
      <p className="text-[10px] font-black uppercase tracking-[.2em]" style={{ color: textSec }}>Loading Dashboard…</p>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        html,body,#root,*{scrollbar-width:none;-ms-overflow-style:none;}
        *::-webkit-scrollbar{display:none;width:0;height:0;}
      `}</style>

      <ToastContainer />
      <MentorNavbar />

      <div className="min-h-screen transition-colors duration-300" style={{ background: bg }}>

        {/* dot grid */}
        <div className="fixed top-[62px] left-0 right-0 bottom-0 pointer-events-none z-0"
          style={{ backgroundImage: `radial-gradient(circle, ${isDark ? 'rgba(14,165,233,0.07)' : 'rgba(14,165,233,0.12)'} 1px, transparent 1px)`, backgroundSize: '32px 32px' }} />

        <main className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16">

          {/* ── Header ──────────────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .4 }} className="flex items-start justify-between mb-8 gap-4 flex-wrap">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3"
                style={{ background: isDark ? 'rgba(14,165,233,0.10)' : 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.18)' }}>
                <Sparkles size={11} style={{ color: '#0ea5e9' }} />
                <span className="text-[10px] font-black uppercase tracking-[.18em] text-sky-400">Mentor Dashboard</span>
              </div>
              <h1 className="text-[2rem] font-black leading-none mb-1.5"
                style={{ color: textPri, letterSpacing: '-0.03em' }}>
                Welcome back, <span style={{ color: '#0ea5e9' }}>{userName}</span>
              </h1>
              <p className="text-[13px] font-medium" style={{ color: textSec }}>
                Here's what's happening across your startup profiles today.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: .96 }}
                onClick={() => fetchAll(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest"
                style={{ background: card, border: `1px solid ${border}`, color: textMid }}>
                <RefreshCw size={12} className={refreshing ? 'animate-spin' : ''} style={{ color: '#0ea5e9' }} />
                Refresh
              </motion.button>
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: .96 }}
                onClick={() => navigate('/mentor/create-profile')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white"
                style={{ background: 'linear-gradient(135deg,#0284c7,#0ea5e9)', boxShadow: '0 4px 16px rgba(14,165,233,0.35)' }}>
                <FilePlus2 size={13} /> New Profile
              </motion.button>
            </div>
          </motion.div>

          {/* ── Stat Cards ──────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
            {[
              { label: 'Total Submissions', value: stats.total,    icon: Rocket,       color: '#0ea5e9', bg: 'rgba(14,165,233,0.10)', path: '/mentor/submissions' },
              { label: 'Approved',          value: stats.approved, icon: CheckCircle2, color: '#10b981', bg: 'rgba(16,185,129,0.10)', path: '/mentor/submissions' },
              { label: 'Rejected',          value: stats.rejected, icon: XCircle,      color: '#f43f5e', bg: 'rgba(244,63,94,0.10)',  path: '/mentor/submissions' },
              { label: 'Pending Review',    value: stats.pending,  icon: Clock,        color: '#f59e0b', bg: 'rgba(245,158,11,0.10)', path: '/mentor/submissions' },
              { label: 'My Profiles',       value: stats.profiles, icon: Briefcase,    color: '#6366f1', bg: 'rgba(99,102,241,0.10)', path: '/mentor/profiles'    },
              { label: 'Total Funding Ask', value: `₹${(stats.totalFunding/100000).toFixed(1)}L`, icon: IndianRupee, color: '#10b981', bg: 'rgba(16,185,129,0.10)', path: '/mentor/submissions' },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: .06 * i }}>
                <StatCard {...s} isDark={isDark} onClick={() => navigate(s.path)} />
              </motion.div>
            ))}
          </div>

          {/* ── Charts Row ──────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">

            {/* Submissions by Profile */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2 }}
              className="rounded-2xl p-6"
              style={{ background: card, border: `1px solid ${border}`, boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.25)' : '0 4px 24px rgba(0,0,0,0.06)' }}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-[14px] font-black" style={{ color: textPri }}>Submissions by Profile</h2>
                  <p className="text-[10px] font-medium" style={{ color: textSec }}>Breakdown across your posted opportunities</p>
                </div>
                <div className="flex items-center gap-3">
                  {[{ label: 'Approved', color: '#10b981' }, { label: 'Pending', color: '#f59e0b' }, { label: 'Rejected', color: '#f43f5e' }].map(l => (
                    <div key={l.label} className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ background: l.color }} />
                      <span className="text-[9px] font-bold" style={{ color: textSec }}>{l.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={chartData} barCategoryGap="30%" barGap={3}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridLine} vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: axisColor, fontSize: 10, fontFamily: 'Plus Jakarta Sans', fontWeight: 700 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: axisColor, fontSize: 10, fontFamily: 'Plus Jakarta Sans', fontWeight: 700 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip isDark={isDark} />} cursor={{ fill: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }} />
                    <Bar dataKey="Approved" fill="#10b981" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="Pending"  fill="#f59e0b" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="Rejected" fill="#f43f5e" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[220px] flex items-center justify-center rounded-xl"
                  style={{ background: fieldBg }}>
                  <p className="text-[12px] font-medium" style={{ color: textSec }}>No chart data yet — add profiles & receive submissions</p>
                </div>
              )}
            </motion.div>

            {/* Weekly Activity */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .25 }}
              className="rounded-2xl p-6"
              style={{ background: card, border: `1px solid ${border}`, boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.25)' : '0 4px 24px rgba(0,0,0,0.06)' }}>
              <div className="mb-5">
                <h2 className="text-[14px] font-black" style={{ color: textPri }}>Weekly Activity</h2>
                <p className="text-[10px] font-medium" style={{ color: textSec }}>Submission volume over the last 7 days</p>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={weekData} barCategoryGap="40%">
                  <CartesianGrid strokeDasharray="3 3" stroke={gridLine} vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: axisColor, fontSize: 10, fontFamily: 'Plus Jakarta Sans', fontWeight: 700 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: axisColor, fontSize: 10, fontFamily: 'Plus Jakarta Sans', fontWeight: 700 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip isDark={isDark} />} cursor={{ fill: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }} />
                  <Bar dataKey="Submissions" radius={[6, 6, 0, 0]}>
                    {weekData.map((_, i) => (
                      <Cell key={i} fill={`rgba(14,165,233,${0.4 + (i / weekData.length) * 0.6})`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* ── Quick Actions ──────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .28 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Add New Profile',       desc: 'Post a new opportunity',       icon: FilePlus2,   path: '/mentor/create-profile', color: '#0ea5e9', bg: 'rgba(14,165,233,0.10)' },
              { label: 'View My Profiles',      desc: 'Manage posted opportunities',  icon: Briefcase,   path: '/mentor/profiles',       color: '#6366f1', bg: 'rgba(99,102,241,0.10)' },
              { label: 'Review Submissions',    desc: 'Approve or reject pitches',    icon: ListChecks,  path: '/mentor/submissions',    color: '#10b981', bg: 'rgba(16,185,129,0.10)' },
            ].map((a, i) => {
              const Icon = a.icon;
              return (
                <motion.button key={a.label} whileHover={{ y: -2 }} whileTap={{ scale: .97 }}
                  onClick={() => navigate(a.path)}
                  className="flex items-center gap-4 p-4 rounded-2xl text-left transition-all"
                  style={{ background: card, border: `1px solid ${border}` }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: a.bg }}>
                    <Icon size={18} style={{ color: a.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-black" style={{ color: textPri }}>{a.label}</p>
                    <p className="text-[10px] font-medium" style={{ color: textSec }}>{a.desc}</p>
                  </div>
                  <ChevronRight size={14} style={{ color: textSec }} />
                </motion.button>
              );
            })}
          </motion.div>

          {/* ── Recent Submissions Table ───────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .32 }}
            className="rounded-2xl overflow-hidden"
            style={{ background: card, border: `1px solid ${border}`, boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.25)' : '0 4px 24px rgba(0,0,0,0.06)' }}>

            <div className="px-6 py-4 flex items-center justify-between"
              style={{ borderBottom: `1px solid ${divider}` }}>
              <div>
                <h2 className="text-[14px] font-black" style={{ color: textPri }}>Recent Submissions</h2>
                <p className="text-[10px] font-medium" style={{ color: textSec }}>Latest pitches from entrepreneurs</p>
              </div>
              <button onClick={() => navigate('/mentor/submissions')}
                className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest"
                style={{ color: '#0ea5e9' }}>
                View All <ChevronRight size={12} />
              </button>
            </div>

            {recentSubs.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr style={{ background: thBg, borderBottom: `1px solid ${divider}` }}>
                    {['#', 'Entrepreneur', 'Location', 'Funding Ask', 'Market', 'Launch', 'Status', 'Action'].map(h => (
                      <th key={h} className="px-5 py-3.5 text-[9px] font-black uppercase tracking-[.15em] whitespace-nowrap"
                        style={{ color: textSec }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentSubs.map((s, idx) => (
                    <motion.tr key={s._id}
                      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      style={{ borderBottom: idx < recentSubs.length - 1 ? `1px solid ${divider}` : 'none' }}
                      onMouseEnter={e => e.currentTarget.style.background = rowHov}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>

                      <td className="px-5 py-3.5">
                        <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black"
                          style={{ background: 'rgba(14,165,233,0.10)', color: '#0ea5e9' }}>{idx + 1}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-black text-[11px]"
                            style={{ background: 'linear-gradient(135deg,#0284c7,#0ea5e9)' }}>
                            {(s.userName || 'U').charAt(0).toUpperCase()}
                          </div>
                          <span className="text-[12px] font-bold" style={{ color: textPri }}>{s.userName || '—'}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1">
                          <MapPin size={10} style={{ color: '#6366f1' }} />
                          <span className="text-[11px] font-medium truncate max-w-[100px]" style={{ color: textMid }}>{s.address || '—'}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1">
                          <IndianRupee size={10} style={{ color: '#10b981' }} />
                          <span className="text-[12px] font-black" style={{ color: textPri }}>
                            {Number(s.expectedFunding || 0).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full overflow-hidden"
                            style={{ background: isDark ? 'rgba(255,255,255,0.07)' : '#e2e8f0' }}>
                            <div className="h-full rounded-full"
                              style={{ width: `${Math.min(s.marketPotential || 0, 100)}%`, background: 'linear-gradient(90deg,#10b981,#34d399)' }} />
                          </div>
                          <span className="text-[10px] font-black" style={{ color: '#10b981' }}>{s.marketPotential ?? '—'}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1">
                          <CalendarDays size={10} style={{ color: '#f59e0b' }} />
                          <span className="text-[11px] font-bold" style={{ color: textPri }}>
                            {s.launchYear ? new Date(s.launchYear).getFullYear() : '—'}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5"><StatusBadge status={s.status || 'Pending'} /></td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: .94 }}
                            onClick={() => setSelected(s)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center"
                            style={{ background: 'rgba(14,165,233,0.10)', border: '1px solid rgba(14,165,233,0.18)' }}>
                            <Eye size={12} style={{ color: '#0ea5e9' }} />
                          </motion.button>
                          {(s.status !== 'ShortListed' && s.status !== 'Approved') && (
                            <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: .94 }}
                              disabled={actionLoading === s._id}
                              onClick={() => updateStatus(s._id, 'ShortListed')}
                              className="w-7 h-7 rounded-lg flex items-center justify-center disabled:opacity-50"
                              style={{ background: 'rgba(16,185,129,0.10)', border: '1px solid rgba(16,185,129,0.18)' }}>
                              {actionLoading === s._id ? <Loader2 size={11} className="animate-spin" style={{ color: '#10b981' }} /> : <CheckCircle2 size={11} style={{ color: '#10b981' }} />}
                            </motion.button>
                          )}
                          {s.status !== 'Rejected' && (
                            <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: .94 }}
                              disabled={actionLoading === s._id}
                              onClick={() => updateStatus(s._id, 'Rejected')}
                              className="w-7 h-7 rounded-lg flex items-center justify-center disabled:opacity-50"
                              style={{ background: 'rgba(244,63,94,0.10)', border: '1px solid rgba(244,63,94,0.18)' }}>
                              {actionLoading === s._id ? <Loader2 size={11} className="animate-spin" style={{ color: '#f43f5e' }} /> : <XCircle size={11} style={{ color: '#f43f5e' }} />}
                            </motion.button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: isDark ? 'rgba(14,165,233,0.08)' : 'rgba(14,165,233,0.06)' }}>
                  <Rocket size={24} style={{ color: isDark ? '#1e3a5f' : '#bfdbfe' }} />
                </div>
                <p className="text-[13px] font-bold mb-1" style={{ color: textPri }}>No submissions yet</p>
                <p className="text-[11px] font-medium" style={{ color: textSec }}>Entrepreneurs will appear here once they apply.</p>
              </div>
            )}
          </motion.div>
        </main>
      </div>

      {/* ── Detail Modal ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0" style={{ background: 'rgba(8,12,20,0.80)', backdropFilter: 'blur(10px)' }}
              onClick={() => setSelected(null)} />
            <motion.div initial={{ scale: .88, opacity: 0, y: 24 }} animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: .88, opacity: 0, y: 24 }} transition={{ duration: .3, ease: [.22, 1, .36, 1] }}
              className="relative w-full max-w-md rounded-3xl overflow-hidden"
              style={{ background: card, border: `1px solid ${border}`, boxShadow: isDark ? '0 32px 80px rgba(0,0,0,0.6)' : '0 32px 80px rgba(0,0,0,0.14)' }}>
              <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg,#0284c7,#0ea5e9,#38bdf8)' }} />
              <div className="px-6 py-5" style={{ borderBottom: `1px solid ${divider}` }}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black"
                      style={{ background: 'linear-gradient(135deg,#0284c7,#0ea5e9)' }}>
                      {(selected.userName || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-[15px] font-black" style={{ color: textPri }}>{selected.userName || 'Unknown'}</h3>
                      <p className="text-[10px] font-medium" style={{ color: textSec }}>ID: #{String(selected._id).slice(-8).toUpperCase()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={selected.status || 'Pending'} />
                    <button onClick={() => setSelected(null)}
                      className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{ background: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9' }}>
                      <X size={14} style={{ color: textSec }} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Market potential bar */}
              <div className="px-6 py-4" style={{ borderBottom: `1px solid ${divider}` }}>
                <div className="flex justify-between mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: textSec }}>Market Potential</span>
                  <span className="text-[11px] font-black" style={{ color: '#10b981' }}>{Math.min(selected.marketPotential || 0, 100)}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: isDark ? 'rgba(255,255,255,0.05)' : '#e2e8f0' }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(selected.marketPotential || 0, 100)}%` }}
                    transition={{ delay: .2, duration: .8 }}
                    className="h-full rounded-full" style={{ background: 'linear-gradient(90deg,#10b981,#34d399)' }} />
                </div>
              </div>

              <div className="px-6 py-5 grid grid-cols-2 gap-3">
                {[
                  { label: 'Funding Ask', value: `₹${Number(selected.expectedFunding || 0).toLocaleString('en-IN')}`, color: '#0ea5e9' },
                  { label: 'Est. Launch', value: selected.launchYear ? new Date(selected.launchYear).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' }) : '—', color: '#f59e0b' },
                  { label: 'Address', value: selected.address || '—', color: '#6366f1' },
                  { label: 'Submitted', value: selected.submissionDate ? new Date(selected.submissionDate).toLocaleDateString('en-IN') : '—', color: '#10b981' },
                ].map(f => (
                  <div key={f.label} className="rounded-2xl p-3.5" style={{ background: fieldBg, border: `1px solid ${divider}` }}>
                    <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: textSec }}>{f.label}</p>
                    <p className="text-[12px] font-black break-all" style={{ color: textPri }}>{f.value}</p>
                  </div>
                ))}
              </div>

              <div className="px-6 pb-6 flex gap-3">
                {(selected.status !== 'ShortListed' && selected.status !== 'Approved') && (
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: .97 }}
                    disabled={actionLoading === selected._id}
                    onClick={() => updateStatus(selected._id, 'ShortListed')}
                    className="flex-1 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg,#059669,#10b981)', boxShadow: '0 4px 14px rgba(16,185,129,0.35)' }}>
                    {actionLoading === selected._id ? <Loader2 size={13} className="animate-spin mx-auto" /> : '✓ Approve'}
                  </motion.button>
                )}
                {selected.status !== 'Rejected' && (
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: .97 }}
                    disabled={actionLoading === selected._id}
                    onClick={() => updateStatus(selected._id, 'Rejected')}
                    className="flex-1 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest disabled:opacity-50"
                    style={{ background: 'rgba(244,63,94,0.10)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.20)' }}>
                    ✕ Reject
                  </motion.button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}