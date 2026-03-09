/**
 * AdminDashboard.jsx — StartupNest Admin
 * Redesigned to match the Entrepreneur pages theme:
 * - Dark/light toggle (dark = dark page + light navbar behavior)
 * - Dot-grid background, sky-400 accents, Plus Jakarta Sans
 * - Table layout for users, sidebar with theme toggle
 * - All original functionality preserved + enhanced
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, UserCheck, UserX, FileText,
  Loader2, LogOut, LayoutDashboard, Users, UserCog,
  Clock, X, RefreshCw, Sun, Moon, Search, Eye,
  ChevronDown, CheckCircle2, XCircle, AlertTriangle,
  Menu, Building2
} from 'lucide-react';
import api from '../Services/api';

const BACKEND_URL = "https://8080-befbcecccedffbccabcfcbfaabdbcabfebaccfcccce.premiumproject.examly.io";

/* ─── theme hook ─── */
function useTheme() {
  const [isDark, setIsDark] = useState(() => localStorage.getItem('sn-admin-theme') !== 'light');
  const toggle = () => {
    setIsDark(p => {
      const next = !p;
      localStorage.setItem('sn-admin-theme', next ? 'dark' : 'light');
      return next;
    });
  };
  return [isDark, toggle];
}

/* ─── self-contained toast ─── */
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
            exit={{ opacity: 0, x: 60, scale: .92 }} transition={{ duration: .25 }}
            className="pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-2xl shadow-xl min-w-[260px]"
            style={{
              background: t.type === 'success' ? 'linear-gradient(135deg,#ecfdf5,#d1fae5)' : 'linear-gradient(135deg,#fff1f2,#ffe4e6)',
              border: `1px solid ${t.type === 'success' ? '#6ee7b7' : '#fca5a5'}`,
            }}>
            <span style={{ color: t.type === 'success' ? '#065f46' : '#991b1b', fontSize: 14 }}>
              {t.type === 'success' ? '✓' : '✕'}
            </span>
            <p className="flex-1 text-[12px] font-semibold leading-snug"
              style={{ color: t.type === 'success' ? '#065f46' : '#991b1b' }}>{t.message}</p>
            <button onClick={() => remove(t.id)} className="opacity-40 hover:opacity-80"><X size={11} /></button>
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
    active:   { color: '#10b981', bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.22)',  icon: CheckCircle2 },
    pending:  { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.22)',  icon: Clock         },
    rejected: { color: '#f43f5e', bg: 'rgba(244,63,94,0.12)',   border: 'rgba(244,63,94,0.22)',   icon: XCircle       },
  }[status?.toLowerCase()] || { color: '#64748b', bg: 'rgba(100,116,139,0.10)', border: 'rgba(100,116,139,0.18)', icon: AlertTriangle };
  const Icon = cfg.icon;
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full w-fit"
      style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
      <Icon size={10} style={{ color: cfg.color }} />
      <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: cfg.color }}>
        {status}
      </span>
    </div>
  );
}

/* ─── Confirm Modal ─── */
function ConfirmModal({ title, message, onConfirm, onCancel, confirmLabel = 'Confirm', danger = false }) {
  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0" style={{ background: 'rgba(8,12,20,0.80)', backdropFilter: 'blur(10px)' }}
        onClick={onCancel} />
      <motion.div initial={{ scale: .88, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: .88, opacity: 0 }} transition={{ duration: .25, ease: [.22, 1, .36, 1] }}
        className="relative w-full max-w-xs rounded-3xl p-7 text-center"
        style={{ background: '#0d1628', border: `1px solid ${danger ? 'rgba(244,63,94,0.25)' : 'rgba(14,165,233,0.20)'}`, boxShadow: '0 32px 80px rgba(0,0,0,0.5)' }}>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: danger ? 'rgba(244,63,94,0.10)' : 'rgba(14,165,233,0.10)' }}>
          {danger ? <AlertTriangle size={26} style={{ color: '#f43f5e' }} /> : <ShieldCheck size={26} style={{ color: '#0ea5e9' }} />}
        </div>
        <h3 className="text-[16px] font-black mb-2 text-slate-100">{title}</h3>
        <p className="text-[12px] font-medium mb-6 leading-relaxed text-slate-400">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-400"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            Cancel
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white"
            style={{ background: danger ? 'linear-gradient(135deg,#ef4444,#f43f5e)' : 'linear-gradient(135deg,#0284c7,#0ea5e9)', boxShadow: danger ? '0 4px 16px rgba(244,63,94,0.35)' : '0 4px 16px rgba(14,165,233,0.35)' }}>
            {confirmLabel}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Nav Item ─── */
