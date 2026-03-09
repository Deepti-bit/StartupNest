import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Rocket, Trash2, Search, MapPin, CalendarDays, IndianRupee,
  TrendingUp, X, Loader2, FileCheck, XCircle, Clock, CheckCircle2,
  ChevronDown, ChevronLeft, ChevronRight, Eye, SlidersHorizontal,
  AlertTriangle, ArrowUpDown, Building2, Tag
} from 'lucide-react';
import EntrepreneurNavbar from './EntrepreneurNavbar';
import api from '../Services/api';

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

let _setToasts = null;
function ToastContainer() {
  const [toasts, setToasts] = useState([]);
  _setToasts = setToasts;
  const remove = (id) => setToasts(p => p.filter(t => t.id !== id));
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
            <span style={{ color: t.type === 'success' ? '#065f46' : '#991b1b', fontSize: 14 }}>
              {t.type === 'success' ? '✓' : '✕'}
            </span>
            <p className="flex-1 text-[12px] font-semibold" style={{ color: t.type === 'success' ? '#065f46' : '#991b1b' }}>
              {t.message}
            </p>
            <button onClick={() => remove(t.id)} className="opacity-40 hover:opacity-80 mt-0.5"><X size={11} /></button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}


function toast(message, type = 'error', duration = 3500) {
  if (!_setToasts) return;
  const id = Date.now() + Math.random();
  _setToasts(p => [...p, { id, message, type }]);
  setTimeout(() => _setToasts(p => p.filter(t => t.id !== id)), duration);
}

const STATUS = {
  Pending: { label: 'Pending', icon: Clock, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.22)' },
  ShortListed: { label: 'ShortListed', icon: CheckCircle2, color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.22)' },
  Rejected: { label: 'Rejected', icon: XCircle, color: '#f43f5e', bg: 'rgba(244,63,94,0.12)', border: 'rgba(244,63,94,0.22)' },
};

function StatusBadge({ status }) {
  const cfg = STATUS[status] || STATUS.Pending;
  const Icon = cfg.icon;
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full w-fit"
      style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
      <Icon size={10} style={{ color: cfg.color }} />
      <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: cfg.color }}>{cfg.label}</span>
    </div>
  );
}

const handleViewPdf = (base64String) => {
  try {
    const base64Parts = base64String.split(',');
    const base64Data = base64Parts[1];

    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    const blob = new Blob([byteArray], { type: 'application/pdf' });

    const fileURL = URL.createObjectURL(blob);
    window.open(fileURL, '_blank');
  } catch (error) {
    console.error("Error opening PDF:", error);
    alert("Could not open PDF. The file might be corrupted.");
  }
};

