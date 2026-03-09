/**
 * StartupSubmissions.jsx — StartupNest Mentor
 * Full redesign: matches platform theme, table layout, search/filter,
 * detail modal, confirm modal, dark/light sync, animated background.
 */

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, XCircle, Clock, Loader2, X, RefreshCw,
  Search, Eye, IndianRupee, MapPin, CalendarDays, TrendingUp,
  Rocket, AlertTriangle, ChevronDown, Filter, Sparkles,
  ListChecks, SlidersHorizontal
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
            exit={{ opacity: 0, x: 60, scale: .92 }}
            className="pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-2xl shadow-xl min-w-[260px]"
            style={{
              background: t.type === 'success' ? 'linear-gradient(135deg,#ecfdf5,#d1fae5)' : 'linear-gradient(135deg,#fff1f2,#ffe4e6)',
              border: `1px solid ${t.type === 'success' ? '#6ee7b7' : '#fca5a5'}`,
            }}>
            <span style={{ color: t.type === 'success' ? '#065f46' : '#991b1b' }}>{t.type === 'success' ? '✓' : '✕'}</span>
            <p className="flex-1 text-[12px] font-semibold leading-snug" style={{ color: t.type === 'success' ? '#065f46' : '#991b1b' }}>{t.message}</p>
            <button onClick={() => remove(t.id)} className="opacity-40"><X size={11} /></button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
function toast(msg, type = 'success', dur = 3500) {
  if (!_setToasts) return;
  const id = Date.now() + Math.random();
  _setToasts(p => [...p, { id, message: msg, type }]);
  setTimeout(() => _setToasts(p => p.filter(t => t.id !== id)), dur);
}

/* ─── Status config ─── */
const STATUS_CFG = {
  ShortListed: { color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.22)', label: 'Approved',  icon: CheckCircle2 },
  Approved:    { color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.22)', label: 'Approved',  icon: CheckCircle2 },
  Rejected:    { color: '#f43f5e', bg: 'rgba(244,63,94,0.12)',  border: 'rgba(244,63,94,0.22)',  label: 'Rejected',  icon: XCircle },
  Pending:     { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.22)', label: 'Pending',   icon: Clock },
};
function getStatus(s) {
  return STATUS_CFG[s] || { color: '#64748b', bg: 'rgba(100,116,139,0.10)', border: 'rgba(100,116,139,0.18)', label: s || 'Unknown', icon: Clock };
}

function StatusBadge({ status }) {
  const cfg = getStatus(status);
  const Icon = cfg.icon;
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest"
      style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color }}>
      <Icon size={9} /> {cfg.label}
    </span>
  );
}