function NavItem({ icon, label, active, onClick, badge, isDark }) {
  const activeBg   = isDark ? 'rgba(14,165,233,0.15)' : 'rgba(14,165,233,0.12)';
  const activeText = isDark ? '#0ea5e9' : '#0ea5e9';
  const idleText   = isDark ? '#64748b' : '#64748b';
  const hoverBg    = isDark ? 'rgba(14,165,233,0.07)' : 'rgba(14,165,233,0.06)';

  return (
    <motion.button whileHover={{ x: 2 }} whileTap={{ scale: .97 }}
      onClick={onClick}
      className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all duration-150 text-left"
      style={{ background: active ? activeBg : 'transparent', color: active ? activeText : idleText }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = hoverBg; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}>
      <div className="flex items-center gap-3">
        {React.cloneElement(icon, { size: 15, style: { color: active ? '#0ea5e9' : idleText } })}
        <span className="text-[11px] font-black uppercase tracking-[.12em]">{label}</span>
      </div>
      {badge > 0 && (
        <span className="text-white text-[9px] font-black px-2 py-0.5 rounded-full"
          style={{ background: 'linear-gradient(135deg,#0284c7,#0ea5e9)' }}>
          {badge}
        </span>
      )}
    </motion.button>
  );
}

/* ════════════════════════════════════════════════════════════
   USER ROW (table row)
════════════════════════════════════════════════════════════ */
function UserRow({ user, index, onUpdate, isLoading, isPendingView, isDark }) {
  const resumeUrl = user.resumePath
    ? `${BACKEND_URL}/${String(user.resumePath).replace(/^\//, '')}`
    : null;

  const textPri = isDark ? '#f1f5f9' : '#0a1628';
  const textSec = isDark ? '#64748b' : '#94a3b8';
  const textMid = isDark ? '#94a3b8' : '#475569';
  const divider = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const rowHov  = isDark ? 'rgba(14,165,233,0.04)' : 'rgba(14,165,233,0.03)';
  const selectBg = isDark ? '#0d1628' : '#f8fafc';
  const selectBdr = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';

  const avatarColor = user.role === 'Mentor'
    ? 'linear-gradient(135deg,#6366f1,#818cf8)'
    : 'linear-gradient(135deg,#10b981,#34d399)';

  return (
    <motion.tr
      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      style={{ borderBottom: `1px solid ${divider}` }}
      onMouseEnter={e => e.currentTarget.style.background = rowHov}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>

      {/* # */}
      <td className="px-5 py-4">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black"
          style={{ background: 'rgba(14,165,233,0.10)', color: '#0ea5e9' }}>
          {index + 1}
        </div>
      </td>

      {/* User */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-[14px] shrink-0"
            style={{ background: avatarColor }}>
            {user.userName?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <p className="text-[13px] font-black leading-tight" style={{ color: textPri }}>
              {user.userName}
            </p>
            <p className="text-[10px] font-medium" style={{ color: textSec }}>
              {user.email}
            </p>
          </div>
        </div>
      </td>

      {/* Role badge */}
      <td className="px-5 py-4">
        <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide"
          style={{
            background: user.role === 'Mentor' ? 'rgba(99,102,241,0.12)' : 'rgba(16,185,129,0.12)',
            color: user.role === 'Mentor' ? '#6366f1' : '#10b981',
          }}>
          {user.role}
        </span>
      </td>

      {/* Status */}
      <td className="px-5 py-4">
        <StatusBadge status={user.status} />
      </td>

      {/* Change Role (non-pending only) */}
      <td className="px-5 py-4">
        {!isPendingView ? (
          <div className="relative">
            <select
              value={user.role}
              onChange={e => onUpdate(user._id, { role: e.target.value })}
              disabled={isLoading}
              className="pl-3 pr-7 py-2 rounded-xl text-[11px] font-bold outline-none appearance-none cursor-pointer transition-all"
              style={{ background: selectBg, border: `1px solid ${selectBdr}`, color: textMid }}>
              <option value="Mentor">Mentor</option>
              <option value="Entrepreneur">Entrepreneur</option>
            </select>
            <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: textSec }} />
          </div>
        ) : (
          <span className="text-[10px] font-medium" style={{ color: textSec }}>Review docs first</span>
        )}
      </td>

      {/* CV */}
      <td className="px-5 py-4">
        {resumeUrl ? (
          <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: .94 }}
            onClick={() => window.open(resumeUrl, '_blank')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest"
            style={{ background: 'rgba(14,165,233,0.10)', color: '#0ea5e9', border: '1px solid rgba(14,165,233,0.18)' }}>
            <FileText size={11} /> CV
          </motion.button>
        ) : (
          <span className="text-[10px] font-medium" style={{ color: textSec }}>—</span>
        )}
      </td>

      {/* Actions */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          {user.status !== 'active' && (
            <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: .94 }}
              onClick={() => onUpdate(user._id, { status: 'active' })}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg,#059669,#10b981)', boxShadow: '0 3px 10px rgba(16,185,129,0.30)' }}>
              {isLoading ? <Loader2 size={11} className="animate-spin" /> : <UserCheck size={11} />}
              Approve
            </motion.button>
          )}
          {user.status !== 'rejected' && (
            <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: .94 }}
              onClick={() => onUpdate(user._id, { status: 'rejected' })}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-50"
              style={{ background: 'rgba(244,63,94,0.10)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.20)' }}>
              {isLoading ? <Loader2 size={11} className="animate-spin" /> : <UserX size={11} />}
              Reject
            </motion.button>
          )}
        </div>
      </td>
    </motion.tr>
  );
}