function Dropdown({ value, onChange, options, label, icon: Icon, isDark, textSec, inputBg, inputBdr }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const active = value !== options[0].value;
  const textPri = isDark ? '#f1f5f9' : '#0a1628';
  const dropBg = isDark ? '#0d1628' : '#ffffff';
  const dropBdr = isDark ? 'rgba(14,165,233,0.15)' : 'rgba(0,0,0,0.10)';
  const hoverBg = isDark ? 'rgba(14,165,233,0.08)' : 'rgba(14,165,233,0.06)';
  const selectedBg = isDark ? 'rgba(14,165,233,0.15)' : 'rgba(14,165,233,0.10)';
  const selected = options.find(o => o.value === value) || options[0];

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3.5 py-3 rounded-2xl text-[11px] font-bold outline-none transition-all duration-200 whitespace-nowrap"
        style={{
          background: inputBg, border: `1.5px solid ${active || open ? '#0ea5e9' : inputBdr}`,
          color: active ? '#0ea5e9' : textSec,
          boxShadow: (active || open) ? '0 0 0 3px rgba(14,165,233,0.12)' : 'none',
        }}>
        {Icon && <Icon size={12} style={{ color: active ? '#0ea5e9' : textSec }} />}
        <span>{selected.label}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: .2 }}>
          <ChevronDown size={12} style={{ color: textSec }} />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -6, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: .97 }} transition={{ duration: .16 }}
            className="absolute top-[calc(100%+6px)] left-0 min-w-[160px] rounded-2xl overflow-hidden z-50"
            style={{ background: dropBg, border: `1px solid ${dropBdr}`, boxShadow: isDark ? '0 16px 48px rgba(0,0,0,0.5)' : '0 16px 48px rgba(0,0,0,0.12)' }}>
            {options.map(opt => {
              const sel = value === opt.value;
              return (
                <button key={opt.value} onClick={() => { onChange(opt.value); setOpen(false); }}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-[11px] font-bold text-left transition-all"
                  style={{ background: sel ? selectedBg : 'transparent', color: sel ? '#0ea5e9' : textPri }}
                  onMouseEnter={e => { if (!sel) e.currentTarget.style.background = hoverBg; }}
                  onMouseLeave={e => { if (!sel) e.currentTarget.style.background = 'transparent'; }}>
                  <span>{opt.label}</span>
                  {sel && <CheckCircle2 size={11} style={{ color: '#0ea5e9' }} />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DetailModal({ sub, onClose, isDark }) {
  if (!sub) return null;
  const card = isDark ? '#0d1628' : '#ffffff';
  const textPri = isDark ? '#f1f5f9' : '#0a1628';
  const textSec = isDark ? '#64748b' : '#94a3b8';
  const divider = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const fieldBg = isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc';
  const cfg = STATUS[sub.status] || STATUS.Pending;

  const fields = [
    { label: 'Market Potential', value: `${sub.marketPotential ?? '—'}%`, icon: TrendingUp, accent: '#10b981' },
    { label: 'Expected Funding', value: `₹${Number(sub.expectedFunding || 0).toLocaleString('en-IN')}`, icon: IndianRupee, accent: '#0ea5e9' },
    { label: 'Est. Launch', value: sub.launchYear ? new Date(sub.launchYear).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) : '—', icon: CalendarDays, accent: '#f59e0b' },
    { label: 'Business Address', value: sub.address || '—', icon: MapPin, accent: '#6366f1' },
    { label: 'Startup Profile', value: sub.startupProfileId || '—', icon: Tag, accent: '#0ea5e9' },
    { label: 'Submitted By', value: sub.userName || '—', icon: Building2, accent: '#10b981' },
  ];

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0" style={{ background: 'rgba(8,12,20,0.80)', backdropFilter: 'blur(10px)' }}
        onClick={onClose} />

      <motion.div initial={{ scale: .88, opacity: 0, y: 24 }} animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: .88, opacity: 0, y: 24 }} transition={{ duration: .3, ease: [.22, 1, .36, 1] }}
        className="relative w-full max-w-lg rounded-3xl overflow-hidden"
        style={{ background: card, border: `1px solid ${divider}`, boxShadow: isDark ? '0 32px 80px rgba(0,0,0,0.6)' : '0 32px 80px rgba(0,0,0,0.14)' }}>

        {/* top bar */}
        <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg,${cfg.color},${cfg.color}88)` }} />

        {/* header */}
        <div className="px-6 py-5 flex items-start justify-between"
          style={{ borderBottom: `1px solid ${divider}` }}>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(14,165,233,0.12)' }}>
                <Rocket size={14} style={{ color: '#0ea5e9' }} />
              </div>
              <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: textSec }}>
                Submission Details
              </span>
            </div>
            <h2 className="text-[1.25rem] font-black" style={{ color: textPri, letterSpacing: '-0.02em' }}>
              Startup Proposal
            </h2>
            <p className="text-[10px] font-medium mt-0.5" style={{ color: textSec }}>
              ID: #{String(sub._id).slice(-8).toUpperCase()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={sub.status} />
            <button onClick={onClose}
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
              style={{ background: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(244,63,94,0.12)'}
              onMouseLeave={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9'}>
              <X size={14} style={{ color: textSec }} />
            </button>
          </div>
        </div>

        {/* market potential bar */}
        <div className="px-6 py-4" style={{ borderBottom: `1px solid ${divider}` }}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: textSec }}>
              Market Potential
            </span>
            <span className="text-[12px] font-black" style={{ color: '#10b981' }}>
              {Math.min(sub.marketPotential || 0, 100)}%
            </span>
          </div>
          <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: isDark ? 'rgba(255,255,255,0.05)' : '#e2e8f0' }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(sub.marketPotential || 0, 100)}%` }}
              transition={{ delay: .2, duration: .8, ease: [.22, 1, .36, 1] }}
              className="h-full rounded-full" style={{ background: 'linear-gradient(90deg,#10b981,#34d399)' }} />
          </div>
        </div>

        {/* fields grid */}
        <div className="px-6 py-5 grid grid-cols-2 gap-3">
          {fields.map(f => {
            const Icon = f.icon;
            return (
              <div key={f.label} className="rounded-2xl p-3.5" style={{ background: fieldBg, border: `1px solid ${divider}` }}>
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon size={10} style={{ color: f.accent }} />
                  <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: textSec }}>{f.label}</span>
                </div>
                <p className="text-[12px] font-black leading-snug break-all" style={{ color: textPri }}>{f.value}</p>
              </div>
            );
          })}
        </div>

        {/* pitch deck link */}
        {sub.pitchDeckFile && (
          <div className="px-6 pb-5">
            <button
              onClick={() => handleViewPdf(sub.pitchDeckFile)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white transition-all cursor-pointer"
              style={{ background: 'linear-gradient(135deg,#0284c7,#0ea5e9)', boxShadow: '0 4px 16px rgba(14,165,233,0.30)' }}>
              <FileCheck size={13} /> View Pitch Deck
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

/* ─── Delete Confirm Modal ─── */
function DeleteModal({ onConfirm, onCancel, isDark }) {
  const card = isDark ? '#0d1628' : '#ffffff';
  const textPri = isDark ? '#f1f5f9' : '#0a1628';
  const textSec = isDark ? '#64748b' : '#94a3b8';
  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0" style={{ background: 'rgba(8,12,20,0.80)', backdropFilter: 'blur(10px)' }}
        onClick={onCancel} />
      <motion.div initial={{ scale: .88, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: .88, opacity: 0 }} transition={{ duration: .25, ease: [.22, 1, .36, 1] }}
        className="relative w-full max-w-xs rounded-3xl p-7 text-center"
        style={{ background: card, border: '1px solid rgba(244,63,94,0.20)', boxShadow: '0 32px 80px rgba(0,0,0,0.4)' }}>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: 'rgba(244,63,94,0.10)', border: '2px solid rgba(244,63,94,0.20)' }}>
          <AlertTriangle size={26} style={{ color: '#f43f5e' }} />
        </div>
        <h3 className="text-[16px] font-black mb-2" style={{ color: textPri }}>Retract Submission?</h3>
        <p className="text-[12px] font-medium mb-6 leading-relaxed" style={{ color: textSec }}>
          This will permanently delete your submission. This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all"
            style={{ background: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9', color: textSec }}>
            Cancel
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white transition-all"
            style={{ background: 'linear-gradient(135deg,#ef4444,#f43f5e)', boxShadow: '0 4px 16px rgba(244,63,94,0.35)' }}>
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
}

const PAGE_SIZE = 6;

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'funding-high', label: 'Funding ↑ High' },
  { value: 'funding-low', label: 'Funding ↓ Low' },
  { value: 'potential', label: 'Market Potential' },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'Pending', label: 'Pending' },
  { value: 'ShortListed', label: 'ShortListed' },
  { value: 'Rejected', label: 'Rejected' },
];


