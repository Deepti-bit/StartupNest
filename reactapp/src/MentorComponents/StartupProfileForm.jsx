/**
 * StartupProfileForm.jsx — StartupNest Mentor
 * Enhanced with animated canvas particle background, floating orbs,
 * glassmorphism card, and full dark/light theme support.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tag, FileText, IndianRupee, TrendingUp, Building2,
  Rocket, CheckCircle2, Loader2, X, AlertCircle,
  Sparkles, ArrowLeft, Lightbulb, BarChart2, Target, Layers
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
            <span style={{ color: t.type === 'success' ? '#065f46' : '#991b1b', fontSize: 14 }}>{t.type === 'success' ? '✓' : '✕'}</span>
            <p className="flex-1 text-[12px] font-semibold leading-snug" style={{ color: t.type === 'success' ? '#065f46' : '#991b1b' }}>{t.message}</p>
            <button onClick={() => remove(t.id)} className="opacity-40"><X size={11} /></button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
function toast(message, type = 'success', duration = 4000) {
  if (!_setToasts) return;
  const id = Date.now() + Math.random();
  _setToasts(p => [...p, { id, message, type }]);
  setTimeout(() => _setToasts(p => p.filter(t => t.id !== id)), duration);
}

/* ─── Animated Particle Canvas ─── */
function ParticleCanvas({ isDark }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    const COUNT = 55;
    const color = isDark ? '14,165,233' : '2,132,199';
    const particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      vx: (Math.random() - .5) * 0.35,
      vy: (Math.random() - .5) * 0.35,
      alpha: Math.random() * 0.5 + 0.15,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${p.alpha})`;
        ctx.fill();
      });
      // draw connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${color},${(1 - dist / 120) * (isDark ? 0.12 : 0.08)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, [isDark]);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

/* ─── Floating Orbs ─── */
function FloatingOrbs({ isDark }) {
  const orbs = [
    { size: 320, x: '8%',  y: '12%', color: isDark ? 'rgba(14,165,233,0.08)'  : 'rgba(14,165,233,0.10)', dur: 8  },
    { size: 220, x: '72%', y: '5%',  color: isDark ? 'rgba(99,102,241,0.07)'  : 'rgba(99,102,241,0.09)', dur: 11 },
    { size: 260, x: '60%', y: '60%', color: isDark ? 'rgba(16,185,129,0.06)'  : 'rgba(16,185,129,0.08)', dur: 9  },
    { size: 180, x: '2%',  y: '65%', color: isDark ? 'rgba(56,189,248,0.07)'  : 'rgba(56,189,248,0.09)', dur: 13 },
    { size: 140, x: '85%', y: '80%', color: isDark ? 'rgba(245,158,11,0.05)'  : 'rgba(245,158,11,0.07)', dur: 10 },
  ];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {orbs.map((o, i) => (
        <motion.div key={i}
          animate={{ y: [0, -28, 0], x: [0, 14, 0], scale: [1, 1.06, 1] }}
          transition={{ duration: o.dur, repeat: Infinity, ease: 'easeInOut', delay: i * 1.2 }}
          className="absolute rounded-full"
          style={{
            width: o.size, height: o.size,
            left: o.x, top: o.y,
            background: o.color,
            filter: 'blur(52px)',
            transform: 'translate(-50%,-50%)',
          }} />
      ))}
    </div>
  );
}

/* ─── Field wrapper ─── */
function Field({ label, error, icon, children, hint, required, isDark }) {
  const textSec = isDark ? '#64748b' : '#64748b';
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[.16em]"
        style={{ color: textSec }}>
        {icon && React.cloneElement(icon, { size: 11, style: { color: '#0ea5e9' } })}
        {label}
        {required && <span style={{ color: '#f43f5e' }}>*</span>}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-1.5 text-[10px] font-bold" style={{ color: '#f43f5e' }}>
            <AlertCircle size={10} /> {error}
          </motion.p>
        )}
        {hint && !error && (
          <p className="text-[10px] font-medium" style={{ color: isDark ? '#475569' : '#94a3b8' }}>{hint}</p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Stage Selector ─── */
const STAGES = [
  { value: 'idea',        label: 'Idea',        desc: 'Concept stage',          icon: Lightbulb,  color: '#f59e0b' },
  { value: 'MVP',         label: 'MVP',          desc: 'Min. viable product',    icon: Rocket,     color: '#0ea5e9' },
  { value: 'pre-revenue', label: 'Pre-Revenue',  desc: 'Building traction',      icon: BarChart2,  color: '#6366f1' },
  { value: 'scaling',     label: 'Scaling',      desc: 'Growing fast',           icon: TrendingUp, color: '#10b981' },
  { value: 'established', label: 'Established',  desc: 'Proven model',           icon: Target,     color: '#f43f5e' },
];
function StageSelector({ value, onChange, isDark }) {
  const textPri  = isDark ? '#f1f5f9' : '#0a1628';
  const textSec  = isDark ? '#64748b' : '#94a3b8';
  const idleBg   = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';
  const idleBdr  = isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.09)';
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
      {STAGES.map(s => {
        const Icon = s.icon; const active = value === s.value;
        return (
          <motion.button key={s.value} type="button"
            whileHover={{ y: -3, boxShadow: `0 8px 24px ${s.color}30` }}
            whileTap={{ scale: .95 }}
            onClick={() => onChange(s.value)}
            className="flex flex-col items-center gap-1.5 p-3.5 rounded-2xl text-center transition-all duration-200"
            style={{
              background: active ? `${s.color}18` : idleBg,
              border: `1.5px solid ${active ? s.color : idleBdr}`,
              boxShadow: active ? `0 0 0 3px ${s.color}20, 0 4px 16px ${s.color}20` : 'none',
            }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: active ? `${s.color}22` : isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }}>
              <Icon size={16} style={{ color: active ? s.color : textSec }} />
            </div>
            <span className="text-[10px] font-black leading-none" style={{ color: active ? s.color : textPri }}>{s.label}</span>
            <span className="text-[8px] font-medium leading-tight text-center" style={{ color: textSec }}>{s.desc}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   MAIN
════════════════════════════════════════════════════════════ */
const INIT = { category: '', description: '', fundingLimit: '', avgEquityExpectation: '', targetIndustry: '', preferredStage: 'idea' };

export default function StartupProfileForm() {
  const navigate = useNavigate();
  const isDark   = useTheme();
  const [form,        setForm]        = useState(INIT);
  const [errors,      setErrors]      = useState({});
  const [touched,     setTouched]     = useState({});
  const [loading,     setLoading]     = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // ── tokens ───────────────────────────────────────────────────────────────
  const bg         = isDark ? '#070b13' : '#e8f0f8';
  const glassBg    = isDark ? 'rgba(13,22,40,0.75)'  : 'rgba(255,255,255,0.78)';
  const glassBdr   = isDark ? 'rgba(14,165,233,0.18)' : 'rgba(14,165,233,0.20)';
  const textPri    = isDark ? '#f1f5f9' : '#0a1628';
  const textSec    = isDark ? '#64748b' : '#64748b';
  const inputBg    = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.85)';
  const inputBdr   = isDark ? 'rgba(255,255,255,0.10)' : 'rgba(14,165,233,0.15)';
  const inputColor = isDark ? '#e2e8f0' : '#0a1628';

  const inputStyle = {
    background: inputBg,
    border: `1.5px solid ${inputBdr}`,
    color: inputColor,
    outline: 'none',
    fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
    transition: 'all 0.2s',
  };

  const validate = (data) => {
    const e = {};
    if (!data.category.trim())       e.category       = 'Category is required';
    if (!data.description.trim())    e.description    = 'Description is required';
    if (!data.targetIndustry.trim()) e.targetIndustry = 'Target industry is required';
    if (data.fundingLimit && isNaN(Number(data.fundingLimit))) e.fundingLimit = 'Must be a number';
    if (data.avgEquityExpectation && (isNaN(Number(data.avgEquityExpectation)) || Number(data.avgEquityExpectation) > 100))
      e.avgEquityExpectation = 'Must be 0–100';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (touched[name]) validate({ ...form, [name]: value });
  };
  const handleBlur = e => {
    setTouched(p => ({ ...p, [e.target.name]: true }));
    validate(form);
  };

  const submit = async e => {
    e.preventDefault();
    setTouched({ category: true, description: true, targetIndustry: true, fundingLimit: true, avgEquityExpectation: true });
    if (!validate(form)) { toast('Please fix the errors before submitting.', 'error'); return; }
    setLoading(true);
    try {
      await api.post('/startupProfile/addStartupProfile', {
        category:             form.category.trim(),
        description:          form.description.trim(),
        fundingLimit:         Number(form.fundingLimit) || 0,
        avgEquityExpectation: Number(form.avgEquityExpectation) || 0,
        targetIndustry:       form.targetIndustry.trim(),
        preferredStage:       form.preferredStage,
      });
      setShowSuccess(true);
    } catch (err) {
      toast(err?.response?.data?.message || 'Failed to create profile.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filled   = [form.category, form.description, form.targetIndustry, form.fundingLimit, form.avgEquityExpectation].filter(v => String(v).trim()).length;
  const progress = Math.round((filled / 5) * 100);

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        html,body,#root,*{scrollbar-width:none;-ms-overflow-style:none;}
        *::-webkit-scrollbar{display:none;width:0;height:0;}
        .mpf-input::placeholder{color:${isDark ? '#2d3f55' : '#9eb3c8'}!important;}
        .mpf-input:focus{border-color:#0ea5e9!important;box-shadow:0 0 0 3px rgba(14,165,233,0.16)!important;background:${isDark ? 'rgba(14,165,233,0.06)' : 'rgba(14,165,233,0.04)'}!important;}
        .mpf-ta::placeholder{color:${isDark ? '#2d3f55' : '#9eb3c8'}!important;}
        .mpf-ta:focus{border-color:#0ea5e9!important;box-shadow:0 0 0 3px rgba(14,165,233,0.16)!important;}
        input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0;}
        input[type=number]{-moz-appearance:textfield;}
      `}</style>

      <ToastContainer />
      <MentorNavbar />

      {/* ── Full-page animated background ─────────────────────────────── */}
      <div className="fixed inset-0 z-0 transition-colors duration-700" style={{ background: bg }}>
        <ParticleCanvas isDark={isDark} />
        <FloatingOrbs isDark={isDark} />

        {/* subtle grid lines */}
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(${isDark ? 'rgba(14,165,233,0.04)' : 'rgba(14,165,233,0.06)'} 1px, transparent 1px),
                            linear-gradient(90deg, ${isDark ? 'rgba(14,165,233,0.04)' : 'rgba(14,165,233,0.06)'} 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }} />
      </div>

      <div className="relative z-10 min-h-screen">
        <main className="max-w-2xl mx-auto px-5 pt-24 pb-16">

          {/* Back */}
          <motion.button initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/mentor/dashboard')}
            className="flex items-center gap-2 mb-6 text-[11px] font-black uppercase tracking-widest transition-colors duration-200"
            style={{ color: textSec }}
            onMouseEnter={e => e.currentTarget.style.color = '#0ea5e9'}
            onMouseLeave={e => e.currentTarget.style.color = textSec}>
            <ArrowLeft size={13} /> Back to Dashboard
          </motion.button>

          {/* ── Hero text ───────────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .45, ease: [.22, 1, .36, 1] }} className="mb-7">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-4"
              style={{ background: isDark ? 'rgba(14,165,233,0.12)' : 'rgba(14,165,233,0.10)', border: '1px solid rgba(14,165,233,0.22)' }}>
              <Sparkles size={11} style={{ color: '#0ea5e9' }} />
              <span className="text-[10px] font-black uppercase tracking-[.18em]" style={{ color: '#0ea5e9' }}>New Opportunity</span>
            </div>
            <h1 className="text-[2.4rem] font-black leading-none mb-2.5"
              style={{ color: textPri, letterSpacing: '-0.035em' }}>
              Add{' '}
              <span style={{
                background: 'linear-gradient(135deg,#0ea5e9,#38bdf8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Startup Profile
              </span>
            </h1>
            <p className="text-[14px] font-medium" style={{ color: textSec }}>
              Create a mentoring or funding opportunity — entrepreneurs will find and apply directly.
            </p>
          </motion.div>

          {/* ── Glass Card ──────────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .12, duration: .45, ease: [.22, 1, .36, 1] }}
            className="rounded-3xl overflow-hidden"
            style={{
              background: glassBg,
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: `1px solid ${glassBdr}`,
              boxShadow: isDark
                ? '0 8px 64px rgba(0,0,0,0.55), 0 1px 0 rgba(255,255,255,0.04) inset'
                : '0 8px 64px rgba(0,0,0,0.10), 0 1px 0 rgba(255,255,255,0.90) inset',
            }}>

            {/* Card top banner */}
            <div className="relative px-7 pt-6 pb-7 overflow-hidden"
              style={{ background: 'linear-gradient(135deg,#0369a1 0%,#0284c7 40%,#0ea5e9 75%,#38bdf8 100%)' }}>
              {/* animated shimmer */}
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 2, ease: 'easeInOut' }}
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(90deg,transparent 20%,rgba(255,255,255,0.12) 50%,transparent 80%)', transform: 'skewX(-20deg)' }} />

              {/* decorative circles */}
              <div className="absolute -right-14 -top-14 w-52 h-52 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', filter: 'blur(1px)' }} />
              <div className="absolute right-12 -bottom-8 w-32 h-32 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }} />
              <div className="absolute -left-8 -bottom-10 w-40 h-40 rounded-full" style={{ background: 'rgba(0,0,0,0.10)' }} />

              {/* watermark icon */}
              <div className="absolute right-5 bottom-0 opacity-[0.09]"><Layers size={96} color="white" /></div>

              <div className="relative z-10 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2.5">
                    <Rocket size={13} color="rgba(255,255,255,0.75)" />
                    <span className="text-[9px] font-black uppercase tracking-[.22em] text-white/70">Mentor Profile Builder</span>
                  </div>
                  <h2 className="text-[1.5rem] font-black text-white leading-tight mb-0.5" style={{ letterSpacing: '-0.025em' }}>
                    Profile Details
                  </h2>
                </div>

                {/* progress ring */}
                <div className="flex flex-col items-center gap-1.5 shrink-0">
                  <div className="relative w-[60px] h-[60px]">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 60 60">
                      <circle cx="30" cy="30" r="24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="4.5" />
                      <motion.circle cx="30" cy="30" r="24" fill="none" stroke="white" strokeWidth="4.5"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 24}`}
                        initial={{ strokeDashoffset: 2 * Math.PI * 24 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 24 * (1 - progress / 100) }}
                        transition={{ duration: .5, ease: 'easeOut' }} />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[13px] font-black text-white leading-none">{progress}%</span>
                    </div>
                  </div>
                  <span className="text-[8px] font-black text-white/55 uppercase tracking-widest">Complete</span>
                </div>
              </div>
            </div>

            {/* Form body */}
            <form onSubmit={submit} className="px-7 py-7 flex flex-col gap-6">

              {/* Category */}
              <Field label="Category" icon={<Tag />} error={touched.category && errors.category} required isDark={isDark}>
                <div className="relative">
                  <Tag size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#0ea5e9' }} />
                  <input name="category" value={form.category}
                    onChange={handleChange} onBlur={handleBlur}
                    placeholder="e.g. FinTech, HealthTech, EdTech"
                    className="mpf-input w-full pl-9 pr-4 py-3.5 rounded-2xl text-[13px] font-bold"
                    style={{ ...inputStyle, borderColor: touched.category && errors.category ? '#f43f5e' : inputBdr }} />
                </div>
              </Field>

              {/* Description */}
              <Field label="Description" icon={<FileText />} error={touched.description && errors.description} required isDark={isDark}>
                <textarea name="description" value={form.description}
                  onChange={handleChange} onBlur={handleBlur}
                  placeholder="Describe your mentoring opportunity — what you offer and what you look for in a startup…"
                  rows={3}
                  className="mpf-ta w-full px-4 py-3.5 rounded-2xl text-[13px] font-bold resize-none"
                  style={{ ...inputStyle, borderColor: touched.description && errors.description ? '#f43f5e' : inputBdr }} />
              </Field>

              {/* Funding + Equity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Funding Limit" icon={<IndianRupee />}
                  error={touched.fundingLimit && errors.fundingLimit}
                  hint="Maximum amount you'd invest (₹)" isDark={isDark}>
                  <div className="relative">
                    <IndianRupee size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#0ea5e9' }} />
                    <input type="number" name="fundingLimit" value={form.fundingLimit} min="0"
                      onChange={handleChange} onBlur={handleBlur} placeholder="e.g. 500000"
                      className="mpf-input w-full pl-9 pr-4 py-3.5 rounded-2xl text-[13px] font-bold"
                      style={{ ...inputStyle, borderColor: touched.fundingLimit && errors.fundingLimit ? '#f43f5e' : inputBdr }} />
                  </div>
                </Field>

                <Field label="Avg Equity Expectation (%)" icon={<TrendingUp />}
                  error={touched.avgEquityExpectation && errors.avgEquityExpectation}
                  hint="% equity you expect in return" isDark={isDark}>
                  <div className="relative">
                    <TrendingUp size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#0ea5e9' }} />
                    <input type="number" name="avgEquityExpectation" value={form.avgEquityExpectation} min="0" max="100"
                      onChange={handleChange} onBlur={handleBlur} placeholder="e.g. 10"
                      className="mpf-input w-full pl-9 pr-4 py-3.5 rounded-2xl text-[13px] font-bold"
                      style={{ ...inputStyle, borderColor: touched.avgEquityExpectation && errors.avgEquityExpectation ? '#f43f5e' : inputBdr }} />
                  </div>
                </Field>
              </div>

              {/* Target Industry */}
              <Field label="Target Industry" icon={<Building2 />}
                error={touched.targetIndustry && errors.targetIndustry} required isDark={isDark}>
                <div className="relative">
                  <Building2 size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#0ea5e9' }} />
                  <input name="targetIndustry" value={form.targetIndustry}
                    onChange={handleChange} onBlur={handleBlur}
                    placeholder="e.g. Finance, Healthcare, E-commerce"
                    className="mpf-input w-full pl-9 pr-4 py-3.5 rounded-2xl text-[13px] font-bold"
                    style={{ ...inputStyle, borderColor: touched.targetIndustry && errors.targetIndustry ? '#f43f5e' : inputBdr }} />
                </div>
              </Field>

              {/* Preferred Stage */}
              <Field label="Preferred Stage" icon={<Layers />}
                hint="Select the startup stage you prefer to mentor" isDark={isDark}>
                <StageSelector value={form.preferredStage}
                  onChange={val => setForm(p => ({ ...p, preferredStage: val }))}
                  isDark={isDark} />
              </Field>

              {/* Divider */}
              <div className="h-px" style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(14,165,233,0.12)' }} />

              {/* Submit */}
              <motion.button type="submit" disabled={loading}
                whileHover={!loading ? { scale: 1.01, boxShadow: '0 10px 36px rgba(14,165,233,0.50)' } : {}}
                whileTap={!loading ? { scale: .98 } : {}}
                className="relative w-full py-4 rounded-2xl font-black text-[13px] uppercase tracking-[.12em] overflow-hidden"
                style={{
                  background: loading
                    ? (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)')
                    : 'linear-gradient(135deg,#0369a1 0%,#0284c7 35%,#0ea5e9 70%,#38bdf8 100%)',
                  boxShadow: loading ? 'none' : '0 4px 24px rgba(14,165,233,0.38)',
                  color: loading ? textSec : '#ffffff',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}>
                {/* shimmer on hover */}
                {!loading && (
                  <motion.div
                    animate={{ x: ['-120%', '220%'] }}
                    transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5, ease: 'easeInOut' }}
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: 'linear-gradient(90deg,transparent 20%,rgba(255,255,255,0.18) 50%,transparent 80%)', transform: 'skewX(-20deg)' }} />
                )}
                <span className="relative z-10 flex items-center justify-center gap-2.5">
                  {loading
                    ? <><Loader2 size={16} className="animate-spin" /> Creating Profile…</>
                    : <><Rocket size={15} /> Save Profile</>}
                </span>
              </motion.button>

              <p className="text-center text-[10px] font-medium" style={{ color: textSec }}>
                Your profile will be visible to entrepreneurs immediately after saving.
              </p>
            </form>
          </motion.div>
        </main>
      </div>

      {/* ── Success Modal ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showSuccess && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0"
              style={{ background: 'rgba(5,9,18,0.85)', backdropFilter: 'blur(14px)' }} />
            <motion.div initial={{ scale: .86, opacity: 0, y: 28 }} animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: .86, opacity: 0, y: 28 }} transition={{ duration: .32, ease: [.22, 1, .36, 1] }}
              className="relative w-full max-w-sm rounded-3xl overflow-hidden text-center"
              style={{ background: isDark ? 'rgba(13,22,40,0.92)' : 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(14,165,233,0.18)', boxShadow: '0 32px 80px rgba(0,0,0,0.55)' }}>
              <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg,#0284c7,#0ea5e9,#38bdf8)' }} />
              <div className="px-8 py-8">
                <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: .15, type: 'spring', stiffness: 260, damping: 18 }}
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5"
                  style={{ background: 'rgba(16,185,129,0.12)', border: '2px solid rgba(16,185,129,0.22)' }}>
                  <CheckCircle2 size={40} style={{ color: '#10b981' }} />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .28 }}>
                  <h2 className="text-[1.6rem] font-black mb-2" style={{ color: textPri, letterSpacing: '-0.03em' }}>
                    Profile Created! 🚀
                  </h2>
                  <p className="text-[13px] font-medium mb-7 leading-relaxed" style={{ color: textSec }}>
                    Your opportunity is now live. Entrepreneurs can discover and apply right now.
                  </p>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: .36 }} className="flex flex-col gap-3">
                  <button onClick={() => { setShowSuccess(false); navigate('/mentor/profiles'); }}
                    className="w-full py-3.5 rounded-2xl font-black text-[12px] uppercase tracking-widest text-white"
                    style={{ background: 'linear-gradient(135deg,#0284c7,#0ea5e9)', boxShadow: '0 4px 20px rgba(14,165,233,0.35)' }}>
                    View My Profiles
                  </button>
                  <button onClick={() => { setForm(INIT); setErrors({}); setTouched({}); setShowSuccess(false); }}
                    className="w-full py-3.5 rounded-2xl font-black text-[12px] uppercase tracking-widest"
                    style={{ background: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9', color: textSec, border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}` }}>
                    Add Another Profile
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}