/* ─── Custom Dropdown ─── */
function CustomDropdown({ value, onChange, options, placeholder, isDark }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const bg    = isDark ? '#0d1628' : '#ffffff';
  const bdr   = isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.09)';
  const txtPri = isDark ? '#f1f5f9' : '#0a1628';
  const txtSec = isDark ? '#64748b' : '#94a3b8';
  const hov   = isDark ? 'rgba(14,165,233,0.08)' : 'rgba(14,165,233,0.06)';
  const current = options.find(o => o.value === value);
  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 pl-3.5 pr-3 py-2.5 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap"
        style={{ background: bg, border: `1.5px solid ${open ? '#0ea5e9' : bdr}`, color: current ? txtPri : txtSec, minWidth: 130, boxShadow: open ? '0 0 0 3px rgba(14,165,233,0.12)' : 'none' }}>
        <span className="flex-1 text-left">{current?.label || placeholder}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: .2 }}>
          <ChevronDown size={12} style={{ color: '#64748b' }} />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -6, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: .97 }} transition={{ duration: .15 }}
            className="absolute top-[calc(100%+6px)] left-0 z-50 rounded-2xl overflow-hidden min-w-[150px]"
            style={{ background: bg, border: `1px solid ${bdr}`, boxShadow: isDark ? '0 16px 40px rgba(0,0,0,0.5)' : '0 16px 40px rgba(0,0,0,0.12)' }}>
            {options.map(o => (
              <button key={o.value} type="button"
                onClick={() => { onChange(o.value); setOpen(false); }}
                className="w-full px-4 py-2.5 text-left text-[11px] font-bold transition-colors"
                style={{ color: o.value === value ? '#0ea5e9' : txtPri, background: o.value === value ? 'rgba(14,165,233,0.08)' : 'transparent' }}
                onMouseEnter={e => { if (o.value !== value) e.currentTarget.style.background = hov; }}
                onMouseLeave={e => { if (o.value !== value) e.currentTarget.style.background = 'transparent'; }}>
                {o.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Confirm Modal ─── */
function ConfirmModal({ title, message, onConfirm, onCancel, danger }) {
  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0" style={{ background: 'rgba(8,12,20,0.82)', backdropFilter: 'blur(10px)' }}
        onClick={onCancel} />
      <motion.div initial={{ scale: .88, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: .88, opacity: 0 }} transition={{ duration: .25, ease: [.22, 1, .36, 1] }}
        className="relative w-full max-w-xs rounded-3xl p-7 text-center"
        style={{ background: '#0d1628', border: `1px solid ${danger ? 'rgba(244,63,94,0.25)' : 'rgba(14,165,233,0.20)'}`, boxShadow: '0 32px 80px rgba(0,0,0,0.55)' }}>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: danger ? 'rgba(244,63,94,0.10)' : 'rgba(14,165,233,0.10)' }}>
          {danger ? <AlertTriangle size={26} style={{ color: '#f43f5e' }} /> : <CheckCircle2 size={26} style={{ color: '#0ea5e9' }} />}
        </div>
        <h3 className="text-[16px] font-black mb-2 text-slate-100">{title}</h3>
        <p className="text-[12px] font-medium mb-6 leading-relaxed text-slate-400">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-400"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>Cancel</button>
          <button onClick={onConfirm}
            className="flex-1 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white"
            style={{ background: danger ? 'linear-gradient(135deg,#ef4444,#f43f5e)' : 'linear-gradient(135deg,#059669,#10b981)', boxShadow: danger ? '0 4px 16px rgba(244,63,94,0.35)' : '0 4px 16px rgba(16,185,129,0.35)' }}>
            {danger ? 'Reject' : 'Approve'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Detail Modal ─── */
function DetailModal({ sub, onClose, onUpdate, actionLoading, isDark }) {
  const card    = isDark ? '#0d1628' : '#ffffff';
  const border  = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)';
  const textPri = isDark ? '#f1f5f9' : '#0a1628';
  const textSec = isDark ? '#64748b' : '#94a3b8';
  const fieldBg = isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc';
  const divider = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const isApproved = sub.status === 'ShortListed' || sub.status === 'Approved';

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0" style={{ background: 'rgba(8,12,20,0.82)', backdropFilter: 'blur(10px)' }}
        onClick={onClose} />
      <motion.div initial={{ scale: .88, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: .88, opacity: 0, y: 20 }} transition={{ duration: .28, ease: [.22, 1, .36, 1] }}
        className="relative w-full max-w-md rounded-3xl overflow-hidden"
        style={{ background: card, border: `1px solid ${border}`, boxShadow: isDark ? '0 32px 80px rgba(0,0,0,0.60)' : '0 32px 80px rgba(0,0,0,0.14)' }}>
        <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg,#0284c7,#0ea5e9,#38bdf8)' }} />

        {/* Header */}
        <div className="px-6 py-5 flex items-start justify-between" style={{ borderBottom: `1px solid ${divider}` }}>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-black text-lg shrink-0"
              style={{ background: 'linear-gradient(135deg,#0284c7,#0ea5e9)' }}>
              {(sub.userName || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-[15px] font-black leading-tight" style={{ color: textPri }}>{sub.userName || 'Unknown'}</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <MapPin size={10} style={{ color: '#6366f1' }} />
                <span className="text-[10px] font-medium" style={{ color: textSec }}>{sub.address || 'No address'}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={sub.status || 'Pending'} />
            <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9', color: textSec }}>
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Market potential bar */}
        <div className="px-6 py-4" style={{ borderBottom: `1px solid ${divider}` }}>
          <div className="flex justify-between mb-2">
            <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: textSec }}>Market Potential</span>
            <span className="text-[11px] font-black" style={{ color: '#10b981' }}>{Math.min(sub.marketPotential || 0, 100)}%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: isDark ? 'rgba(255,255,255,0.05)' : '#e2e8f0' }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(sub.marketPotential || 0, 100)}%` }}
              transition={{ delay: .2, duration: .8, ease: 'easeOut' }}
              className="h-full rounded-full" style={{ background: 'linear-gradient(90deg,#10b981,#34d399)' }} />
          </div>
        </div>

        {/* Details grid */}
        <div className="px-6 py-5 grid grid-cols-2 gap-3">
          {[
            { label: 'Funding Ask',  value: `₹${Number(sub.expectedFunding || 0).toLocaleString('en-IN')}`, color: '#0ea5e9', icon: IndianRupee },
            { label: 'Market Score', value: `${sub.marketPotential ?? '—'}%`,        color: '#10b981', icon: TrendingUp   },
            { label: 'Launch Year',  value: sub.launchYear ? new Date(sub.launchYear).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' }) : '—', color: '#f59e0b', icon: CalendarDays },
            { label: 'Submitted',    value: sub.submissionDate ? new Date(sub.submissionDate).toLocaleDateString('en-IN') : '—', color: '#6366f1', icon: CalendarDays },
            { label: 'Address',      value: sub.address || '—', color: '#64748b', icon: MapPin },
            { label: 'Submission ID', value: `#${String(sub._id || '').slice(-8).toUpperCase()}`, color: '#64748b', icon: ListChecks },
          ].map(f => {
            const Icon = f.icon;
            return (
              <div key={f.label} className="rounded-2xl p-3.5" style={{ background: fieldBg, border: `1px solid ${divider}` }}>
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon size={9} style={{ color: f.color }} />
                  <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: textSec }}>{f.label}</p>
                </div>
                <p className="text-[12px] font-black break-all" style={{ color: textPri }}>{f.value}</p>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-3">
          {!isApproved && (
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: .97 }}
              disabled={!!actionLoading}
              onClick={() => onUpdate(sub._id, 'ShortListed')}
              className="flex-1 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg,#059669,#10b981)', boxShadow: '0 4px 16px rgba(16,185,129,0.35)' }}>
              {actionLoading === sub._id ? <Loader2 size={13} className="animate-spin mx-auto" /> : '✓ Approve'}
            </motion.button>
          )}
          {sub.status !== 'Rejected' && (
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: .97 }}
              disabled={!!actionLoading}
              onClick={() => onUpdate(sub._id, 'Rejected')}
              className="flex-1 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest disabled:opacity-50"
              style={{ background: 'rgba(244,63,94,0.10)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.20)' }}>
              ✕ Reject
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   MAIN
════════════════════════════════════════════════════════════ */
const PER_PAGE = 8;
const FILTER_OPTIONS = [
  { value: 'All',         label: 'All Status' },
  { value: 'Pending',     label: 'Pending'    },
  { value: 'ShortListed', label: 'Approved'   },
  { value: 'Rejected',    label: 'Rejected'   },
];
const SORT_OPTIONS = [
  { value: 'newest',   label: 'Newest First'     },
  { value: 'oldest',   label: 'Oldest First'     },
  { value: 'funding',  label: 'Funding (High)'   },
  { value: 'market',   label: 'Market (High)'    },
];

