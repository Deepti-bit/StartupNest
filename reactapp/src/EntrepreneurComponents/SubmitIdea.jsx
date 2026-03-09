/**
 * SubmitIdea.jsx — StartupNest
 * Themed to match EntrepreneurHome: dark/light sync, sky-400 accents,
 * Plus Jakarta Sans, clean form with animations and validation UX.
 */

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Rocket, ArrowLeft, UploadCloud, IndianRupee, MapPin,
  TrendingUp, CalendarDays, FileCheck, Loader2, CheckCircle2,
  AlertCircle, X, Sparkles
} from 'lucide-react';
import EntrepreneurNavbar from './EntrepreneurNavbar';
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
            initial={{ opacity: 0, x: 60, scale: .92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: .92 }}
            transition={{ duration: .25, ease: [.22, 1, .36, 1] }}
            className="pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-2xl shadow-xl min-w-[260px] max-w-[340px]"
            style={{
              background: t.type === 'success' ? 'linear-gradient(135deg,#ecfdf5,#d1fae5)' : 'linear-gradient(135deg,#fff1f2,#ffe4e6)',
              border: `1px solid ${t.type === 'success' ? '#6ee7b7' : '#fca5a5'}`,
            }}>
            <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-[13px]"
              style={{ background: t.type === 'success' ? 'rgba(16,185,129,.15)' : 'rgba(239,68,68,.15)' }}>
              {t.type === 'success' ? '✓' : '✕'}
            </div>
            <p className="flex-1 text-[12px] font-semibold leading-snug"
              style={{ color: t.type === 'success' ? '#065f46' : '#991b1b' }}>{t.message}</p>
            <button onClick={() => remove(t.id)} className="opacity-40 hover:opacity-80 mt-0.5">
              <X size={11} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
function toast(message, type = 'error', duration = 4000) {
  if (!_setToasts) return;
  const id = Date.now() + Math.random();
  _setToasts(p => [...p, { id, message, type }]);
  setTimeout(() => _setToasts(p => p.filter(t => t.id !== id)), duration);
}

