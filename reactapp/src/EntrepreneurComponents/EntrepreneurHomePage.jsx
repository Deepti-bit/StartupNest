/**
 * EntrepreneurHome.jsx — StartupNest
 * Clean, professional dashboard that syncs dark/light mode
 * with the navbar toggle via localStorage + storage event.
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  Rocket, Users, Lightbulb, PlusCircle, Loader2,
  AlertCircle, ChevronRight, TrendingUp, Calendar,
  ArrowUpRight, Sparkles, Target, Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../Services/api';
import EntrepreneurNavbar from '../EntrepreneurComponents/EntrepreneurNavbar';

/* ─── theme hook — stays in sync with navbar toggle ─── */
function useTheme() {
  const [isDark, setIsDark] = useState(() => localStorage.getItem('sn-theme') !== 'light');

  useEffect(() => {
    const onStorage = () => setIsDark(localStorage.getItem('sn-theme') !== 'light');
    // poll every 200ms as a fallback (same tab storage events don't fire)
    const interval = setInterval(onStorage, 200);
    window.addEventListener('storage', onStorage);
    return () => { clearInterval(interval); window.removeEventListener('storage', onStorage); };
  }, []);

  return isDark;
}

/* ─── status badge ─── */
const StatusBadge = ({ status }) => {
  const map = {
    Approved: { bg: 'rgba(16,185,129,.12)', color: '#10b981', label: 'Approved' },
    Rejected: { bg: 'rgba(244,63,94,.10)', color: '#f43f5e', label: 'Rejected' },
    Pending: { bg: 'rgba(245,158,11,.10)', color: '#f59e0b', label: 'Pending' },
  };
  const s = map[status] || map.Pending;
  return (
    <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest"
      style={{ background: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
};

/* ─── stat card ─── */
const StatCard = ({ label, value, icon, accent, delay, isDark, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
    transition={{ delay, ease: [.22, 1, .36, 1] }}
    whileHover={{ y: -3, transition: { duration: .2 } }}
    onClick={onClick}
    className="relative rounded-2xl p-6 overflow-hidden cursor-pointer"
    style={{
      background: isDark ? '#0d1628' : '#ffffff',
      border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
      boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.25)' : '0 4px 24px rgba(0,0,0,0.05)',
    }}>
    {/* accent strip */}
    <div className="absolute top-0 left-0 w-full h-[2px]" style={{ background: accent }} />
    {/* glow */}
    <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-[0.07] pointer-events-none"
      style={{ background: accent, filter: 'blur(24px)' }} />

    <div className="flex items-start justify-between mb-4">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center"
        style={{ background: `${accent}18` }}>
        {React.cloneElement(icon, { size: 20, color: accent })}
      </div>
      <ArrowUpRight size={14} style={{ color: isDark ? '#334155' : '#cbd5e1' }} />
    </div>
    <p className="text-[10px] font-black uppercase tracking-[.15em] mb-1"
      style={{ color: isDark ? '#475569' : '#94a3b8' }}>{label}</p>
    <p className="text-4xl font-black leading-none"
      style={{ color: isDark ? '#f1f5f9' : '#0a1628', letterSpacing: '-0.03em' }}>{value}</p>
  </motion.div>
);

/* ════════════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════════════ */
const EntrepreneurHome = () => {
  const navigate = useNavigate();
  const isDark = useTheme();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    ideasCount: 0, mentorsCount: 0, recentSubmissions: []
  });

  const userName = localStorage.getItem('userName') || 'Founder';
  const firstName = userName.trim().split(' ')[0];

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/user/entrepreneur/dashboard');
      setDashboardData(res.data);
      setError(null);
    } catch (err) {
      console.error('Dashboard error:', err);
      setError('Could not sync with the ecosystem. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  // ── theme tokens ──────────────────────────────────────────────────────────
  const bg = isDark ? '#080c14' : '#f0f4f8';
  const card = isDark ? '#0d1628' : '#ffffff';
  const border = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const textPri = isDark ? '#f1f5f9' : '#0a1628';
  const textSec = isDark ? '#64748b' : '#94a3b8';
  const textMid = isDark ? '#94a3b8' : '#475569';
  const divider = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const rowHov = isDark ? 'rgba(14,165,233,0.05)' : 'rgba(14,165,233,0.04)';

  // ── loading screen ────────────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4"
      style={{ background: bg, fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        html, body, #root { overflow-x: hidden; scrollbar-width: none; -ms-overflow-style: none; }
        html::-webkit-scrollbar, body::-webkit-scrollbar, #root::-webkit-scrollbar, *::-webkit-scrollbar { display: none; width: 0; height: 0; }
        * { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>
      <Loader2 className="animate-spin" size={36} style={{ color: '#0ea5e9' }} />
      <p className="text-[10px] font-black uppercase tracking-[.2em]" style={{ color: textSec }}>
        Syncing dashboard…
      </p>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif" }}>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');`}</style>

      {/* Navbar is outside the theme wrapper — never affected by dark/light toggle */}
      <EntrepreneurNavbar />

      {/* Themed content wrapper — only content below navbar changes */}
      <div className="min-h-screen transition-colors duration-300" style={{ background: bg }}>

        {/* dot grid — clipped below navbar */}
        <div className="fixed top-[62px] left-0 right-0 bottom-0 pointer-events-none z-0" style={{
          backgroundImage: `radial-gradient(circle, ${isDark ? 'rgba(14,165,233,0.07)' : 'rgba(14,165,233,0.12)'} 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }} />

        <main className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16">

          {/* ── Hero Header ──────────────────────────────────────────────────── */}
          <motion.header
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .45, ease: [.22, 1, .36, 1] }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">

            <div>
              {/* greeting chip */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
                style={{ background: isDark ? 'rgba(14,165,233,0.10)' : 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.18)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[.18em] text-sky-400">Dashboard</span>
              </div>
              <h1 className="text-[2.4rem] font-black leading-none mb-2"
                style={{ color: textPri, letterSpacing: '-0.03em' }}>
                Welcome back,{' '}
                <span style={{ color: '#0ea5e9' }}>{firstName}</span>
              </h1>
              <p className="text-[14px] font-medium" style={{ color: textSec }}>
                Your startup ecosystem is live — here's today's snapshot.
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 8px 32px rgba(14,165,233,0.40)' }}
              whileTap={{ scale: .97 }}
              onClick={() => navigate('/entrepreneur/submit-idea')}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-black text-[12px] uppercase tracking-widest text-white shrink-0 transition-all"
              style={{
                background: 'linear-gradient(135deg,#0284c7,#0ea5e9,#38bdf8)',
                boxShadow: '0 4px 24px rgba(14,165,233,0.35)',
              }}>
              <PlusCircle size={16} />
              Submit New Venture
            </motion.button>
          </motion.header>

          {/* ── Error ─────────────────────────────────────────────────────────── */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="mb-8 p-4 rounded-2xl flex items-center gap-3"
                style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.18)' }}>
                <AlertCircle size={16} style={{ color: '#f43f5e' }} />
                <p className="text-[12px] font-bold" style={{ color: '#f43f5e' }}>{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Stat Cards ────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <StatCard
              label="Ideas Submitted" value={dashboardData.ideasCount}
              icon={<Lightbulb />} accent="#f59e0b" delay={0.08} isDark={isDark}
              onClick={() => navigate('/entrepreneur/my-submissions')}
            />
            <StatCard
              label="Available Mentors" value={dashboardData.mentorsCount}
              icon={<Users />} accent="#0ea5e9" delay={0.14} isDark={isDark}
              onClick={() => navigate('/entrepreneur/opportunities')}
            />
          </div>

          {/* ── Main Grid ─────────────────────────────────────────────────────── */}
          <div className="grid lg:grid-cols-3 gap-6">

            {/* Recent Submissions */}
            <motion.div className="lg:col-span-2 rounded-2xl overflow-hidden"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: .18, ease: [.22, 1, .36, 1] }}
              style={{ background: card, border: `1px solid ${border}`, boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.25)' : '0 4px 24px rgba(0,0,0,0.05)' }}>

              {/* Card header */}
              <div className="flex items-center justify-between px-6 py-4"
                style={{ borderBottom: `1px solid ${divider}` }}>
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(14,165,233,0.12)' }}>
                    <Rocket size={13} style={{ color: '#0ea5e9' }} />
                  </div>
                  <span className="text-[13px] font-black" style={{ color: textPri }}>Recent Venture Proposals</span>
                </div>
                <button onClick={() => navigate('/entrepreneur/my-submissions')}
                  className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest transition-colors"
                  style={{ color: '#0ea5e9' }}>
                  View All <ChevronRight size={12} />
                </button>
              </div>

              {/* Submissions list */}
              <div className="p-4">
                <AnimatePresence>
                  {dashboardData.recentSubmissions?.length > 0 ? (
                    <div className="space-y-2">
                      {dashboardData.recentSubmissions.map((sub, idx) => (
                        <motion.div key={sub._id}
                          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.06 }}
                          whileHover={{ x: 3, transition: { duration: .15 } }}
                          onClick={() => navigate('/entrepreneur/my-submissions')}
                          className="flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all group"
                          style={{ background: 'transparent' }}
                          onMouseEnter={e => e.currentTarget.style.background = rowHov}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>

                          <div className="flex items-center gap-4">
                            {/* index badge */}
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-[11px] font-black"
                              style={{ background: isDark ? 'rgba(14,165,233,0.10)' : 'rgba(14,165,233,0.08)', color: '#0ea5e9' }}>
                              {idx + 1}
                            </div>
                            <div>
                              <p className="text-[13px] font-bold capitalize" style={{ color: textPri }}>
                                Venture in {sub.address || 'Unknown Location'}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <Calendar size={10} style={{ color: textSec }} />
                                <span className="text-[10px] font-medium" style={{ color: textSec }}>
                                  {new Date(sub.submissionDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </span>
                                <span style={{ color: textSec }}>·</span>
                                <span className="text-[10px] font-medium" style={{ color: textSec }}>
                                  #{sub._id.slice(-6)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <StatusBadge status={sub.status || 'Pending'} />
                            <ChevronRight size={13} style={{ color: isDark ? '#334155' : '#cbd5e1' }}
                              className="group-hover:text-sky-400 transition-colors" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                        style={{ background: isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc' }}>
                        <Rocket size={24} style={{ color: isDark ? '#1e293b' : '#e2e8f0' }} />
                      </div>
                      <p className="text-[13px] font-medium mb-3" style={{ color: textSec }}>
                        No ventures submitted yet.
                      </p>
                      <button onClick={() => navigate('/entrepreneur/submit-idea')}
                        className="text-[11px] font-black uppercase tracking-widest transition-colors"
                        style={{ color: '#0ea5e9' }}>
                        Launch your first venture →
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* ── Sidebar ──────────────────────────────────────────────────────── */}
            <div className="space-y-4">

              {/* CTA Card */}
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: .22 }}
                whileHover={{ y: -3, transition: { duration: .2 } }}
                className="relative rounded-2xl p-6 overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg,#0284c7 0%,#0ea5e9 55%,#38bdf8 100%)',
                  boxShadow: '0 8px 32px rgba(14,165,233,0.35)',
                }}>
                {/* bg decoration */}
                <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full opacity-[0.12]"
                  style={{ background: 'white', filter: 'blur(20px)' }} />
                <TrendingUp className="absolute right-4 bottom-4 opacity-10" size={80} color="white" />

                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={13} color="rgba(255,255,255,0.7)" />
                    <span className="text-[9px] font-black uppercase tracking-[.18em] text-white/70">Mentor Network</span>
                  </div>
                  <h3 className="text-[18px] font-black text-white leading-tight mb-2"
                    style={{ letterSpacing: '-0.02em' }}>
                    Scale your vision.
                  </h3>
                  <p className="text-[12px] text-white/70 leading-relaxed mb-5">
                    Connect with industry leaders ready to guide your startup journey.
                  </p>
                  <button onClick={() => navigate('/entrepreneur/opportunities')}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                    style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)' }}>
                    Browse Mentors <ArrowUpRight size={11} />
                  </button>
                </div>
              </motion.div>

              {/* Founder Tip */}
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: .28 }}
                className="rounded-2xl p-6"
                style={{ background: card, border: `1px solid ${border}`, boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.2)' : '0 4px 24px rgba(0,0,0,0.04)' }}>

                <div className="flex items-center gap-2 mb-4">
                  <Target size={13} style={{ color: '#0ea5e9' }} />
                  <span className="text-[9px] font-black uppercase tracking-[.18em]" style={{ color: textSec }}>
                    Founder Tip
                  </span>
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>

                <blockquote className="text-[12.5px] leading-relaxed font-medium mb-5"
                  style={{ color: textMid, borderLeft: `2px solid #0ea5e9`, paddingLeft: '12px' }}>
                  "Focus on solving a specific problem for a specific group of people. Don't try to build everything at once."
                </blockquote>

                <div className="flex items-center gap-3 pt-4"
                  style={{ borderTop: `1px solid ${divider}` }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(14,165,233,0.10)' }}>
                    <Clock size={13} style={{ color: '#0ea5e9' }} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: textPri }}>Growth Protocol</p>
                    <p className="text-[9px] font-medium" style={{ color: textSec }}>Updated Daily</p>
                  </div>
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: .32 }}
                className="rounded-2xl p-6"
                style={{ background: card, border: `1px solid ${border}`, boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.2)' : '0 4px 24px rgba(0,0,0,0.04)' }}>

                <p className="text-[9px] font-black uppercase tracking-[.18em] mb-4" style={{ color: textSec }}>
                  Quick Actions
                </p>
                <div className="space-y-2">
                  {[
                    { label: 'Submit a new idea', path: '/entrepreneur/submit-idea', icon: <PlusCircle size={13} /> },
                    { label: 'View my submissions', path: '/entrepreneur/my-submissions', icon: <Rocket size={13} /> },
                    { label: 'Browse opportunities', path: '/entrepreneur/opportunities', icon: <Lightbulb size={13} /> },
                  ].map(({ label, path, icon }) => (
                    <button key={path} onClick={() => navigate(path)}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[11px] font-bold transition-all group"
                      style={{ color: textMid, background: 'transparent' }}
                      onMouseEnter={e => { e.currentTarget.style.background = rowHov; e.currentTarget.style.color = '#0ea5e9'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = textMid; }}>
                      <span className="flex items-center gap-2.5">
                        {icon} {label}
                      </span>
                      <ChevronRight size={11} />
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EntrepreneurHome;