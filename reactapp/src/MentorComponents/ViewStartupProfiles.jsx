/**
 * ViewStartupProfiles.jsx — StartupNest Mentor
 * Full redesign: matches platform theme, card grid with hover animations,
 * search/filter, delete confirm, detail modal, dark/light sync.
 */

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, IndianRupee, TrendingUp, Building2, Layers,
  Loader2, X, RefreshCw, Search, Sparkles, FilePlus2,
  Lightbulb, Rocket, BarChart2, Target, ArrowUpRight,
  ChevronRight, Tag, FileText, AlertTriangle, Trash2,
  Filter, CheckCircle2, Eye
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

/* ─── Stage config ─── */
const STAGE_CFG = {
  idea:        { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.22)',  icon: Lightbulb,  label: 'Idea'        },
  MVP:         { color: '#0ea5e9', bg: 'rgba(14,165,233,0.12)',  border: 'rgba(14,165,233,0.22)',  icon: Rocket,     label: 'MVP'         },
  'pre-revenue':{ color: '#6366f1', bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.22)',  icon: BarChart2,  label: 'Pre-Revenue' },
  scaling:     { color: '#10b981', bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.22)',  icon: TrendingUp, label: 'Scaling'     },
  established: { color: '#f43f5e', bg: 'rgba(244,63,94,0.12)',   border: 'rgba(244,63,94,0.22)',   icon: Target,     label: 'Established' },
};
function StageBadge({ stage }) {
  const cfg = STAGE_CFG[stage] || { color: '#64748b', bg: 'rgba(100,116,139,0.10)', border: 'rgba(100,116,139,0.18)', icon: Layers, label: stage };
  const Icon = cfg.icon;
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest"
      style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color }}>
      <Icon size={9} /> {cfg.label}
    </span>
  );
}

/* ─── Confirm Delete Modal ─── */
function DeleteModal({ profile, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0"
        style={{ background: 'rgba(8,12,20,0.82)', backdropFilter: 'blur(10px)' }}
        onClick={onCancel} />
      <motion.div initial={{ scale: .88, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: .88, opacity: 0 }} transition={{ duration: .25, ease: [.22, 1, .36, 1] }}
        className="relative w-full max-w-xs rounded-3xl p-7 text-center"
        style={{ background: '#0d1628', border: '1px solid rgba(244,63,94,0.25)', boxShadow: '0 32px 80px rgba(0,0,0,0.55)' }}>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: 'rgba(244,63,94,0.10)' }}>
          <Trash2 size={26} style={{ color: '#f43f5e' }} />
        </div>
        <h3 className="text-[16px] font-black mb-2 text-slate-100">Delete Profile?</h3>
        <p className="text-[12px] font-medium mb-2 leading-relaxed text-slate-400">
          You're about to delete <span className="text-white font-black">"{profile?.category}"</span>.
        </p>
        <p className="text-[11px] font-medium mb-6 text-slate-500">This action cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-400"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            Cancel
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white"
            style={{ background: 'linear-gradient(135deg,#ef4444,#f43f5e)', boxShadow: '0 4px 16px rgba(244,63,94,0.40)' }}>
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Detail Modal ─── */
function DetailModal({ profile, onClose, onDelete, isDark }) {
  const card    = isDark ? '#0d1628' : '#ffffff';
  const border  = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)';
  const textPri = isDark ? '#f1f5f9' : '#0a1628';
  const textSec = isDark ? '#64748b' : '#94a3b8';
  const fieldBg = isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc';
  const divider = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const stageCfg = STAGE_CFG[profile.preferredStage] || {};

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0"
        style={{ background: 'rgba(8,12,20,0.82)', backdropFilter: 'blur(10px)' }}
        onClick={onClose} />
      <motion.div initial={{ scale: .88, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: .88, opacity: 0, y: 20 }} transition={{ duration: .28, ease: [.22, 1, .36, 1] }}
        className="relative w-full max-w-lg rounded-3xl overflow-hidden"
        style={{ background: card, border: `1px solid ${border}`, boxShadow: isDark ? '0 32px 80px rgba(0,0,0,0.60)' : '0 32px 80px rgba(0,0,0,0.14)' }}>

        {/* top stripe */}
        <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg,${stageCfg.color || '#0ea5e9'},#0ea5e9,#38bdf8)` }} />

        {/* Header */}
        <div className="px-6 py-5 flex items-start justify-between" style={{ borderBottom: `1px solid ${divider}` }}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: stageCfg.bg || 'rgba(14,165,233,0.10)', border: `1px solid ${stageCfg.border || 'rgba(14,165,233,0.18)'}` }}>
              {stageCfg.icon ? React.createElement(stageCfg.icon, { size: 20, style: { color: stageCfg.color || '#0ea5e9' } }) : <Layers size={20} style={{ color: '#0ea5e9' }} />}
            </div>
            <div>
              <h3 className="text-[17px] font-black leading-tight" style={{ color: textPri }}>{profile.category}</h3>
              <StageBadge stage={profile.preferredStage} />
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9', color: textSec }}>
            <X size={14} />
          </button>
        </div>

        {/* Description */}
        <div className="px-6 py-4" style={{ borderBottom: `1px solid ${divider}` }}>
          <p className="text-[9px] font-black uppercase tracking-widest mb-2" style={{ color: textSec }}>Description</p>
          <p className="text-[13px] font-medium leading-relaxed" style={{ color: textPri }}>{profile.description}</p>
        </div>

        {/* Metrics */}
        <div className="px-6 py-5 grid grid-cols-2 gap-3">
          {[
            { label: 'Funding Limit',       value: `₹${Number(profile.fundingLimit || 0).toLocaleString('en-IN')}`, color: '#0ea5e9', icon: IndianRupee },
            { label: 'Equity Expectation',  value: `${profile.avgEquityExpectation ?? 0}%`,                          color: '#10b981', icon: TrendingUp  },
            { label: 'Target Industry',     value: profile.targetIndustry || '—',                                    color: '#6366f1', icon: Building2   },
            { label: 'Preferred Stage',     value: STAGE_CFG[profile.preferredStage]?.label || profile.preferredStage || '—', color: stageCfg.color || '#f59e0b', icon: Layers },
          ].map(f => {
            const Icon = f.icon;
            return (
              <div key={f.label} className="rounded-2xl p-4" style={{ background: fieldBg, border: `1px solid ${divider}` }}>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Icon size={10} style={{ color: f.color }} />
                  <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: textSec }}>{f.label}</p>
                </div>
                <p className="text-[14px] font-black" style={{ color: textPri }}>{f.value}</p>
              </div>
            );
          })}
        </div>

        {/* Equity progress bar */}
        <div className="px-6 pb-5" style={{ borderTop: `1px solid ${divider}` }}>
          <div className="flex justify-between mt-4 mb-2">
            <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: textSec }}>Equity Stake</span>
            <span className="text-[11px] font-black" style={{ color: '#10b981' }}>{profile.avgEquityExpectation ?? 0}%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0' }}>
            <motion.div initial={{ width: 0 }}
              animate={{ width: `${Math.min(profile.avgEquityExpectation || 0, 100)}%` }}
              transition={{ delay: .2, duration: .7, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg,#10b981,#34d399)' }} />
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all"
            style={{ background: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9', color: textSec, border: `1px solid ${divider}` }}>
            Close
          </button>
          <button onClick={() => onDelete(profile)}
            className="flex items-center justify-center gap-2 flex-1 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest"
            style={{ background: 'rgba(244,63,94,0.10)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.20)' }}>
            <Trash2 size={12} /> Delete Profile
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Profile Card ─── */
function ProfileCard({ profile, index, onView, onDelete, isDark }) {
  const card    = isDark ? '#0d1628' : '#ffffff';
  const border  = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const textPri = isDark ? '#f1f5f9' : '#0a1628';
  const textSec = isDark ? '#64748b' : '#94a3b8';
  const fieldBg = isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc';
  const fieldBdr = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const stageCfg = STAGE_CFG[profile.preferredStage] || {};
  const StageIcon = stageCfg.icon || Layers;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94 }} transition={{ delay: index * 0.06, duration: .35 }}
      whileHover={{ y: -4, boxShadow: `0 16px 48px ${stageCfg.color ? stageCfg.color + '22' : 'rgba(14,165,233,0.14)'}` }}
      className="relative rounded-3xl overflow-hidden flex flex-col"
      style={{
        background: card, border: `1px solid ${border}`,
        boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.28)' : '0 4px 24px rgba(0,0,0,0.06)',
      }}>
      {/* accent top stripe */}
      <div className="absolute top-0 left-0 w-full h-[3px]"
        style={{ background: `linear-gradient(90deg,${stageCfg.color || '#0ea5e9'},${stageCfg.color || '#0ea5e9'}66)` }} />

      <div className="p-6 flex flex-col gap-4 flex-1">
        {/* Card header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: stageCfg.bg || 'rgba(14,165,233,0.10)', border: `1px solid ${stageCfg.border || 'rgba(14,165,233,0.18)'}` }}>
              <StageIcon size={18} style={{ color: stageCfg.color || '#0ea5e9' }} />
            </div>
            <div className="min-w-0">
              <h3 className="text-[15px] font-black truncate leading-tight" style={{ color: textPri }}>{profile.category}</h3>
              <p className="text-[10px] font-medium truncate mt-0.5" style={{ color: textSec }}>{profile.targetIndustry}</p>
            </div>
          </div>
          <StageBadge stage={profile.preferredStage} />
        </div>

        {/* Description */}
        <p className="text-[12px] font-medium leading-relaxed line-clamp-2" style={{ color: textSec }}>
          {profile.description}
        </p>

        {/* Metrics row */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-2xl p-3" style={{ background: fieldBg, border: `1px solid ${fieldBdr}` }}>
            <div className="flex items-center gap-1.5 mb-1">
              <IndianRupee size={9} style={{ color: '#0ea5e9' }} />
              <span className="text-[8px] font-black uppercase tracking-widest" style={{ color: textSec }}>Funding Limit</span>
            </div>
            <p className="text-[14px] font-black leading-none" style={{ color: textPri }}>
              ₹{Number(profile.fundingLimit || 0).toLocaleString('en-IN')}
            </p>
          </div>
          <div className="rounded-2xl p-3" style={{ background: fieldBg, border: `1px solid ${fieldBdr}` }}>
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp size={9} style={{ color: '#10b981' }} />
              <span className="text-[8px] font-black uppercase tracking-widest" style={{ color: textSec }}>Equity Ask</span>
            </div>
            <p className="text-[14px] font-black leading-none" style={{ color: textPri }}>
              {profile.avgEquityExpectation ?? 0}%
            </p>
          </div>
        </div>

        {/* Equity bar */}
        <div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0' }}>
            <motion.div initial={{ width: 0 }}
              animate={{ width: `${Math.min(profile.avgEquityExpectation || 0, 100)}%` }}
              transition={{ delay: index * 0.06 + .3, duration: .7, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg,#10b981,#34d399)' }} />
          </div>
        </div>
      </div>

      {/* Card footer */}
      <div className="px-6 pb-5 flex items-center gap-2"
        style={{ borderTop: `1px solid ${fieldBdr}`, paddingTop: 16 }}>
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: .96 }}
          onClick={() => onView(profile)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white"
          style={{ background: 'linear-gradient(135deg,#0284c7,#0ea5e9)', boxShadow: '0 3px 12px rgba(14,165,233,0.30)' }}>
          <Eye size={12} /> View Details
        </motion.button>
        <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: .94 }}
          onClick={() => onDelete(profile)}
          className="w-10 h-10 rounded-2xl flex items-center justify-center"
          style={{ background: 'rgba(244,63,94,0.10)', border: '1px solid rgba(244,63,94,0.20)', color: '#f43f5e' }}>
          <Trash2 size={14} />
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ─── Empty state ─── */
function EmptyState({ onAdd, isDark }) {
  const card   = isDark ? '#0d1628' : '#ffffff';
  const border = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const textPri = isDark ? '#f1f5f9' : '#0a1628';
  const textSec = isDark ? '#64748b' : '#94a3b8';
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 rounded-3xl text-center"
      style={{ background: card, border: `2px dashed ${border}` }}>
      <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5"
        style={{ background: 'rgba(14,165,233,0.08)', border: '2px solid rgba(14,165,233,0.12)' }}>
        <Briefcase size={32} style={{ color: isDark ? 'rgba(14,165,233,0.35)' : 'rgba(14,165,233,0.45)' }} />
      </motion.div>
      <h3 className="text-[18px] font-black mb-2" style={{ color: textPri }}>No profiles yet</h3>
      <p className="text-[13px] font-medium mb-7 max-w-xs leading-relaxed" style={{ color: textSec }}>
        You haven't posted any startup opportunities yet. Create your first profile to start receiving applications.
      </p>
      <motion.button whileHover={{ scale: 1.04, boxShadow: '0 8px 28px rgba(14,165,233,0.40)' }}
        whileTap={{ scale: .97 }} onClick={onAdd}
        className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-[12px] font-black uppercase tracking-widest text-white"
        style={{ background: 'linear-gradient(135deg,#0284c7,#0ea5e9)', boxShadow: '0 4px 20px rgba(14,165,233,0.35)' }}>
        <FilePlus2 size={15} /> Add Your First Profile
      </motion.button>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════
   MAIN
════════════════════════════════════════════════════════════ */
export default function ViewStartupProfiles() {
  const navigate  = useNavigate();
  const isDark    = useTheme();
  const [profiles,      setProfiles]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [refreshing,    setRefreshing]    = useState(false);
  const [search,        setSearch]        = useState('');
  const [rawSearch,     setRawSearch]     = useState('');
  const [stageFilter,   setStageFilter]   = useState('All');
  const [selected,      setSelected]      = useState(null);
  const [deleteTarget,  setDeleteTarget]  = useState(null);
  const [deleting,      setDeleting]      = useState(false);
  const debounceRef = useRef(null);

  const mentorId = localStorage.getItem('ID') || localStorage.getItem('userId');

  // ── tokens ────────────────────────────────────────────────────────────────
  const bg      = isDark ? '#080c14' : '#f0f4f8';
  const card    = isDark ? '#0d1628' : '#ffffff';
  const border  = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const textPri = isDark ? '#f1f5f9' : '#0a1628';
  const textSec = isDark ? '#64748b' : '#94a3b8';
  const textMid = isDark ? '#94a3b8' : '#475569';
  const inputBg  = isDark ? 'rgba(255,255,255,0.04)' : '#ffffff';
  const inputBdr = isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.09)';

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true); else setRefreshing(true);
    try {
      const res = await api.get(`/startupProfile/getStartupProfilesByMentorId/${mentorId}`);
      setProfiles(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error(e);
      if (!silent) toast('Failed to load profiles.', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [mentorId]);

  useEffect(() => { load(); }, [load]);

  const handleSearch = val => {
    setRawSearch(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearch(val), 300);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/startupProfile/deleteStartupProfile/${deleteTarget._id}`);
      setProfiles(prev => prev.filter(p => p._id !== deleteTarget._id));
      toast('Profile deleted successfully.', 'success');
      setDeleteTarget(null);
      if (selected?._id === deleteTarget._id) setSelected(null);
    } catch (e) {
      toast(e?.response?.data?.message || 'Delete failed. Please try again.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const STAGE_FILTERS = ['All', 'idea', 'MVP', 'pre-revenue', 'scaling', 'established'];

  const filtered = profiles
    .filter(p => stageFilter === 'All' || p.preferredStage === stageFilter)
    .filter(p => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (p.category || '').toLowerCase().includes(q) ||
             (p.description || '').toLowerCase().includes(q) ||
             (p.targetIndustry || '').toLowerCase().includes(q) ||
             (p.preferredStage || '').toLowerCase().includes(q);
    });

  const hasFilters = stageFilter !== 'All' || !!search;

  const stageStats = STAGE_FILTERS.slice(1).reduce((acc, s) => {
    acc[s] = profiles.filter(p => p.preferredStage === s).length;
    return acc;
  }, {});

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        html,body,#root,*{scrollbar-width:none;-ms-overflow-style:none;}
        *::-webkit-scrollbar{display:none;width:0;height:0;}
        .vsp-input::placeholder{color:${isDark ? '#334155' : '#94a3b8'}!important;}
        .vsp-input:focus{border-color:#0ea5e9!important;box-shadow:0 0 0 3px rgba(14,165,233,0.13)!important;}
        .line-clamp-2{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
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
                  My{' '}
                  <span style={{ background: 'linear-gradient(135deg,#0ea5e9,#38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Startup Profiles
                  </span>
                </h1>
                <p className="text-[13px] font-medium" style={{ color: textSec }}>
                  Manage your posted mentoring & funding opportunities.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: .96 }}
                  onClick={() => load(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest"
                  style={{ background: card, border: `1px solid ${border}`, color: textMid }}>
                  <RefreshCw size={12} className={refreshing ? 'animate-spin' : ''} style={{ color: '#0ea5e9' }} />
                  Refresh
                </motion.button>
                <motion.button whileHover={{ scale: 1.04, boxShadow: '0 8px 24px rgba(14,165,233,0.40)' }}
                  whileTap={{ scale: .96 }}
                  onClick={() => navigate('/mentor/create-profile')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white"
                  style={{ background: 'linear-gradient(135deg,#0284c7,#0ea5e9)', boxShadow: '0 4px 16px rgba(14,165,233,0.35)' }}>
                  <FilePlus2 size={13} /> Add Profile
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* ── Stats chips ─────────────────────────────────────────────── */}
          {!loading && profiles.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: .08 }} className="flex flex-wrap gap-2.5 mb-6">
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl"
                style={{ background: 'rgba(14,165,233,0.10)', border: '1px solid rgba(14,165,233,0.20)' }}>
                <Briefcase size={11} style={{ color: '#0ea5e9' }} />
                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#0ea5e9' }}>Total</span>
                <span className="text-[14px] font-black leading-none" style={{ color: '#0ea5e9' }}>{profiles.length}</span>
              </div>
              {Object.entries(stageStats).filter(([,v]) => v > 0).map(([stage, count]) => {
                const cfg = STAGE_CFG[stage] || {};
                const Icon = cfg.icon || Layers;
                return (
                  <motion.div key={stage} whileHover={{ y: -1 }}
                    onClick={() => setStageFilter(stageFilter === stage ? 'All' : stage)}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-2xl cursor-pointer"
                    style={{ background: cfg.bg, border: `1px solid ${stageFilter === stage ? cfg.color : cfg.border}`,
                      boxShadow: stageFilter === stage ? `0 0 0 2px ${cfg.color}30` : 'none' }}>
                    <Icon size={10} style={{ color: cfg.color }} />
                    <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: cfg.color }}>{cfg.label}</span>
                    <span className="text-[13px] font-black" style={{ color: cfg.color }}>{count}</span>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* ── Search + Filter ─────────────────────────────────────────── */}
          {!loading && profiles.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: .12 }} className="flex flex-wrap items-center gap-3 mb-7">
              <div className="relative flex-1 min-w-[220px]">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: textSec }} />
                {rawSearch && (
                  <button onClick={() => { setRawSearch(''); setSearch(''); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: textSec }}>
                    <X size={13} />
                  </button>
                )}
                <input value={rawSearch} onChange={e => handleSearch(e.target.value)}
                  placeholder="Search by category, industry or stage…"
                  className="vsp-input w-full pl-10 pr-9 py-2.5 rounded-2xl text-[12px] font-medium outline-none transition-all"
                  style={{ background: inputBg, border: `1.5px solid ${rawSearch ? '#0ea5e9' : inputBdr}`, color: textPri }} />
              </div>

              {/* Stage filter pills */}
              <div className="flex flex-wrap gap-2">
                {STAGE_FILTERS.map(s => {
                  const active = stageFilter === s;
                  const cfg = STAGE_CFG[s];
                  return (
                    <motion.button key={s} whileTap={{ scale: .94 }}
                      onClick={() => setStageFilter(s)}
                      className="px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                      style={{
                        background: active ? (cfg ? cfg.bg : 'rgba(14,165,233,0.12)') : (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'),
                        border: `1.5px solid ${active ? (cfg?.color || '#0ea5e9') : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)')}`,
                        color: active ? (cfg?.color || '#0ea5e9') : textSec,
                      }}>
                      {s === 'All' ? 'All Stages' : cfg?.label || s}
                    </motion.button>
                  );
                })}
              </div>

              {hasFilters && (
                <motion.button initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }}
                  onClick={() => { setRawSearch(''); setSearch(''); setStageFilter('All'); }}
                  className="px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest"
                  style={{ background: 'rgba(244,63,94,0.10)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.20)' }}>
                  <X size={11} className="inline mr-1" /> Clear
                </motion.button>
              )}
            </motion.div>
          )}

          {/* ── Content ─────────────────────────────────────────────────── */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4 rounded-2xl"
              style={{ background: card, border: `1px solid ${border}` }}>
              <Loader2 className="animate-spin" size={32} style={{ color: '#0ea5e9' }} />
              <p className="text-[10px] font-black uppercase tracking-[.2em]" style={{ color: textSec }}>Loading Profiles…</p>
            </div>
          ) : profiles.length === 0 ? (
            <EmptyState onAdd={() => navigate('/mentor/create-profile')} isDark={isDark} />
          ) : filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-24 rounded-3xl"
              style={{ background: card, border: `2px dashed ${border}` }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: isDark ? 'rgba(14,165,233,0.08)' : 'rgba(14,165,233,0.06)' }}>
                <Search size={28} style={{ color: isDark ? '#1e3a5f' : '#bfdbfe' }} />
              </div>
              <p className="text-[14px] font-bold mb-1.5" style={{ color: textPri }}>No matching profiles</p>
              <p className="text-[12px] font-medium mb-5" style={{ color: textSec }}>Try adjusting your search or filters.</p>
              <button onClick={() => { setRawSearch(''); setSearch(''); setStageFilter('All'); }}
                className="px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest text-white"
                style={{ background: 'linear-gradient(135deg,#0284c7,#0ea5e9)' }}>
                Clear Filters
              </button>
            </motion.div>
          ) : (
            <>
              <p className="text-[11px] font-medium mb-4" style={{ color: textSec }}>
                Showing <span style={{ color: textPri, fontWeight: 800 }}>{filtered.length}</span> of <span style={{ color: textPri, fontWeight: 800 }}>{profiles.length}</span> profiles
              </p>
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                <AnimatePresence>
                  {filtered.map((p, i) => (
                    <ProfileCard key={p._id} profile={p} index={i} isDark={isDark}
                      onView={setSelected}
                      onDelete={setDeleteTarget} />
                  ))}
                </AnimatePresence>
              </motion.div>
            </>
          )}
        </main>
      </div>

      {/* ── Detail Modal ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selected && (
          <DetailModal profile={selected} isDark={isDark}
            onClose={() => setSelected(null)}
            onDelete={p => { setSelected(null); setDeleteTarget(p); }} />
        )}
      </AnimatePresence>

      {/* ── Delete Confirm Modal ────────────────────────────────────────── */}
      <AnimatePresence>
        {deleteTarget && (
          <DeleteModal profile={deleteTarget}
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}