/* ─── Styled Field wrapper ─── */
function Field({ label, error, icon, children, hint }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-black uppercase tracking-[.16em] flex items-center gap-1.5"
        style={{ color: '#64748b' }}>
        {icon && React.cloneElement(icon, { size: 11 })}
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-1.5 text-[10px] font-bold"
            style={{ color: '#f43f5e' }}>
            <AlertCircle size={10} /> {error}
          </motion.p>
        )}
        {hint && !error && (
          <p className="text-[10px] font-medium" style={{ color: '#64748b' }}>{hint}</p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════════════ */
const SubmitIdea = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mentorId } = useParams();
  const isDark = useTheme();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [mentorData, setMentorData] = useState(location.state?.mentorData || null);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (!mentorData && mentorId) {
      api.get(`/startupProfile/getStartupProfileById/${mentorId}`)
        .then(res => setMentorData(res.data))
        .catch(() => toast('Could not fetch mentor details.', 'error'));
    }
  }, [mentorId, mentorData]);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({ mode: 'onChange' });
  const pitchFile = watch('pitchDeck');

  const onSubmit = async (data) => {
    if (mentorData && Number(data.expectedFunding) > Number(mentorData.fundingLimit)) {
      toast(`Budget exceeds mentor's limit of ₹${Number(mentorData.fundingLimit).toLocaleString()}`, 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('marketPotential', data.marketPotential);
      fd.append('expectedFunding', data.expectedFunding);
      fd.append('launchYear', data.launchYear);
      fd.append('address', data.address);
      fd.append('startupProfileId', mentorData?._id);
      fd.append('userName', localStorage.getItem('userName'));
      if (data.pitchDeck?.[0]) fd.append('pitchDeckFile', data.pitchDeck[0]);

      await api.post('/startupSubmission/addStartupSubmission', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setShowSuccess(true);
    } catch (err) {
      toast(err.response?.data?.message || 'Submission failed. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── theme tokens ──────────────────────────────────────────────────────────
  const bg = isDark ? '#080c14' : '#f0f4f8';
  const card = isDark ? '#0d1628' : '#ffffff';
  const border = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)';
  const textPri = isDark ? '#f1f5f9' : '#0a1628';
  const textSec = isDark ? '#64748b' : '#94a3b8';
  const inputBg = isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc';
  const inputBdr = isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.09)';
  const focusStyle = {
    borderColor: '#0ea5e9',
    boxShadow: '0 0 0 3px rgba(14,165,233,0.14)',
    background: isDark ? 'rgba(14,165,233,0.05)' : 'rgba(14,165,233,0.03)',
  };

  const inputBase = {
    background: inputBg,
    border: `1.5px solid ${inputBdr}`,
    color: textPri,
    outline: 'none',
    transition: 'all 0.2s',
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
  };

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        html,body,#root,*{scrollbar-width:none;-ms-overflow-style:none;}
        *::-webkit-scrollbar{display:none;width:0;height:0;}
        .sn-input::placeholder{color:${isDark ? '#334155' : '#cbd5e1'}!important;}
        .sn-input:focus{border-color:#0ea5e9!important;box-shadow:0 0 0 3px rgba(14,165,233,0.14)!important;background:${isDark ? 'rgba(14,165,233,0.05)' : 'rgba(14,165,233,0.03)'}!important;}
        .sn-input::-webkit-calendar-picker-indicator{filter:${isDark ? 'invert(1) opacity(0.4)' : 'opacity(0.5)'};}
      `}</style>

      <ToastContainer />
      <EntrepreneurNavbar />

      <div className="min-h-screen transition-colors duration-300" style={{ background: bg }}>

        {/* dot grid */}
        <div className="fixed top-[62px] left-0 right-0 bottom-0 pointer-events-none z-0" style={{
          backgroundImage: `radial-gradient(circle, ${isDark ? 'rgba(14,165,233,0.07)' : 'rgba(14,165,233,0.12)'} 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }} />

        <main className="relative z-10 max-w-3xl mx-auto px-6 pt-24 pb-16">

          {/* Back button */}
          <motion.button
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-8 text-[11px] font-black uppercase tracking-widest transition-colors"
            style={{ color: textSec }}
            onMouseEnter={e => e.currentTarget.style.color = '#0ea5e9'}
            onMouseLeave={e => e.currentTarget.style.color = textSec}>
            <ArrowLeft size={14} /> Back to Opportunities
          </motion.button>

          {/* ── Main Card ─────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .4, ease: [.22, 1, .36, 1] }}
            className="rounded-3xl overflow-hidden"
            style={{
              background: card,
              border: `1px solid ${border}`,
              boxShadow: isDark ? '0 8px 48px rgba(0,0,0,0.40)' : '0 8px 48px rgba(0,0,0,0.08)',
            }}>

            {/* Card header */}
            <div className="relative px-8 py-7 overflow-hidden"
              style={{ background: 'linear-gradient(135deg,#0284c7 0%,#0ea5e9 55%,#38bdf8 100%)' }}>

              {/* bg decoration */}
              <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full opacity-10"
                style={{ background: 'white', filter: 'blur(24px)' }} />
              <div className="absolute right-8 bottom-0 opacity-[0.08]">
                <Rocket size={100} color="white" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={13} color="rgba(255,255,255,0.7)" />
                  <span className="text-[9px] font-black uppercase tracking-[.2em] text-white/70">Startup Submission</span>
                </div>
                <h1 className="text-[1.8rem] font-black text-white leading-tight mb-1.5"
                  style={{ letterSpacing: '-0.025em' }}>
                  Pitch to{' '}
                  <span className="relative">
                    <span className="relative z-10">{mentorData?.category || 'Mentor'}</span>
                    <span className="absolute bottom-0 left-0 w-full h-[3px] rounded-full"
                      style={{ background: 'rgba(255,255,255,0.35)' }} />
                  </span>
                </h1>
                <p className="text-[13px] text-white/65 font-medium">
                  Fill in your startup details to submit your proposal for evaluation.
                </p>
              </div>

              {/* mentor info chips */}
              {mentorData && (
                <div className="relative z-10 flex flex-wrap gap-2 mt-5">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
                    <IndianRupee size={10} color="white" />
                    <span className="text-[10px] font-black text-white">
                      Up to ₹{Number(mentorData.fundingLimit || 0).toLocaleString()}
                    </span>
                  </div>
                  {mentorData.targetIndustry && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                      style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
                      <span className="text-[10px] font-black text-white">{mentorData.targetIndustry}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── Form ──────────────────────────────────────────────────────── */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                {/* Incubation Category — readonly */}
                <Field label="Incubation Category" icon={<Rocket />}>
                  <div className="px-4 py-3.5 rounded-2xl text-[13px] font-bold flex items-center gap-2"
                    style={{
                      background: isDark ? 'rgba(14,165,233,0.08)' : 'rgba(14,165,233,0.06)',
                      border: '1.5px solid rgba(14,165,233,0.18)',
                      color: '#0ea5e9',
                    }}>
                    <CheckCircle2 size={13} />
                    {mentorData?.category || 'Loading…'}
                  </div>
                </Field>

                {/* Expected Funding */}
                <Field
                  label={`Expected Funding`}
                  icon={<IndianRupee />}
                  error={errors.expectedFunding?.message}
                  hint={mentorData ? `Max: ₹${Number(mentorData.fundingLimit || 0).toLocaleString()}` : undefined}>
                  <div className="relative">
                    <IndianRupee size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: textSec }} />
                    <input
                      {...register('expectedFunding', {
                        required: 'Expected funding is required',
                        min: { value: 1, message: 'Must be greater than 0' },
                        validate: v => !mentorData || Number(v) <= Number(mentorData.fundingLimit) || `Exceeds limit of ₹${Number(mentorData.fundingLimit).toLocaleString()}`
                      })}
                      type="number"
                      placeholder="Enter amount"
                      className="sn-input w-full pl-9 pr-4 py-3.5 rounded-2xl text-[13px] font-bold"
                      style={{ ...inputBase, borderColor: errors.expectedFunding ? '#f43f5e' : inputBdr }}
                    />
                  </div>
                </Field>

                {/* Market Potential */}
                <Field label="Market Potential (0–100)" icon={<TrendingUp />}
                  error={errors.marketPotential?.message}>
                  <input
                    {...register('marketPotential', {
                      required: 'Required',
                      min: { value: 1, message: 'Minimum 1' },
                      max: { value: 100, message: 'Maximum 100' }
                    })}
                    type="number"
                    placeholder="e.g. 85"
                    className="sn-input w-full px-4 py-3.5 rounded-2xl text-[13px] font-bold"
                    style={{ ...inputBase, borderColor: errors.marketPotential ? '#f43f5e' : inputBdr }}
                  />
                </Field>

                {/* Launch Date */}
                <Field label="Launch Date" icon={<CalendarDays />}
                  error={errors.launchYear?.message}>
                  <input
                    {...register('launchYear', { required: 'Launch date is required' })}
                    type="date"
                    className="sn-input w-full px-4 py-3.5 rounded-2xl text-[13px] font-bold"
                    style={{ ...inputBase, borderColor: errors.launchYear ? '#f43f5e' : inputBdr }}
                  />
                </Field>

                {/* Business Address — full width */}
                <div className="md:col-span-2">
                  <Field label="Business Address" icon={<MapPin />}
                    error={errors.address?.message}>
                    <input
                      {...register('address', { required: 'Business address is required' })}
                      type="text"
                      placeholder="Enter your registered business address"
                      className="sn-input w-full px-4 py-3.5 rounded-2xl text-[13px] font-bold"
                      style={{ ...inputBase, borderColor: errors.address ? '#f43f5e' : inputBdr }}
                    />
                  </Field>
                </div>
              </div>

              {/* ── Pitch Deck Upload ──────────────────────────────────────── */}
              <div className="mb-7">
                <label className="block text-[10px] font-black uppercase tracking-[.16em] mb-2"
                  style={{ color: textSec }}>
                  Pitch Deck (PDF Only)
                </label>

                <div
                  className="relative rounded-2xl transition-all duration-200"
                  style={{
                    border: `2px dashed ${dragOver ? '#0ea5e9' : errors.pitchDeck ? '#f43f5e' : pitchFile?.[0] ? '#10b981' : isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
                    background: dragOver
                      ? isDark ? 'rgba(14,165,233,0.06)' : 'rgba(14,165,233,0.04)'
                      : pitchFile?.[0]
                        ? isDark ? 'rgba(16,185,129,0.06)' : 'rgba(16,185,129,0.04)'
                        : inputBg,
                    boxShadow: dragOver ? '0 0 0 4px rgba(14,165,233,0.12)' : 'none',
                  }}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => {
                    e.preventDefault(); setDragOver(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file?.type === 'application/pdf') setValue('pitchDeck', e.dataTransfer.files);
                  }}>

                  <input
                    {...register('pitchDeck', { required: 'Pitch deck PDF is required' })}
                    type="file" accept=".pdf"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />

                  <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
                    <motion.div
                      animate={{ y: pitchFile?.[0] ? 0 : [0, -4, 0] }}
                      transition={{ repeat: pitchFile?.[0] ? 0 : Infinity, duration: 2, ease: 'easeInOut' }}
                      className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                      style={{
                        background: pitchFile?.[0]
                          ? 'rgba(16,185,129,0.12)'
                          : isDark ? 'rgba(14,165,233,0.10)' : 'rgba(14,165,233,0.08)',
                      }}>
                      {pitchFile?.[0]
                        ? <CheckCircle2 size={22} style={{ color: '#10b981' }} />
                        : <UploadCloud size={22} style={{ color: '#0ea5e9' }} />
                      }
                    </motion.div>

                    {pitchFile?.[0] ? (
                      <>
                        <p className="text-[13px] font-black mb-0.5" style={{ color: '#10b981' }}>
                          {pitchFile[0].name}
                        </p>
                        <p className="text-[10px] font-medium" style={{ color: textSec }}>
                          {(pitchFile[0].size / 1024).toFixed(1)} KB · Click to replace
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-[13px] font-bold mb-1" style={{ color: textPri }}>
                          Drop your PDF here or <span style={{ color: '#0ea5e9' }}>browse</span>
                        </p>
                        <p className="text-[10px] font-medium" style={{ color: textSec }}>
                          PDF files only · Max 10MB
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {errors.pitchDeck && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="mt-1.5 flex items-center gap-1.5 text-[10px] font-bold"
                      style={{ color: '#f43f5e' }}>
                      <AlertCircle size={10} /> {errors.pitchDeck.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* ── Submit Button ──────────────────────────────────────────── */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={!isSubmitting ? { scale: 1.01, boxShadow: '0 8px 32px rgba(14,165,233,0.45)' } : {}}
                whileTap={!isSubmitting ? { scale: .98 } : {}}
                className="w-full py-4 rounded-2xl font-black text-[13px] uppercase tracking-widest text-white transition-all relative overflow-hidden"
                style={{
                  background: isSubmitting ? (isDark ? '#1e293b' : '#e2e8f0') : 'linear-gradient(135deg,#0284c7 0%,#0ea5e9 55%,#38bdf8 100%)',
                  boxShadow: isSubmitting ? 'none' : '0 4px 24px rgba(14,165,233,0.35)',
                  color: isSubmitting ? textSec : 'white',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                }}>

                {/* shimmer */}
                {!isSubmitting && (
                  <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
                    style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)', backgroundSize: '200% 100%' }} />
                )}

                <span className="relative flex items-center justify-center gap-2.5">
                  {isSubmitting ? (
                    <><Loader2 size={16} className="animate-spin" /> Processing…</>
                  ) : (
                    <><Rocket size={15} /> Submit Proposal</>
                  )}
                </span>
              </motion.button>

              <p className="text-center text-[10px] font-medium mt-4" style={{ color: textSec }}>
                Your submission will be reviewed by the mentor within 3–5 business days.
              </p>
            </form>
          </motion.div>
        </main>
      </div>

      {/* ── Success Modal ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showSuccess && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0"
              style={{ background: 'rgba(8,12,20,0.80)', backdropFilter: 'blur(10px)' }}
            />
            <motion.div
              initial={{ scale: .88, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: .88, opacity: 0, y: 24 }}
              transition={{ duration: .32, ease: [.22, 1, .36, 1] }}
              className="relative w-full max-w-sm rounded-3xl overflow-hidden text-center shadow-2xl"
              style={{
                background: isDark ? '#0d1628' : '#ffffff',
                border: `1px solid ${isDark ? 'rgba(14,165,233,0.15)' : 'rgba(14,165,233,0.12)'}`,
                boxShadow: isDark ? '0 32px 80px rgba(0,0,0,0.6)' : '0 32px 80px rgba(0,0,0,0.14)',
              }}>

              {/* top gradient bar */}
              <div className="h-1.5 w-full"
                style={{ background: 'linear-gradient(90deg,#0284c7,#0ea5e9,#38bdf8)' }} />

              <div className="px-8 py-8">
                {/* animated checkmark */}
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ delay: .15, type: 'spring', stiffness: 300, damping: 20 }}
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5"
                  style={{ background: 'rgba(16,185,129,0.12)', border: '2px solid rgba(16,185,129,0.20)' }}>
                  <FileCheck size={38} style={{ color: '#10b981' }} />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .25 }}>
                  <h2 className="text-[1.6rem] font-black mb-2" style={{ color: isDark ? '#f1f5f9' : '#0a1628', letterSpacing: '-0.025em' }}>
                    Proposal Sent! 🎉
                  </h2>
                  <p className="text-[13px] font-medium mb-7 leading-relaxed" style={{ color: isDark ? '#64748b' : '#94a3b8' }}>
                    Your startup pitch is now on the mentor's desk. You'll hear back within 3–5 business days.
                  </p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .32 }}
                  className="flex flex-col gap-3">
                  <button
                    onClick={() => navigate('/entrepreneur/my-submissions')}
                    className="w-full py-3.5 rounded-2xl font-black text-[12px] uppercase tracking-widest text-white transition-all active:scale-[.97]"
                    style={{ background: 'linear-gradient(135deg,#0284c7,#0ea5e9)', boxShadow: '0 4px 20px rgba(14,165,233,0.35)' }}>
                    View My Submissions
                  </button>
                  <button
                    onClick={() => navigate('/entrepreneur/opportunities')}
                    className="w-full py-3.5 rounded-2xl font-black text-[12px] uppercase tracking-widest transition-all active:scale-[.97]"
                    style={{
                      background: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
                      color: isDark ? '#94a3b8' : '#64748b',
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`,
                    }}>
                    Browse More Opportunities
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubmitIdea;