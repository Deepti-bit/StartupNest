import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../Services/api';
import {
  Search, Lightbulb, ArrowUpRight, CheckCircle2,
  Loader2, SlidersHorizontal, X, TrendingUp, IndianRupee, ChevronDown
} from 'lucide-react';
import EntrepreneurNavbar from './EntrepreneurNavbar';

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
            initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 60 }}
            className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl min-w-[240px]"
            style={{
              background: t.type === 'success' ? 'linear-gradient(135deg,#ecfdf5,#d1fae5)' : 'linear-gradient(135deg,#fff1f2,#ffe4e6)',
              border: `1px solid ${t.type === 'success' ? '#6ee7b7' : '#fca5a5'}`,
            }}>
            <span style={{ color: t.type === 'success' ? '#065f46' : '#991b1b', fontSize: 14 }}>
              {t.type === 'success' ? '✓' : '✕'}
            </span>
            <p className="flex-1 text-[12px] font-semibold"
              style={{ color: t.type === 'success' ? '#065f46' : '#991b1b' }}>{t.message}</p>
            <button onClick={() => remove(t.id)} className="opacity-40 hover:opacity-80"><X size={11} /></button>
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

/* ─── Custom Dropdown ─── */
function CustomDropdown({ value, onChange, options, isDark, textSec, inputBg, inputBdr }) {
  const [open, setOpen] = useState(false);
  const ref = React.useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const active = value !== 'All';
  const dropBg = isDark ? '#0d1628' : '#ffffff';
  const dropBdr = isDark ? 'rgba(14,165,233,0.15)' : 'rgba(0,0,0,0.10)';
  const hoverBg = isDark ? 'rgba(14,165,233,0.08)' : 'rgba(14,165,233,0.06)';
  const activeBg = isDark ? 'rgba(14,165,233,0.15)' : 'rgba(14,165,233,0.10)';
  const textPri = isDark ? '#f1f5f9' : '#0a1628';

  return (
    <div ref={ref} className="relative min-w-[180px]">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-2.5 pl-3.5 pr-3 py-3 rounded-2xl text-[12px] font-bold outline-none transition-all duration-200"
        style={{
          background: inputBg,
          border: `1px solid ${active ? '#0ea5e9' : open ? '#0ea5e9' : inputBdr}`,
          color: active ? '#0ea5e9' : textSec,
          boxShadow: (active || open) ? '0 0 0 3px rgba(14,165,233,0.12)' : 'none',
        }}>
        <SlidersHorizontal size={13} style={{ color: active ? '#0ea5e9' : textSec, flexShrink: 0 }} />
        <span className="flex-1 text-left truncate">{value === 'All' ? 'All Industries' : value}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: .2 }}>
          <ChevronDown size={13} style={{ color: textSec }} />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: .97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: .97 }}
            transition={{ duration: .16, ease: [.22, 1, .36, 1] }}
            className="absolute right-0 top-[calc(100%+6px)] w-full min-w-[180px] rounded-2xl overflow-hidden z-50"
            style={{
              background: dropBg,
              border: `1px solid ${dropBdr}`,
              boxShadow: isDark
                ? '0 16px 48px rgba(0,0,0,0.5), 0 4px 12px rgba(14,165,233,0.08)'
                : '0 16px 48px rgba(0,0,0,0.12)',
            }}>
            {options.map(opt => {
              const selected = value === opt;
              return (
                <button
                  key={opt}
                  onClick={() => { onChange(opt); setOpen(false); }}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-[12px] font-bold text-left transition-all"
                  style={{
                    background: selected ? activeBg : 'transparent',
                    color: selected ? '#0ea5e9' : textPri,
                  }}
                  onMouseEnter={e => { if (!selected) e.currentTarget.style.background = hoverBg; }}
                  onMouseLeave={e => { if (!selected) e.currentTarget.style.background = 'transparent'; }}>
                  <span>{opt === 'All' ? 'All Industries' : opt}</span>
                  {selected && <CheckCircle2 size={12} style={{ color: '#0ea5e9' }} />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════════════ */
const ViewStartupOpportunities = () => {
  const navigate = useNavigate();
  const isDark = useTheme();

  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [opportunities, setOpportunities] = useState([]);
  const [submittedProfileIds, setSubmittedProfileIds] = useState([]);

  const userId = localStorage.getItem('userId');

  // ── theme tokens ─────────────────────────────────────────────────────────
  const bg = isDark ? '#080c14' : '#f0f4f8';
  const card = isDark ? '#0d1628' : '#ffffff';
  const border = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const textPri = isDark ? '#f1f5f9' : '#0a1628';
  const textSec = isDark ? '#64748b' : '#94a3b8';
  const textMid = isDark ? '#94a3b8' : '#475569';
  const inputBg = isDark ? 'rgba(255,255,255,0.04)' : '#ffffff';
  const inputBdr = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const rowHov = isDark ? 'rgba(14,165,233,0.04)' : 'rgba(14,165,233,0.03)';
  const divider = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const thBg = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)';

  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const profilesRes = await api.get('/startupProfile/getAllStartupProfiles');
      setOpportunities(Array.isArray(profilesRes.data) ? profilesRes.data : []);
      if (userId) {
        try {
          const subsRes = await api.get(`/startupSubmission/getSubmissionsByUserId/${userId}`);
          setSubmittedProfileIds((subsRes.data || []).map(s => s.startupProfileId));
        } catch { /* submissions failing shouldn't break page */ }
      }
    } catch (err) {
      console.error('Fetch error:', err);
      toast('Failed to load opportunities.', 'error');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { fetchInitialData(); }, [fetchInitialData]);

  const industries = ['All', ...new Set(opportunities.map(o => o.targetIndustry).filter(Boolean))];

  const filtered = opportunities.filter(opp => {
    const q = searchTerm.toLowerCase();
    const matchSearch = !searchTerm ||
      opp.category?.toLowerCase().includes(q) ||
      opp.targetIndustry?.toLowerCase().includes(q) ||
      opp.description?.toLowerCase().includes(q) ||
      opp.mentorName?.toLowerCase().includes(q);
    const matchIndustry = industryFilter === 'All' || opp.targetIndustry === industryFilter;
    return matchSearch && matchIndustry;
  });

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4"
      style={{ background: bg, fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        html,body,#root,*{scrollbar-width:none;-ms-overflow-style:none;}*::-webkit-scrollbar{display:none;width:0;}`}</style>
      <Loader2 className="animate-spin" size={32} style={{ color: '#0ea5e9' }} />
      <p className="text-[10px] font-black uppercase tracking-[.2em]" style={{ color: textSec }}>Loading Opportunities…</p>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        html,body,#root,*{scrollbar-width:none;-ms-overflow-style:none;}
        *::-webkit-scrollbar{display:none;width:0;height:0;}
        .sn-input::placeholder{color:${isDark ? '#475569' : '#94a3b8'};}
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

          {/* ── Header ─────────────────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .4, ease: [.22, 1, .36, 1] }} className="mb-8">

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
              style={{ background: isDark ? 'rgba(14,165,233,0.10)' : 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.18)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[.18em] text-sky-400">Opportunities</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-[2.2rem] font-black leading-none mb-2"
                  style={{ color: textPri, letterSpacing: '-0.03em' }}>
                  Entrepreneur <span style={{ color: '#0ea5e9' }}>Opportunities</span>
                </h1>
                <p className="text-[14px] font-medium" style={{ color: textSec }}>
                  Explore profiles and pitch your vision to the right mentors.
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl shrink-0"
                style={{ background: card, border: `1px solid ${border}` }}>
                <Lightbulb size={14} style={{ color: '#0ea5e9' }} />
                <span className="text-[13px] font-black" style={{ color: textPri }}>{filtered.length}</span>
                <span className="text-[11px] font-medium" style={{ color: textSec }}>
                  {filtered.length === 1 ? 'opportunity' : 'opportunities'}
                </span>
              </div>
            </div>
          </motion.div>

          {/* ── Search + Filter ─────────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .1 }} className="flex flex-col sm:flex-row gap-3 mb-6">

            {/* Search */}
            <div className="relative flex-1">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2"
                style={{ color: isDark ? '#475569' : '#94a3b8' }} />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg"
                  style={{ color: textSec }}>
                  <X size={13} />
                </button>
              )}
              <input
                type="text" value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search category, industry, mentor…"
                className="sn-input w-full pl-11 pr-9 py-3 rounded-2xl text-[13px] font-medium outline-none transition-all duration-200"
                style={{
                  background: inputBg,
                  border: `1px solid ${searchTerm ? '#0ea5e9' : inputBdr}`,
                  color: textPri,
                  boxShadow: searchTerm ? '0 0 0 3px rgba(14,165,233,0.12)' : 'none',
                }}
              />
            </div>

            {/* Custom Dropdown */}
            <CustomDropdown
              value={industryFilter}
              onChange={setIndustryFilter}
              options={industries}
              isDark={isDark}
              textSec={textSec}
              inputBg={inputBg}
              inputBdr={inputBdr}
            />
          </motion.div>

          {/* Active filter chips */}
          <AnimatePresence>
            {(searchTerm || industryFilter !== 'All') && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }} className="flex items-center gap-2 mb-5 flex-wrap overflow-hidden">
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: textSec }}>Active:</span>
                {searchTerm && (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold"
                    style={{ background: 'rgba(14,165,233,0.10)', color: '#0ea5e9', border: '1px solid rgba(14,165,233,0.20)' }}>
                    "{searchTerm}" <button onClick={() => setSearchTerm('')}><X size={9} /></button>
                  </span>
                )}
                {industryFilter !== 'All' && (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold"
                    style={{ background: 'rgba(14,165,233,0.10)', color: '#0ea5e9', border: '1px solid rgba(14,165,233,0.20)' }}>
                    {industryFilter} <button onClick={() => setIndustryFilter('All')}><X size={9} /></button>
                  </span>
                )}
                <button onClick={() => { setSearchTerm(''); setIndustryFilter('All'); }}
                  className="text-[10px] font-bold"
                  style={{ color: textSec }}
                  onMouseEnter={e => e.currentTarget.style.color = '#f43f5e'}
                  onMouseLeave={e => e.currentTarget.style.color = textSec}>
                  Clear all
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Table ──────────────────────────────────────────────────────── */}
          <AnimatePresence mode="wait">
            {filtered.length > 0 ? (
              <motion.div key="table"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }} transition={{ delay: .15 }}
                className="rounded-2xl overflow-hidden"
                style={{ background: card, border: `1px solid ${border}`, boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.25)' : '0 4px 24px rgba(0,0,0,0.06)' }}>

                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr style={{ background: thBg, borderBottom: `1px solid ${divider}` }}>
                      {['#', 'Category', 'Industry', 'Mentor', 'Funding Limit', 'Description', 'Status', 'Action'].map(h => (
                        <th key={h} className="px-5 py-4 text-[9px] font-black uppercase tracking-[.15em]"
                          style={{ color: textSec, whiteSpace: 'nowrap' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((opp, idx) => {
                      const isSubmitted = submittedProfileIds.includes(opp._id);
                      return (
                        <motion.tr key={opp._id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.04 }}
                          style={{ borderBottom: idx < filtered.length - 1 ? `1px solid ${divider}` : 'none' }}
                          onMouseEnter={e => e.currentTarget.style.background = rowHov}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>

                          {/* # */}
                          <td className="px-5 py-4">
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black"
                              style={{ background: isDark ? 'rgba(14,165,233,0.10)' : 'rgba(14,165,233,0.08)', color: '#0ea5e9' }}>
                              {idx + 1}
                            </div>
                          </td>

                          {/* Category */}
                          <td className="px-5 py-4">
                            <span className="text-[13px] font-black" style={{ color: textPri }}>
                              {opp.category || '—'}
                            </span>
                          </td>

                          {/* Industry */}
                          <td className="px-5 py-4">
                            <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide"
                              style={{ background: isDark ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.08)', color: '#6366f1' }}>
                              {opp.targetIndustry || 'General'}
                            </span>
                          </td>

                          {/* Mentor */}
                          <td className="px-5 py-4">
                            <span className="text-[12px] font-bold" style={{ color: '#0ea5e9' }}>
                              {opp.mentorName || 'Mentor'}
                            </span>
                          </td>

                          {/* Funding */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1">
                              <IndianRupee size={11} style={{ color: '#10b981' }} />
                              <span className="text-[13px] font-black" style={{ color: textPri }}>
                                {opp.fundingLimit ? `${(opp.fundingLimit / 100000).toFixed(1)}L` : '0.0L'}
                              </span>
                            </div>
                          </td>

                          {/* Description */}
                          <td className="px-5 py-4 max-w-[200px]">
                            <p className="text-[11px] font-medium leading-relaxed line-clamp-2"
                              style={{ color: textMid }}>
                              {opp.description || '—'}
                            </p>
                          </td>

                          {/* Status */}
                          <td className="px-5 py-4">
                            {isSubmitted ? (
                              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full w-fit"
                                style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.20)' }}>
                                <CheckCircle2 size={10} style={{ color: '#10b981' }} />
                                <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#10b981' }}>Applied</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full w-fit"
                                style={{ background: 'rgba(14,165,233,0.10)', border: '1px solid rgba(14,165,233,0.18)' }}>
                                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-sky-400">Open</span>
                              </div>
                            )}
                          </td>

                          {/* Action */}
                          <td className="px-5 py-4">
                            <motion.button
                              whileHover={!isSubmitted ? { scale: 1.04 } : {}}
                              whileTap={!isSubmitted ? { scale: .96 } : {}}
                              disabled={isSubmitted}
                              onClick={() => !isSubmitted && navigate(`/entrepreneur/submit-idea/${opp._id}`, { state: { mentorData: opp } })}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap"
                              style={isSubmitted ? {
                                background: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
                                color: textSec, cursor: 'not-allowed',
                              } : {
                                background: 'linear-gradient(135deg,#0284c7,#0ea5e9)',
                                color: '#ffffff',
                                boxShadow: '0 4px 14px rgba(14,165,233,0.30)',
                              }}>
                              {isSubmitted
                                ? <><CheckCircle2 size={11} /> Submitted</>
                                : <>Submit Idea <ArrowUpRight size={11} /></>}
                            </motion.button>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </motion.div>
            ) : (
              <motion.div key="empty"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-24 rounded-2xl"
                style={{ background: card, border: `1px solid ${border}` }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: isDark ? 'rgba(14,165,233,0.08)' : 'rgba(14,165,233,0.06)' }}>
                  <Lightbulb size={28} style={{ color: isDark ? '#1e3a5f' : '#bfdbfe' }} />
                </div>
                <p className="text-[14px] font-bold mb-2" style={{ color: textPri }}>No opportunities found</p>
                <p className="text-[12px] font-medium mb-5" style={{ color: textSec }}>Try adjusting your search or filter</p>
                <button onClick={() => { setSearchTerm(''); setIndustryFilter('All'); }}
                  className="px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest text-white"
                  style={{ background: 'linear-gradient(135deg,#0284c7,#0ea5e9)' }}>
                  Clear Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default ViewStartupOpportunities;