const MySubmissions = () => {
  const isDark = useTheme();

  const [submissions, setSubmissions] = useState([]);
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const [totalPages,setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true);
  const [rawSearch, setRawSearch] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);

  const userId = localStorage.getItem('userId');

  const debounceRef = useRef(null);
  const handleSearchChange = (val) => {
    setRawSearch(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { setSearch(val); setPage(1); }, 350);
  };

  const fetchSubmissions = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const res = await api.get(`/startupSubmission/getSubmissionsByUserId/${userId}`, {
        params: {
          page,
          limit: PAGE_SIZE,
          search, 
          status: statusFilter,
          sortBy
        }
      });
      
      setSubmissions(res.data.data);
      setTotalSubmissions(res.data.total);
      setTotalPages(res.data.totalPages);
    } catch {
      toast('Failed to load submissions.', 'error');
    } finally {
      setLoading(false);
    }
  }, [userId, page, search, statusFilter, sortBy]); 

  useEffect(() => { fetchSubmissions(); }, [fetchSubmissions]);

  
  const paginated = submissions; 

  const handleDelete = async () => {
    try {
      await api.delete(`/startupSubmission/deleteStartupSubmission/${deleteId}`);
      setSubmissions(p => p.filter(s => s._id !== deleteId));
      setDeleteId(null);
      toast('Submission retracted successfully.', 'success');
    } catch (err) {
      toast(err.response?.data?.message || 'Delete failed.', 'error');
    }
  };

  const processed = submissions
    .filter(s => {
      const q = search.toLowerCase();
      const matchSearch = !search ||
        (s.address || '').toLowerCase().includes(q) ||
        (s.userName || '').toLowerCase().includes(q) ||
        (s.status || '').toLowerCase().includes(q);
      const matchStatus = statusFilter === 'all' || s.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'funding-high') return (b.expectedFunding || 0) - (a.expectedFunding || 0);
      if (sortBy === 'funding-low') return (a.expectedFunding || 0) - (b.expectedFunding || 0);
      if (sortBy === 'potential') return (b.marketPotential || 0) - (a.marketPotential || 0);
      if (sortBy === 'oldest') return new Date(a.submissionDate || 0) - new Date(b.submissionDate || 0);
      return new Date(b.submissionDate || 0) - new Date(a.submissionDate || 0);
    });



  // reset page when filters change
  useEffect(() => { setPage(1); }, [statusFilter, sortBy]);

  // ── theme tokens ─────────────────────────────────────────────────────────
  const bg = isDark ? '#080c14' : '#f0f4f8';
  const card = isDark ? '#0d1628' : '#ffffff';
  const border = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const textPri = isDark ? '#f1f5f9' : '#0a1628';
  const textSec = isDark ? '#64748b' : '#94a3b8';
  const textMid = isDark ? '#94a3b8' : '#475569';
  const inputBg = isDark ? 'rgba(255,255,255,0.04)' : '#ffffff';
  const inputBdr = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const divider = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const rowHov = isDark ? 'rgba(14,165,233,0.04)' : 'rgba(14,165,233,0.03)';
  const thBg = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)';
  const fieldBg = isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc';

  // ── stats ────────────────────────────────────────────────────────────────
  const stats = {
    total: submissions.length,
    approved: submissions.filter(s => s.status === 'Approved').length,
    pending: submissions.filter(s => s.status === 'Pending').length,
    rejected: submissions.filter(s => s.status === 'Rejected').length,
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4"
      style={{ background: bg, fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        html,body,#root,*{scrollbar-width:none;-ms-overflow-style:none;}*::-webkit-scrollbar{display:none;width:0;}`}</style>
      <Loader2 className="animate-spin" size={32} style={{ color: '#0ea5e9' }} />
      <p className="text-[10px] font-black uppercase tracking-[.2em]" style={{ color: textSec }}>Loading Submissions…</p>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        html,body,#root,*{scrollbar-width:none;-ms-overflow-style:none;}
        *::-webkit-scrollbar{display:none;width:0;height:0;}
        .sn-input::placeholder{color:${isDark ? '#475569' : '#94a3b8'};}
        .sn-input:focus{border-color:#0ea5e9!important;box-shadow:0 0 0 3px rgba(14,165,233,0.12)!important;}
      `}</style>

      <ToastContainer />
      <EntrepreneurNavbar />

      <div className="min-h-screen transition-colors duration-300" style={{ background: bg }}>

        {/* dot grid */}
        <div className="fixed top-[62px] left-0 right-0 bottom-0 pointer-events-none z-0" style={{
          backgroundImage: `radial-gradient(circle, ${isDark ? 'rgba(14,165,233,0.07)' : 'rgba(14,165,233,0.12)'} 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }} />

        <main className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16">

          {/* ── Page Header ─────────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .4, ease: [.22, 1, .36, 1] }} className="mb-8">

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
              style={{ background: isDark ? 'rgba(14,165,233,0.10)' : 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.18)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[.18em] text-sky-400">My Submissions</span>
            </div>

            <h1 className="text-[2.2rem] font-black leading-none mb-2"
              style={{ color: textPri, letterSpacing: '-0.03em' }}>
              My <span style={{ color: '#0ea5e9' }}>Submissions</span>
            </h1>
            <p className="text-[14px] font-medium" style={{ color: textSec }}>
              Track and manage all your startup proposals in one place.
            </p>
          </motion.div>

          {/* ── Stats Row ───────────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .08 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
            {[
              { label: 'Total', value: stats.total, color: '#0ea5e9', bg: 'rgba(14,165,233,0.10)' },
              { label: 'Approved', value: stats.approved, color: '#10b981', bg: 'rgba(16,185,129,0.10)' },
              { label: 'Pending', value: stats.pending, color: '#f59e0b', bg: 'rgba(245,158,11,0.10)' },
              { label: 'Rejected', value: stats.rejected, color: '#f43f5e', bg: 'rgba(244,63,94,0.10)' },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: .1 + i * .05 }}
                className="rounded-2xl px-4 py-3.5 flex items-center gap-3"
                style={{ background: card, border: `1px solid ${border}` }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: s.bg }}>
                  <span className="text-[14px] font-black" style={{ color: s.color }}>{s.value}</span>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: textSec }}>{s.label}</p>
                  <p className="text-[11px] font-bold" style={{ color: textMid }}>submissions</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* ── Search + Filters ────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .12 }}
            className="flex flex-col sm:flex-row gap-3 mb-6">

            {/* Search */}
            <div className="relative flex-1">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: textSec }} />
              {rawSearch && (
                <button onClick={() => { setRawSearch(''); setSearch(''); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg"
                  style={{ color: textSec }}>
                  <X size={13} />
                </button>
              )}
              <input type="text" value={rawSearch}
                onChange={e => handleSearchChange(e.target.value)}
                placeholder="Search by address, username or status…"
                className="sn-input w-full pl-11 pr-9 py-3 rounded-2xl text-[13px] font-medium outline-none transition-all duration-200"
                style={{
                  background: inputBg, border: `1.5px solid ${rawSearch ? '#0ea5e9' : inputBdr}`,
                  color: textPri, boxShadow: rawSearch ? '0 0 0 3px rgba(14,165,233,0.12)' : 'none',
                }} />
            </div>

            {/* Status filter */}
            <Dropdown value={statusFilter} onChange={setStatusFilter} options={STATUS_OPTIONS}
              label="Status" icon={SlidersHorizontal} isDark={isDark}
              textSec={textSec} inputBg={inputBg} inputBdr={inputBdr} />

            {/* Sort */}
            <Dropdown value={sortBy} onChange={setSortBy} options={SORT_OPTIONS}
              label="Sort" icon={ArrowUpDown} isDark={isDark}
              textSec={textSec} inputBg={inputBg} inputBdr={inputBdr} />
          </motion.div>

          {/* ── Table ───────────────────────────────────────────────────── */}
          <AnimatePresence mode="wait">
            {paginated.length > 0 ? (
              <motion.div key="table" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }} transition={{ delay: .15 }}
                className="rounded-2xl overflow-hidden mb-6"
                style={{ background: card, border: `1px solid ${border}`, boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.25)' : '0 4px 24px rgba(0,0,0,0.06)' }}>

                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr style={{ background: thBg, borderBottom: `1px solid ${divider}` }}>
                      {['#', 'Address', 'Funding Ask', 'Market Potential', 'Est. Launch', 'Status', 'Actions'].map(h => (
                        <th key={h} className="px-5 py-4 text-[9px] font-black uppercase tracking-[.15em] whitespace-nowrap"
                          style={{ color: textSec }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((sub, idx) => {
                      const globalIdx = (page - 1) * PAGE_SIZE + idx + 1;
                      const isPending = sub.status === 'Pending';
                      return (
                        <motion.tr key={sub._id}
                          initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.04 }}
                          style={{ borderBottom: idx < paginated.length - 1 ? `1px solid ${divider}` : 'none' }}
                          onMouseEnter={e => e.currentTarget.style.background = rowHov}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>

                          {/* # */}
                          <td className="px-5 py-4">
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black"
                              style={{ background: 'rgba(14,165,233,0.10)', color: '#0ea5e9' }}>
                              {globalIdx}
                            </div>
                          </td>

                          {/* Address */}
                          <td className="px-5 py-4 max-w-[160px]">
                            <div className="flex items-center gap-1.5">
                              <MapPin size={11} style={{ color: '#6366f1', flexShrink: 0 }} />
                              <span className="text-[12px] font-bold truncate" style={{ color: textPri }}>
                                {sub.address || '—'}
                              </span>
                            </div>
                          </td>

                          {/* Funding */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1">
                              <IndianRupee size={11} style={{ color: '#10b981' }} />
                              <span className="text-[13px] font-black" style={{ color: textPri }}>
                                {Number(sub.expectedFunding || 0).toLocaleString('en-IN')}
                              </span>
                            </div>
                          </td>

                          {/* Market Potential */}
                          <td className="px-5 py-4 min-w-[140px]">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1.5 rounded-full overflow-hidden"
                                style={{ background: isDark ? 'rgba(255,255,255,0.07)' : '#e2e8f0', minWidth: 60 }}>
                                <div className="h-full rounded-full"
                                  style={{ width: `${Math.min(sub.marketPotential || 0, 100)}%`, background: 'linear-gradient(90deg,#10b981,#34d399)' }} />
                              </div>
                              <span className="text-[11px] font-black shrink-0" style={{ color: '#10b981' }}>
                                {sub.marketPotential ?? '—'}%
                              </span>
                            </div>
                          </td>

                          {/* Est. Launch */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1.5">
                              <CalendarDays size={11} style={{ color: '#f59e0b' }} />
                              <span className="text-[12px] font-bold" style={{ color: textPri }}>
                                {sub.launchYear ? new Date(sub.launchYear).getFullYear() : '—'}
                              </span>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-5 py-4">
                            <StatusBadge status={sub.status} />
                          </td>

                          {/* Actions */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <motion.button
                                whileHover={{ scale: 1.06 }} whileTap={{ scale: .94 }}
                                onClick={() => setSelectedSub(sub)}
                                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white"
                                style={{ background: 'linear-gradient(135deg,#0284c7,#0ea5e9)', boxShadow: '0 3px 10px rgba(14,165,233,0.30)' }}>
                                <Eye size={11} /> Details
                              </motion.button>
                              {isPending && (
                                <motion.button
                                  whileHover={{ scale: 1.06 }} whileTap={{ scale: .94 }}
                                  onClick={() => setDeleteId(sub._id)}
                                  className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                                  style={{ background: 'rgba(244,63,94,0.10)', border: '1px solid rgba(244,63,94,0.20)' }}
                                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(244,63,94,0.20)'; }}
                                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(244,63,94,0.10)'; }}>
                                  <Trash2 size={13} style={{ color: '#f43f5e' }} />
                                </motion.button>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-24 rounded-2xl mb-6"
                style={{ background: card, border: `1px solid ${border}` }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: isDark ? 'rgba(14,165,233,0.08)' : 'rgba(14,165,233,0.06)' }}>
                  <Rocket size={28} style={{ color: isDark ? '#1e3a5f' : '#bfdbfe' }} />
                </div>
                <p className="text-[14px] font-bold mb-2" style={{ color: textPri }}>No submissions found</p>
                <p className="text-[12px] font-medium mb-5" style={{ color: textSec }}>
                  {search || statusFilter !== 'all' ? 'Try adjusting your filters' : 'You haven\'t submitted any proposals yet'}
                </p>
                {(search || statusFilter !== 'all') && (
                  <button onClick={() => { setRawSearch(''); setSearch(''); setStatusFilter('all'); }}
                    className="px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest text-white"
                    style={{ background: 'linear-gradient(135deg,#0284c7,#0ea5e9)' }}>
                    Clear Filters
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Pagination ──────────────────────────────────────────────── */}
          {totalPages > 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .2 }}
              className="flex items-center justify-between">
              <p className="text-[11px] font-medium" style={{ color: textSec }}>
                Showing <span className="font-black" style={{ color: textPri }}>{(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, processed.length)}</span> of <span className="font-black" style={{ color: textPri }}>{processed.length}</span> submissions
              </p>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                  style={{
                    background: page === 1 ? (isDark ? 'rgba(255,255,255,0.03)' : '#f1f5f9') : inputBg,
                    border: `1px solid ${inputBdr}`,
                    color: page === 1 ? textSec : textPri,
                    opacity: page === 1 ? .5 : 1,
                    cursor: page === 1 ? 'not-allowed' : 'pointer',
                  }}>
                  <ChevronLeft size={14} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-[12px] font-black transition-all"
                    style={{
                      background: p === page ? 'linear-gradient(135deg,#0284c7,#0ea5e9)' : inputBg,
                      border: `1px solid ${p === page ? 'transparent' : inputBdr}`,
                      color: p === page ? '#ffffff' : textSec,
                      boxShadow: p === page ? '0 3px 10px rgba(14,165,233,0.30)' : 'none',
                    }}>
                    {p}
                  </button>
                ))}

                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                  style={{
                    background: page === totalPages ? (isDark ? 'rgba(255,255,255,0.03)' : '#f1f5f9') : inputBg,
                    border: `1px solid ${inputBdr}`,
                    color: page === totalPages ? textSec : textPri,
                    opacity: page === totalPages ? .5 : 1,
                    cursor: page === totalPages ? 'not-allowed' : 'pointer',
                  }}>
                  <ChevronRight size={14} />
                </button>
              </div>
            </motion.div>
          )}
        </main>
      </div>

      {/* ── Modals ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedSub && (
          <DetailModal sub={selectedSub} onClose={() => setSelectedSub(null)} isDark={isDark} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {deleteId && (
          <DeleteModal onConfirm={handleDelete} onCancel={() => setDeleteId(null)} isDark={isDark} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MySubmissions;