export default function StartupSubmissions() {
  const isDark = useTheme();
  const [subs,          setSubs]          = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [refreshing,    setRefreshing]    = useState(false);
  const [error,         setError]         = useState('');
  const [search,        setSearch]        = useState('');
  const [rawSearch,     setRawSearch]     = useState('');
  const [statusFilter,  setStatusFilter]  = useState('All');
  const [sortBy,        setSortBy]        = useState('newest');
  const [page,          setPage]          = useState(1);
  const [actionLoading, setActionLoading] = useState(null);
  const [selected,      setSelected]      = useState(null);
  const [confirmModal,  setConfirmModal]  = useState(null);
  const debounceRef = useRef(null);

  // ── tokens ────────────────────────────────────────────────────────────────
  const bg      = isDark ? '#080c14' : '#f0f4f8';
  const card    = isDark ? '#0d1628' : '#ffffff';
  const border  = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const textPri = isDark ? '#f1f5f9' : '#0a1628';
  const textSec = isDark ? '#64748b' : '#94a3b8';
  const textMid = isDark ? '#94a3b8' : '#475569';
  const divider = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const thBg    = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)';
  const rowHov  = isDark ? 'rgba(14,165,233,0.04)' : 'rgba(14,165,233,0.03)';
  const inputBg = isDark ? 'rgba(255,255,255,0.04)' : '#ffffff';
  const inputBdr = isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.09)';

  const load = useCallback(async (silent = false) => {
    if (!silent) { setLoading(true); setError(''); }
    else setRefreshing(true);
    try {
      const res = await api.post('/startupSubmission/getAllStartupSubmissions',
        { page: 1, limit: 200, sortBy: 'submissionDate', sortOrder: 'desc' });
      const items = res?.data?.data?.items || res?.data?.items || res?.data?.data || res?.data || [];
      setSubs(Array.isArray(items) ? items : []);
    } catch (e) {
      console.error(e);
      setSubs([]);
      if (!silent) setError('Failed to load submissions. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSearch = val => {
    setRawSearch(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { setSearch(val); setPage(1); }, 300);
  };

  const updateStatus = async (id, status) => {
    setActionLoading(id);
    setConfirmModal(null);
    try {
      await api.put(`/startupSubmission/updateStartupSubmission/${id}`, { status });
      toast(`Submission ${status === 'ShortListed' ? 'approved' : 'rejected'} successfully.`, 'success');
      setSubs(prev => prev.map(s => s._id === id ? { ...s, status } : s));
      if (selected?._id === id) setSelected(prev => ({ ...prev, status }));
    } catch (e) {
      toast('Status update failed. Please try again.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const confirmUpdate = (id, status, userName) => {
    const isDanger = status === 'Rejected';
    setConfirmModal({
      id, status,
      title: isDanger ? 'Reject Submission?' : 'Approve Submission?',
      message: isDanger
        ? `This will deny ${userName || 'this submission'}. You can re-approve later.`
        : `Approve ${userName || 'this submission'} as a ShortListed startup?`,
      danger: isDanger,
    });
  };

  // ── filter + sort + paginate ──────────────────────────────────────────────
  const filtered = subs
    .filter(s => {
      if (statusFilter !== 'All') {
        if (statusFilter === 'ShortListed') return s.status === 'ShortListed' || s.status === 'Approved';
        return s.status === statusFilter;
      }
      return true;
    })
    .filter(s => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (s.userName || '').toLowerCase().includes(q) ||
             (s.address  || '').toLowerCase().includes(q) ||
             (s.status   || '').toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (sortBy === 'oldest')  return new Date(a.submissionDate) - new Date(b.submissionDate);
      if (sortBy === 'funding') return (Number(b.expectedFunding) || 0) - (Number(a.expectedFunding) || 0);
      if (sortBy === 'market')  return (Number(b.marketPotential) || 0) - (Number(a.marketPotential) || 0);
      return new Date(b.submissionDate) - new Date(a.submissionDate);
    });

  const totalPages  = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated   = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const hasFilters  = statusFilter !== 'All' || !!search;

  const stats = {
    total:    subs.length,
    approved: subs.filter(s => s.status === 'ShortListed' || s.status === 'Approved').length,
    pending:  subs.filter(s => !s.status || s.status === 'Pending').length,
    rejected: subs.filter(s => s.status === 'Rejected').length,
  };

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        html,body,#root,*{scrollbar-width:none;-ms-overflow-style:none;}
        *::-webkit-scrollbar{display:none;width:0;height:0;}
        .msub-input::placeholder{color:${isDark ? '#334155' : '#94a3b8'}!important;}
        .msub-input:focus{border-color:#0ea5e9!important;box-shadow:0 0 0 3px rgba(14,165,233,0.13)!important;}
      `}</style>

      <ToastContainer />
      <MentorNavbar />

      <div className="min-h-screen transition-colors duration-300" style={{ background: bg }}>
        {/* dot grid */}
        <div className="fixed top-[62px] left-0 right-0 bottom-0 pointer-events-none z-0"
          style={{ backgroundImage: `radial-gradient(circle, ${isDark ? 'rgba(14,165,233,0.07)' : 'rgba(14,165,233,0.11)'} 1px, transparent 1px)`, backgroundSize: '32px 32px' }} />

        <main className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16">

          {/* ── Header ──────────────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .4 }} className="mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-3"
              style={{ background: isDark ? 'rgba(14,165,233,0.10)' : 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.20)' }}>
              <Sparkles size={11} style={{ color: '#0ea5e9' }} />
              <span className="text-[10px] font-black uppercase tracking-[.18em]" style={{ color: '#0ea5e9' }}>Mentor Portal</span>
            </div>
            <div className="flex items-end justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-[2.2rem] font-black leading-none mb-1.5"
                  style={{ color: textPri, letterSpacing: '-0.03em' }}>
                  Startup{' '}
                  <span style={{ background: 'linear-gradient(135deg,#0ea5e9,#38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Submissions
                  </span>
                </h1>
                <p className="text-[13px] font-medium" style={{ color: textSec }}>
                  Review submitted ideas and update their status.
                </p>
              </div>
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: .96 }}
                onClick={() => load(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest"
                style={{ background: card, border: `1px solid ${border}`, color: textMid }}>
                <RefreshCw size={12} className={refreshing ? 'animate-spin' : ''} style={{ color: '#0ea5e9' }} />
                Refresh
              </motion.button>
            </div>
          </motion.div>

          {/* ── Stat chips ──────────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08 }}
            className="flex flex-wrap gap-3 mb-6">
            {[
              { label: 'Total',    value: stats.total,    color: '#0ea5e9', bg: 'rgba(14,165,233,0.10)',  bdr: 'rgba(14,165,233,0.20)' },
              { label: 'Approved', value: stats.approved, color: '#10b981', bg: 'rgba(16,185,129,0.10)',  bdr: 'rgba(16,185,129,0.20)' },
              { label: 'Pending',  value: stats.pending,  color: '#f59e0b', bg: 'rgba(245,158,11,0.10)',  bdr: 'rgba(245,158,11,0.20)' },
              { label: 'Rejected', value: stats.rejected, color: '#f43f5e', bg: 'rgba(244,63,94,0.10)',   bdr: 'rgba(244,63,94,0.20)'  },
            ].map(s => (
              <motion.div key={s.label} whileHover={{ y: -1 }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl cursor-pointer"
                style={{ background: s.bg, border: `1px solid ${s.bdr}` }}
                onClick={() => { setStatusFilter(s.label === 'Total' ? 'All' : s.label === 'Approved' ? 'ShortListed' : s.label); setPage(1); }}>
                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: s.color }}>{s.label}</span>
                <span className="text-[16px] font-black leading-none" style={{ color: s.color }}>{s.value}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* ── Search + Filters ────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .12 }}
            className="flex flex-wrap items-center gap-3 mb-6">
            {/* search */}
            <div className="relative flex-1 min-w-[220px]">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: textSec }} />
              {rawSearch && (
                <button onClick={() => { setRawSearch(''); setSearch(''); setPage(1); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: textSec }}>
                  <X size={13} />
                </button>
              )}
              <input value={rawSearch} onChange={e => handleSearch(e.target.value)}
                placeholder="Search by name, location or status…"
                className="msub-input w-full pl-10 pr-9 py-2.5 rounded-2xl text-[12px] font-medium outline-none transition-all"
                style={{ background: inputBg, border: `1.5px solid ${rawSearch ? '#0ea5e9' : inputBdr}`, color: textPri, boxShadow: rawSearch ? '0 0 0 3px rgba(14,165,233,0.12)' : 'none' }} />
            </div>

            <div className="flex items-center gap-1.5" style={{ color: textSec }}>
              <Filter size={13} />
              <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Filter:</span>
            </div>
            <CustomDropdown value={statusFilter} onChange={v => { setStatusFilter(v); setPage(1); }}
              options={FILTER_OPTIONS} placeholder="All Status" isDark={isDark} />

            <div className="flex items-center gap-1.5" style={{ color: textSec }}>
              <SlidersHorizontal size={13} />
              <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Sort:</span>
            </div>
            <CustomDropdown value={sortBy} onChange={v => { setSortBy(v); setPage(1); }}
              options={SORT_OPTIONS} placeholder="Sort by" isDark={isDark} />

            {hasFilters && (
              <motion.button initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }}
                whileTap={{ scale: .94 }}
                onClick={() => { setRawSearch(''); setSearch(''); setStatusFilter('All'); setPage(1); }}
                className="px-3.5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest"
                style={{ background: 'rgba(244,63,94,0.10)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.20)' }}>
                <X size={11} className="inline mr-1" /> Clear
              </motion.button>
            )}
          </motion.div>

          {/* ── Content ─────────────────────────────────────────────────── */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4 rounded-2xl"
              style={{ background: card, border: `1px solid ${border}` }}>
              <Loader2 className="animate-spin" size={32} style={{ color: '#0ea5e9' }} />
              <p className="text-[10px] font-black uppercase tracking-[.2em]" style={{ color: textSec }}>Loading Submissions…</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-24 rounded-2xl gap-4"
              style={{ background: card, border: `1px solid rgba(244,63,94,0.20)` }}>
              <AlertTriangle size={32} style={{ color: '#f43f5e' }} />
              <p className="text-[13px] font-bold" style={{ color: textPri }}>{error}</p>
              <button onClick={() => load()} className="px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest text-white"
                style={{ background: 'linear-gradient(135deg,#0284c7,#0ea5e9)' }}>Try Again</button>
            </div>
          ) : paginated.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-24 rounded-2xl"
              style={{ background: card, border: `1px solid ${border}` }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: isDark ? 'rgba(14,165,233,0.08)' : 'rgba(14,165,233,0.06)' }}>
                <Rocket size={28} style={{ color: isDark ? '#1e3a5f' : '#bfdbfe' }} />
              </div>
              <p className="text-[14px] font-bold mb-1.5" style={{ color: textPri }}>
                {hasFilters ? 'No matching submissions' : 'No submissions yet'}
              </p>
              <p className="text-[12px] font-medium mb-5" style={{ color: textSec }}>
                {hasFilters ? 'Try adjusting your search or filters.' : 'Entrepreneurs will appear here once they apply.'}
              </p>
              {hasFilters && (
                <button onClick={() => { setRawSearch(''); setSearch(''); setStatusFilter('All'); setPage(1); }}
                  className="px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest text-white"
                  style={{ background: 'linear-gradient(135deg,#0284c7,#0ea5e9)' }}>Clear Filters</button>
              )}
            </motion.div>
          ) : (
            <>
              {/* Table */}
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1 }}
                className="rounded-2xl overflow-hidden mb-5"
                style={{ background: card, border: `1px solid ${border}`, boxShadow: isDark ? '0 4px 32px rgba(0,0,0,0.28)' : '0 4px 32px rgba(0,0,0,0.06)' }}>

                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr style={{ background: thBg, borderBottom: `1px solid ${divider}` }}>
                      {['#', 'Entrepreneur', 'Location', 'Funding Ask', 'Market', 'Launch', 'Submitted', 'Status', 'Actions'].map(h => (
                        <th key={h} className="px-5 py-4 text-[9px] font-black uppercase tracking-[.15em] whitespace-nowrap"
                          style={{ color: textSec }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {paginated.map((s, idx) => {
                        const isApproved  = s.status === 'ShortListed' || s.status === 'Approved';
                        const isRejected  = s.status === 'Rejected';
                        const globalIdx   = (page - 1) * PER_PAGE + idx + 1;
                        return (
                          <motion.tr key={s._id}
                            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.04 }}
                            style={{ borderBottom: idx < paginated.length - 1 ? `1px solid ${divider}` : 'none' }}
                            onMouseEnter={e => e.currentTarget.style.background = rowHov}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>

                            <td className="px-5 py-4">
                              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black"
                                style={{ background: 'rgba(14,165,233,0.10)', color: '#0ea5e9' }}>{globalIdx}</div>
                            </td>

                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-[13px] shrink-0"
                                  style={{ background: 'linear-gradient(135deg,#0284c7,#0ea5e9)' }}>
                                  {(s.userName || 'U').charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="text-[12px] font-black leading-tight" style={{ color: textPri }}>{s.userName || '—'}</p>
                                  <p className="text-[9px] font-medium" style={{ color: textSec }}>
                                    {String(s._id || '').slice(-6).toUpperCase()}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-5 py-4">
                              <div className="flex items-center gap-1.5">
                                <MapPin size={10} style={{ color: '#6366f1' }} />
                                <span className="text-[11px] font-medium truncate max-w-[90px]" style={{ color: textMid }}>{s.address || '—'}</span>
                              </div>
                            </td>

                            <td className="px-5 py-4">
                              <div className="flex items-center gap-1">
                                <IndianRupee size={10} style={{ color: '#10b981' }} />
                                <span className="text-[12px] font-black" style={{ color: textPri }}>
                                  {Number(s.expectedFunding || 0).toLocaleString('en-IN')}
                                </span>
                              </div>
                            </td>

                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2">
                                <div className="w-14 h-1.5 rounded-full overflow-hidden"
                                  style={{ background: isDark ? 'rgba(255,255,255,0.07)' : '#e2e8f0' }}>
                                  <div className="h-full rounded-full"
                                    style={{ width: `${Math.min(s.marketPotential || 0, 100)}%`, background: 'linear-gradient(90deg,#10b981,#34d399)' }} />
                                </div>
                                <span className="text-[10px] font-black" style={{ color: '#10b981' }}>
                                  {s.marketPotential ?? '—'}%
                                </span>
                              </div>
                            </td>

                            <td className="px-5 py-4">
                              <div className="flex items-center gap-1">
                                <CalendarDays size={10} style={{ color: '#f59e0b' }} />
                                <span className="text-[11px] font-bold" style={{ color: textPri }}>
                                  {s.launchYear ? new Date(s.launchYear).getFullYear() : '—'}
                                </span>
                              </div>
                            </td>

                            <td className="px-5 py-4">
                              <span className="text-[11px] font-bold" style={{ color: textSec }}>
                                {s.submissionDate ? new Date(s.submissionDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}
                              </span>
                            </td>

                            <td className="px-5 py-4"><StatusBadge status={s.status || 'Pending'} /></td>

                            <td className="px-5 py-4">
                              <div className="flex items-center gap-1.5">
                                {/* View */}
                                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: .92 }}
                                  onClick={() => setSelected(s)}
                                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                                  style={{ background: 'rgba(14,165,233,0.10)', border: '1px solid rgba(14,165,233,0.18)' }}>
                                  <Eye size={11} style={{ color: '#0ea5e9' }} />
                                </motion.button>
                                {/* Approve */}
                                {!isApproved && (
                                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: .92 }}
                                    disabled={actionLoading === s._id}
                                    onClick={() => confirmUpdate(s._id, 'ShortListed', s.userName)}
                                    className="w-7 h-7 rounded-lg flex items-center justify-center disabled:opacity-50"
                                    style={{ background: 'rgba(16,185,129,0.10)', border: '1px solid rgba(16,185,129,0.18)' }}>
                                    {actionLoading === s._id
                                      ? <Loader2 size={11} className="animate-spin" style={{ color: '#10b981' }} />
                                      : <CheckCircle2 size={11} style={{ color: '#10b981' }} />}
                                  </motion.button>
                                )}
                                {/* Reject */}
                                {!isRejected && (
                                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: .92 }}
                                    disabled={actionLoading === s._id}
                                    onClick={() => confirmUpdate(s._id, 'Rejected', s.userName)}
                                    className="w-7 h-7 rounded-lg flex items-center justify-center disabled:opacity-50"
                                    style={{ background: 'rgba(244,63,94,0.10)', border: '1px solid rgba(244,63,94,0.18)' }}>
                                    {actionLoading === s._id
                                      ? <Loader2 size={11} className="animate-spin" style={{ color: '#f43f5e' }} />
                                      : <XCircle size={11} style={{ color: '#f43f5e' }} />}
                                  </motion.button>
                                )}
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  </tbody>
                </table>
              </motion.div>

              {/* ── Pagination ──────────────────────────────────────────── */}
              {totalPages > 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .2 }}
                  className="flex items-center justify-between flex-wrap gap-3">
                  <p className="text-[11px] font-medium" style={{ color: textSec }}>
                    Showing <span style={{ color: textPri, fontWeight: 800 }}>
                      {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)}
                    </span> of <span style={{ color: textPri, fontWeight: 800 }}>{filtered.length}</span> results
                  </p>
                  <div className="flex items-center gap-2">
                    <button disabled={page === 1}
                      onClick={() => setPage(p => p - 1)}
                      className="px-3.5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest disabled:opacity-40 transition-all"
                      style={{ background: card, border: `1px solid ${border}`, color: textMid }}>← Prev</button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pg => (
                      <button key={pg} onClick={() => setPage(pg)}
                        className="w-9 h-9 rounded-xl text-[11px] font-black transition-all"
                        style={{
                          background: pg === page ? 'linear-gradient(135deg,#0284c7,#0ea5e9)' : card,
                          border: `1px solid ${pg === page ? '#0ea5e9' : border}`,
                          color: pg === page ? '#ffffff' : textMid,
                          boxShadow: pg === page ? '0 4px 12px rgba(14,165,233,0.35)' : 'none',
                        }}>{pg}</button>
                    ))}
                    <button disabled={page === totalPages}
                      onClick={() => setPage(p => p + 1)}
                      className="px-3.5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest disabled:opacity-40 transition-all"
                      style={{ background: card, border: `1px solid ${border}`, color: textMid }}>Next →</button>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </main>
      </div>

      {/* ── Detail Modal ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selected && (
          <DetailModal sub={selected} onClose={() => setSelected(null)}
            onUpdate={(id, status) => confirmUpdate(id, status, selected.userName)}
            actionLoading={actionLoading} isDark={isDark} />
        )}
      </AnimatePresence>

      {/* ── Confirm Modal ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {confirmModal && (
          <ConfirmModal
            title={confirmModal.title} message={confirmModal.message} danger={confirmModal.danger}
            onConfirm={() => updateStatus(confirmModal.id, confirmModal.status)}
            onCancel={() => setConfirmModal(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}