/* ════════════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════════════ */
const AdminDashboard = () => {
  const [isDark, toggleTheme] = useTheme();
  const [users,         setUsers]         = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [refreshing,    setRefreshing]    = useState(false);
  const [filter,        setFilter]        = useState('Pending');
  const [search,        setSearch]        = useState('');
  const [rawSearch,     setRawSearch]     = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [sidebarOpen,   setSidebarOpen]   = useState(false);
  const [confirmModal,  setConfirmModal]  = useState(null);
  const debounceRef = useRef(null);

  // ── theme tokens ───────────────────────────────────────────────────────
  const bg       = isDark ? '#080c14' : '#f0f4f8';
  const sidebar  = isDark ? '#0d1628' : '#ffffff';
  const card     = isDark ? '#0d1628' : '#ffffff';
  const border   = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const textPri  = isDark ? '#f1f5f9' : '#0a1628';
  const textSec  = isDark ? '#64748b' : '#94a3b8';
  const textMid  = isDark ? '#94a3b8' : '#475569';
  const inputBg  = isDark ? 'rgba(255,255,255,0.04)' : '#ffffff';
  const inputBdr = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const divider  = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const thBg     = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)';
  const sidebarBdr = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  const fetchUsers = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await api.get('/user/all-users');
      setUsers(Array.isArray(res.data) ? res.data : res.data.users ?? []);
    } catch (err) {
      toast(err?.response?.data?.message || 'Failed to load users', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // debounce search
  const handleSearch = (val) => {
    setRawSearch(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearch(val), 300);
  };

  const handleUpdate = async (userId, updatePayload) => {
    setActionLoading(userId);
    setConfirmModal(null);
    try {
      await api.put('/user/update-user', { userId, ...updatePayload });
      toast(
        updatePayload.status === 'active'   ? 'User approved successfully!' :
        updatePayload.status === 'rejected' ? 'User rejected.' : 'User updated.',
        'success'
      );
      await fetchUsers(true);
    } catch (err) {
      toast(err?.response?.data?.message || 'Action failed.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const confirmAction = (userId, payload, title, message, danger = false) => {
    setConfirmModal({ userId, payload, title, message, danger });
  };

  const pendingCount = users.filter(u => u.status === 'pending').length;

  const filteredUsers = users
    .filter(u => {
      if (filter === 'Pending')      return u.status === 'pending';
      if (filter === 'Mentor')       return u.role === 'Mentor';
      if (filter === 'Entrepreneur') return u.role === 'Entrepreneur';
      return true;
    })
    .filter(u => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (u.userName || '').toLowerCase().includes(q) ||
             (u.email    || '').toLowerCase().includes(q) ||
             (u.role     || '').toLowerCase().includes(q) ||
             (u.status   || '').toLowerCase().includes(q);
    });

  const stats = {
    total:       users.length,
    active:      users.filter(u => u.status === 'active').length,
    pending:     users.filter(u => u.status === 'pending').length,
    mentors:     users.filter(u => u.role === 'Mentor').length,
    entrepreneurs: users.filter(u => u.role === 'Entrepreneur').length,
  };

  const navItems = [
    { id: 'Pending',      label: 'Verification Queue', icon: <Clock />,           badge: pendingCount },
    { id: 'All',          label: 'All Users',          icon: <LayoutDashboard /> },
    { id: 'Mentor',       label: 'Mentors',            icon: <Users /> },
    { id: 'Entrepreneur', label: 'Entrepreneurs',      icon: <UserCog /> },
  ];

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif" }} className="flex min-h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        html,body,#root,*{scrollbar-width:none;-ms-overflow-style:none;}
        *::-webkit-scrollbar{display:none;width:0;height:0;}
        .adm-input::placeholder{color:${isDark ? '#475569' : '#94a3b8'};}
        .adm-input:focus{border-color:#0ea5e9!important;box-shadow:0 0 0 3px rgba(14,165,233,0.12)!important;}
        .adm-select option{background:${isDark ? '#0d1628' : '#ffffff'};color:${isDark ? '#e2e8f0' : '#0a1628'};}
      `}</style>

      <ToastContainer />

      {/* ── Sidebar ───────────────────────────────────────────────────────── */}
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[50] lg:hidden"
            style={{ background: 'rgba(8,12,20,0.60)', backdropFilter: 'blur(4px)' }}
            onClick={() => setSidebarOpen(false)} />
        )}
      </AnimatePresence>

      <aside className={`fixed left-0 top-0 h-full w-64 z-[60] flex flex-col transition-transform duration-300
        lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: sidebar, borderRight: `1px solid ${sidebarBdr}`, boxShadow: isDark ? '4px 0 24px rgba(0,0,0,0.30)' : '4px 0 24px rgba(0,0,0,0.06)' }}>

        {/* Logo */}
        <div className="px-5 py-5 flex items-center justify-between"
          style={{ borderBottom: `1px solid ${sidebarBdr}` }}>
          <div className="flex items-center gap-2.5">
            <div className="relative w-9 h-9 shrink-0">
              <div className="absolute top-0 left-0 w-6 h-6 rounded-lg"
                style={{ background: 'linear-gradient(135deg,#38bdf8,#0ea5e9)', opacity: .9 }} />
              <div className="absolute bottom-0 right-0 w-6 h-6 rounded-lg"
                style={{ background: 'linear-gradient(135deg,#0284c7,#0369a1)', border: `2px solid ${sidebar}` }} />
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <span className="text-white font-black text-xs drop-shadow">S</span>
              </div>
            </div>
            <div>
              <div className="text-[13px] font-black leading-tight" style={{ color: textPri }}>
                Startup<span style={{ color: '#0ea5e9' }}>Nest</span>
              </div>
              <div className="text-[8px] font-black uppercase tracking-[.16em]" style={{ color: '#f43f5e' }}>
                Admin Panel
              </div>
            </div>
          </div>
          <button className="lg:hidden p-1.5 rounded-xl" style={{ color: textSec }}
            onClick={() => setSidebarOpen(false)}>
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <div className="flex-1 px-3 py-4 overflow-y-auto">
          <p className="text-[9px] font-black uppercase tracking-[.2em] px-3.5 mb-2"
            style={{ color: isDark ? 'rgba(14,165,233,0.35)' : 'rgba(14,165,233,0.50)' }}>
            Queue
          </p>
          <NavItem isDark={isDark} icon={<Clock />} label="Verification Queue"
            active={filter === 'Pending'} onClick={() => { setFilter('Pending'); setSidebarOpen(false); }}
            badge={pendingCount} />

          <div className="h-px my-4" style={{ background: sidebarBdr }} />
          <p className="text-[9px] font-black uppercase tracking-[.2em] px-3.5 mb-2"
            style={{ color: isDark ? 'rgba(14,165,233,0.35)' : 'rgba(14,165,233,0.50)' }}>
            Management
          </p>
          <div className="space-y-1">
            <NavItem isDark={isDark} icon={<LayoutDashboard />} label="All Users"
              active={filter === 'All'} onClick={() => { setFilter('All'); setSidebarOpen(false); }} />
            <NavItem isDark={isDark} icon={<Users />} label="Mentors"
              active={filter === 'Mentor'} onClick={() => { setFilter('Mentor'); setSidebarOpen(false); }} />
            <NavItem isDark={isDark} icon={<UserCog />} label="Entrepreneurs"
              active={filter === 'Entrepreneur'} onClick={() => { setFilter('Entrepreneur'); setSidebarOpen(false); }} />
          </div>

          {/* Stats mini */}
          <div className="mt-6 p-3 rounded-2xl space-y-2"
            style={{ background: isDark ? 'rgba(14,165,233,0.06)' : 'rgba(14,165,233,0.05)', border: '1px solid rgba(14,165,233,0.12)' }}>
            <p className="text-[9px] font-black uppercase tracking-[.15em] text-sky-400 mb-3">Overview</p>
            {[
              { label: 'Total Users', value: stats.total,   color: '#0ea5e9' },
              { label: 'Active',      value: stats.active,  color: '#10b981' },
              { label: 'Pending',     value: stats.pending, color: '#f59e0b' },
              { label: 'Mentors',     value: stats.mentors, color: '#6366f1' },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between">
                <span className="text-[10px] font-medium" style={{ color: textSec }}>{s.label}</span>
                <span className="text-[12px] font-black" style={{ color: s.color }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="px-3 py-4 space-y-2" style={{ borderTop: `1px solid ${sidebarBdr}` }}>
          {/* Dark/Light toggle */}
          <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl"
            style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }}>
            <div className="flex items-center gap-2">
              {isDark
                ? <Moon size={13} style={{ color: '#0ea5e9' }} />
                : <Sun  size={13} style={{ color: '#f59e0b' }} />}
              <span className="text-[11px] font-bold" style={{ color: textSec }}>
                {isDark ? 'Dark Mode' : 'Light Mode'}
              </span>
            </div>
            <button onClick={toggleTheme}
              className="relative w-10 h-5 rounded-full transition-colors duration-300 outline-none"
              style={{ background: isDark ? '#0ea5e9' : '#475569' }}>
              <motion.div animate={{ x: isDark ? 20 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-md" />
            </button>
          </div>

          {/* Sign Out */}
          <button onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-all"
            style={{ color: '#f43f5e' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(244,63,94,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <LogOut size={14} />
            <span className="text-[12px] font-bold">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── Main ──────────────────────────────────────────────────────────── */}
      <div className="flex-1 lg:ml-64 min-h-screen transition-colors duration-300" style={{ background: bg }}>

        {/* dot grid */}
        <div className="fixed top-0 left-64 right-0 bottom-0 pointer-events-none z-0"
          style={{
            backgroundImage: `radial-gradient(circle, ${isDark ? 'rgba(14,165,233,0.07)' : 'rgba(14,165,233,0.10)'} 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }} />

        <div className="relative z-10 max-w-full px-6 md:px-8 pt-6 pb-16">

          {/* Top bar */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              {/* Mobile hamburger */}
              <button className="lg:hidden p-2 rounded-xl transition-all"
                style={{ background: card, border: `1px solid ${border}`, color: textPri }}
                onClick={() => setSidebarOpen(true)}>
                <Menu size={18} />
              </button>
              <div>
                <motion.h1 key={filter}
                  initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                  className="text-[1.6rem] font-black leading-none"
                  style={{ color: textPri, letterSpacing: '-0.025em' }}>
                  {filter === 'Pending' ? 'Verification' : filter === 'All' ? 'All Users' : `${filter}s`}{' '}
                  <span style={{ color: '#0ea5e9' }}>{filter === 'Pending' ? 'Queue' : 'Management'}</span>
                </motion.h1>
                <p className="text-[10px] font-black uppercase tracking-[.18em] mt-1" style={{ color: textSec }}>
                  {filteredUsers.length} record{filteredUsers.length !== 1 ? 's' : ''} found
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: .96 }}
              onClick={() => fetchUsers(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
              style={{ background: card, border: `1px solid ${border}`, color: textMid, boxShadow: isDark ? '0 2px 12px rgba(0,0,0,0.20)' : '0 2px 12px rgba(0,0,0,0.06)' }}>
              <RefreshCw size={12} className={refreshing ? 'animate-spin' : ''} style={{ color: '#0ea5e9' }} />
              Refresh
            </motion.button>
          </div>

          {/* Search bar */}
          <div className="relative mb-6">
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
              onChange={e => handleSearch(e.target.value)}
              placeholder="Search by name, email, role or status…"
              className="adm-input w-full pl-11 pr-9 py-3 rounded-2xl text-[13px] font-medium outline-none transition-all duration-200"
              style={{
                background: inputBg, border: `1.5px solid ${rawSearch ? '#0ea5e9' : inputBdr}`,
                color: textPri, boxShadow: rawSearch ? '0 0 0 3px rgba(14,165,233,0.12)' : 'none',
              }} />
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4 rounded-2xl"
              style={{ background: card, border: `1px solid ${border}` }}>
              <Loader2 className="animate-spin" size={32} style={{ color: '#0ea5e9' }} />
              <p className="text-[10px] font-black uppercase tracking-[.2em]" style={{ color: textSec }}>
                Loading Database…
              </p>
            </div>
          ) : filteredUsers.length > 0 ? (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl overflow-hidden"
              style={{ background: card, border: `1px solid ${border}`, boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.25)' : '0 4px 24px rgba(0,0,0,0.06)' }}>

              <table className="w-full text-left border-collapse">
                <thead>
                  <tr style={{ background: thBg, borderBottom: `1px solid ${divider}` }}>
                    {['#', 'User', 'Role', 'Status', 'Change Role', 'CV', 'Actions'].map(h => (
                      <th key={h} className="px-5 py-4 text-[9px] font-black uppercase tracking-[.15em] whitespace-nowrap"
                        style={{ color: textSec }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredUsers.map((user, idx) => (
                      <UserRow
                        key={user._id}
                        user={user}
                        index={idx}
                        isDark={isDark}
                        isLoading={actionLoading === user._id}
                        isPendingView={filter === 'Pending'}
                        onUpdate={(uid, payload) => {
                          const isReject = payload.status === 'rejected';
                          const isApprove = payload.status === 'active';
                          if (isApprove) {
                            confirmAction(uid, payload,
                              'Approve User?',
                              `Grant ${user.userName} active access to the platform?`,
                              false
                            );
                          } else if (isReject) {
                            confirmAction(uid, payload,
                              'Reject User?',
                              `This will deny ${user.userName} access. They can be re-approved later.`,
                              true
                            );
                          } else {
                            handleUpdate(uid, payload);
                          }
                        }}
                      />
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-24 rounded-2xl"
              style={{ background: card, border: `1px solid ${border}` }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: isDark ? 'rgba(14,165,233,0.08)' : 'rgba(14,165,233,0.06)' }}>
                <ShieldCheck size={28} style={{ color: isDark ? '#1e3a5f' : '#bfdbfe' }} />
              </div>
              <p className="text-[14px] font-bold mb-2" style={{ color: textPri }}>
                No {filter.toLowerCase()} users found
              </p>
              <p className="text-[12px] font-medium" style={{ color: textSec }}>
                {search ? 'Try adjusting your search query' : filter === 'Pending' ? 'All caught up! No pending verifications.' : 'No users in this category yet.'}
              </p>
              {search && (
                <button onClick={() => { setRawSearch(''); setSearch(''); }}
                  className="mt-5 px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest text-white"
                  style={{ background: 'linear-gradient(135deg,#0284c7,#0ea5e9)' }}>
                  Clear Search
                </button>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* ── Confirm Modal ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {confirmModal && (
          <ConfirmModal
            title={confirmModal.title}
            message={confirmModal.message}
            danger={confirmModal.danger}
            confirmLabel={confirmModal.danger ? 'Reject' : 'Approve'}
            onConfirm={() => handleUpdate(confirmModal.userId, confirmModal.payload)}
            onCancel={() => setConfirmModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;