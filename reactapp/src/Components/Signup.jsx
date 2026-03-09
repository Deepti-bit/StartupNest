import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import {
  Rocket, Briefcase, ArrowLeft, ArrowRight,
  Eye, EyeOff, Loader2, UploadCloud, CheckCircle2, X,
} from 'lucide-react';
import api from '../Services/api';
import './Signup.css';

/* ─────────────────────────────────────────────────────────
   TOAST SYSTEM — self-contained, no context needed
───────────────────────────────────────────────────────── */
let _setToasts = null;

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);
  _setToasts = setToasts;

  const remove = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 60, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.92 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            /* bg + border + shadow via CSS semantic class */
            className={`toast-${t.type} pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-2xl min-w-[260px] max-w-[340px]`}
          >
            {/* Icon — background via CSS class */}
            <div className={`toast-icon--${t.type} shrink-0 w-7 h-7 rounded-xl flex items-center justify-center mt-0.5`}>
              <span style={{ fontSize: 14 }}>
                {t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ'}
              </span>
            </div>

            {/* Message — colour via CSS class */}
            <p className={`toast-text--${t.type} flex-1 text-[12.5px] font-semibold leading-snug`}>
              {t.message}
            </p>

            {/* Close */}
            <button
              onClick={() => remove(t.id)}
              className="shrink-0 mt-0.5 opacity-40 hover:opacity-80 transition-opacity"
            >
              {/* colour via currentColor from parent .toast-text class on sibling — use className */}
              <X size={12} className={`toast-text--${t.type}`} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function toast(message, type = 'info', duration = 3500) {
  if (!_setToasts) return;
  const id = Date.now() + Math.random();
  _setToasts(prev => [...prev, { id, message, type }]);
  setTimeout(() => {
    _setToasts(prev => prev.filter(t => t.id !== id));
  }, duration);
}

/* ─────────────────────────────────────────────────────────
   LEFT PANEL CANVAS — identical to Login.jsx
───────────────────────────────────────────────────────── */
function LeftCanvas() {
  const ref = useRef(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    let raf;

    const fit = () => { c.width = c.offsetWidth; c.height = c.offsetHeight; };
    fit();
    window.addEventListener('resize', fit);

    const POLYS = Array.from({ length: 6 }, () => ({
      points: Array.from({ length: 4 }, () => ({
        x: Math.random(), y: Math.random(),
        vx: (Math.random() - 0.5) * 0.00018,
        vy: (Math.random() - 0.5) * 0.00018,
      })),
      alpha: Math.random() * 0.04 + 0.015,
    }));

    const NODES = Array.from({ length: 28 }, () => ({
      x: Math.random() * 2000, y: Math.random() * 1200,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      r: Math.random() * 1.4 + 0.5,
      phase: Math.random() * 6.28,
    }));

    const ORBS = [
      { cx: 0.18, cy: 0.28, r: 240, col: '14,165,233', s: 0.00012, p: 0 },
      { cx: 0.72, cy: 0.68, r: 180, col: '99,102,241', s: 0.00017, p: 2.1 },
      { cx: 0.45, cy: 0.82, r: 150, col: '6,182,212', s: 0.00015, p: 4.2 },
    ];

    let t = 0;
    const draw = () => {
      t++;
      const W = c.width, H = c.height;
      ctx.clearRect(0, 0, W, H);

      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, '#080c14');
      bg.addColorStop(0.5, '#0b1120');
      bg.addColorStop(1, '#0d1428');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      ORBS.forEach(o => {
        const x = (o.cx + Math.sin(t * o.s + o.p) * 0.055) * W;
        const y = (o.cy + Math.cos(t * o.s + o.p) * 0.055) * H;
        const g = ctx.createRadialGradient(x, y, 0, x, y, o.r);
        g.addColorStop(0, `rgba(${o.col},.14)`);
        g.addColorStop(0.5, `rgba(${o.col},.04)`);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(x, y, o.r, 0, 6.28);
        ctx.fillStyle = g;
        ctx.fill();
      });

      POLYS.forEach(poly => {
        poly.points.forEach(p => {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > 1) p.vx *= -1;
          if (p.y < 0 || p.y > 1) p.vy *= -1;
        });
        ctx.beginPath();
        ctx.moveTo(poly.points[0].x * W, poly.points[0].y * H);
        poly.points.slice(1).forEach(p => ctx.lineTo(p.x * W, p.y * H));
        ctx.closePath();
        ctx.strokeStyle = `rgba(14,165,233,${poly.alpha})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      });

      NODES.forEach(n => {
        n.x += n.vx; n.y += n.vy; n.phase += 0.014;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      });
      for (let i = 0; i < NODES.length; i++) {
        for (let j = i + 1; j < NODES.length; j++) {
          const dx = NODES[i].x - NODES[j].x;
          const dy = NODES[i].y - NODES[j].y;
          const d = Math.hypot(dx, dy);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(NODES[i].x, NODES[i].y);
            ctx.lineTo(NODES[j].x, NODES[j].y);
            ctx.strokeStyle = `rgba(14,165,233,${0.07 * (1 - d / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      NODES.forEach(n => {
        const p = Math.sin(n.phase) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, 6.28);
        ctx.fillStyle = `rgba(125,211,252,${0.25 + p * 0.4})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', fit);
    };
  }, []);

  return (
    <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" />
  );
}

/* ─────────────────────────────────────────────────────────
   VALIDATION
───────────────────────────────────────────────────────── */
const RULES = {
  userName: [
    { regex: /^.{3,}$/, msg: 'At least 3 characters required' },
    { regex: /^[a-zA-Z0-9_ ]+$/, msg: 'Only letters, numbers, spaces and underscores' },
  ],
  email: [{ regex: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, msg: 'Enter a valid email' }],
  mobile: [{ regex: /^[6-9]\d{9}$/, msg: 'Valid 10-digit Indian mobile number' }],
  password: [
    { regex: /.{6,}/, msg: 'Minimum 6 characters' },
    { regex: /[A-Z]/, msg: 'At least one uppercase letter' },
    { regex: /[a-z]/, msg: 'At least one lowercase letter' },
    { regex: /\d/, msg: 'At least one number' },
  ],
};

const ALL_FIELDS = ['userName', 'email', 'mobile', 'password', 'confirmPassword'];

function validate(field, value, extra = {}) {
  if (!value?.trim())
    return `${field === 'userName' ? 'Full name' : field.charAt(0).toUpperCase() + field.slice(1)} is required`;
  if (field === 'confirmPassword')
    return value !== extra.password ? 'Passwords do not match' : '';
  const v = field === 'mobile' ? value.replace(/[^0-9]/g, '') : value;
  for (const rule of RULES[field] || [])
    if (!rule.regex.test(v)) return rule.msg;
  return '';
}

/* ─────────────────────────────────────────────────────────
   PASSWORD STRENGTH METER
───────────────────────────────────────────────────────── */
function PasswordStrength({ value }) {
  if (!value) return null;
  const score = [/.{6,}/, /[A-Z]/, /[a-z]/, /\d/, /[^A-Za-z0-9]/].filter(r => r.test(value)).length;
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  const colors = ['', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#06b6d4'];

  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="flex gap-1 flex-1">
        {[1, 2, 3, 4, 5].map(i => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-all duration-300"
            /* strength bar fill colour has no CSS-class equivalent — driven by JS score */
            style={{ background: i <= score ? colors[score] : '#e2e8f0' }}
          />
        ))}
      </div>
      {/* label colour is also JS-driven */}
      <span
        className="text-[9px] font-black uppercase tracking-widest min-w-[56px] text-right"
        style={{ color: colors[score] }}
      >
        {labels[score]}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   FIELD COMPONENT — defined OUTSIDE Signup to prevent
   remounting on every parent re-render (fixes focus loss bug)
───────────────────────────────────────────────────────── */
function Field({ name, label, type = 'text', suffix = null, value, onChange, onBlur, error, touched }) {
  const err = touched ? error : '';

  return (
    <div>
      <label className="block text-[10.5px] font-bold text-slate-500 mb-1.5 ml-0.5 tracking-wide">
        {label}
      </label>
      {/* sn-fw-shadow replaces style={{ boxShadow }} */}
      <div className={`sn-fw sn-fw-shadow relative rounded-xl border transition-all duration-200 ${err
          ? 'border-red-400/70 bg-red-50'
          : 'border-slate-200 bg-white hover:border-slate-300'
        }`}>
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          autoComplete={name}
          placeholder=""
          className={`sn-inp w-full px-3.5 py-3 rounded-xl outline-none text-[13px] font-medium ${suffix ? 'pr-10' : ''}`}
        />
        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{suffix}</div>
        )}
      </div>
      <AnimatePresence>
        {err && (
          <motion.p
            initial={{ opacity: 0, y: -3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-1 ml-0.5 text-[10px] font-bold text-red-400 flex items-center gap-1"
          >
            <span className="w-3 h-3 rounded-full bg-red-400 text-white flex items-center justify-center text-[7px] font-black shrink-0">✕</span>
            {err}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   STAT CHIPS DATA
───────────────────────────────────────────────────────── */
const STAT_CHIPS = [
  { n: '2,400+', l: 'Mentors', cls: 'stat-chip--sky' },
  { n: '8,100+', l: 'Founders', cls: 'stat-chip--indigo' },
  { n: '140+', l: 'Countries', cls: 'stat-chip--emerald' },
];

/* ─────────────────────────────────────────────────────────
   MAIN SIGNUP
───────────────────────────────────────────────────────── */
export default function Signup() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);

  const [form, setForm] = useState({
    userName: '', email: '', mobile: '',
    password: '', confirmPassword: '', role: 'Entrepreneur',
  });
  const [touched, setTouched] = useState(
    Object.fromEntries(ALL_FIELDS.map(f => [f, false]))
  );
  const [errors, setErrors] = useState(
    Object.fromEntries(ALL_FIELDS.map(f => [f, '']))
  );
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeError, setResumeError] = useState('');

  // Cursor tracking — left panel only
  const leftRef = useRef(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const cursorX = useSpring(rawX, { damping: 24, stiffness: 140, mass: 0.9 });
  const cursorY = useSpring(rawY, { damping: 24, stiffness: 140, mass: 0.9 });

  const onLeftMouseMove = useCallback(e => {
    if (!leftRef.current) return;
    const r = leftRef.current.getBoundingClientRect();
    rawX.set(e.clientX - r.left);
    rawY.set(e.clientY - r.top);
  }, [rawX, rawY]);

  // Re-validate on form / touched change
  useEffect(() => {
    const next = {};
    for (const field of ALL_FIELDS)
      next[field] = touched[field]
        ? validate(field, form[field], { password: form.password })
        : errors[field];
    setErrors(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, touched]);

  const handleChange = useCallback(field => e => {
    const value = e.target.value;
    setForm(f => ({ ...f, [field]: value }));
  }, []);

  const handleBlur = useCallback(field => () => {
    setTouched(t => ({ ...t, [field]: true }));
  }, []);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setTouched(Object.fromEntries(ALL_FIELDS.map(f => [f, true])));
    const errs = {};
    for (const field of ALL_FIELDS)
      errs[field] = validate(field, form[field], { password: form.password });
    setErrors(errs);

    if (form.role === 'Mentor' && !resumeFile) {
      setResumeError('PDF Resume is required for Mentors');
      triggerShake();
      return;
    }
    if (Object.values(errs).some(Boolean)) { triggerShake(); return; }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('userName', form.userName);
      fd.append('email', form.email);
      fd.append('mobile', form.mobile);
      fd.append('password', form.password);
      fd.append('role', form.role);
      if (form.role === 'Mentor' && resumeFile) fd.append('resume', resumeFile);

      await api.post('/user/register', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast(
        `Welcome, ${form.userName.trim().split(' ')[0]}! 🎉 Account created. Redirecting to login…`,
        'success',
        3000
      );
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      console.error('[Signup] Registration error:', err);
      const serverMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        null;
      toast(serverMsg || 'Something went wrong. Please try again.', 'error');
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  return (
    /* signup-page replaces style={{ fontFamily }} */
    <div className="signup-page w-screen h-screen flex overflow-hidden">

      <ToastContainer />

      {/* ══════════════════════════════════
          LEFT — dark animated panel
      ══════════════════════════════════ */}
      <div
        ref={leftRef}
        onMouseMove={onLeftMouseMove}
        /* left-panel replaces style={{ background: '#080c14' }} */
        className="left-panel hidden lg:flex lg:w-[46%] h-full relative overflow-hidden flex-col justify-between p-10"
      >
        <LeftCanvas />

        {/* Cursor blob — x/y MUST stay inline (Framer motion values) */}
        <motion.div
          className="cursor-blob absolute z-10"
          style={{
            x: cursorX, y: cursorY,
            width: 480,
            height: 480,
            translateX: '-50%',
            translateY: '-50%',
          }}
        />

        {/* Right-edge fade — left-panel__edge-fade replaces inline style */}
        <div className="left-panel__edge-fade absolute top-0 right-0 bottom-0 w-24 pointer-events-none z-10" />

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="relative z-20 flex items-center gap-3"
        >
          <div className="relative w-10 h-10 shrink-0">
            {/* logo-square--top/bottom replace style={{ background, opacity/border }} */}
            <div className="logo-square--top absolute top-0 left-0 w-7 h-7 rounded-lg" />
            <div className="logo-square--bottom absolute bottom-0 right-0 w-7 h-7 rounded-lg" />
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <span className="text-white font-black text-sm leading-none drop-shadow">S</span>
            </div>
          </div>
          <div>
            <div className="text-white text-[16px] font-black tracking-tight leading-none">
              Startup<span className="text-sky-400">Nest</span>
            </div>
            <div className="text-sky-400/35 text-[9px] font-semibold tracking-[.18em] uppercase mt-0.5">
              Premium Platform
            </div>
          </div>
        </motion.div>

        {/* Centre branding — words animate per step */}
        <motion.div className="relative z-20 space-y-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-5">
                {(step === 1
                  ? ['Build.', 'Mentor.', 'Invest.']
                  : ['Create.', 'Connect.', 'Grow.']
                ).map((w, i) => (
                  /* left-headline replaces style={{ letterSpacing: '-0.03em' }} */
                  <span
                    key={w}
                    className={`left-headline block font-black leading-[1.1] text-5xl xl:text-[3.4rem] ${i === 2 ? 'text-sky-400' : 'text-white'
                      }`}
                  >
                    {w}
                  </span>
                ))}
              </div>
              <p className="text-slate-500 text-[14px] max-w-[15rem] leading-relaxed">
                {step === 1
                  ? 'The elite gateway for Indian founders and global industry leaders.'
                  : `Joining as ${form.role}. Complete your profile below.`}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Stat chips — bg + border via CSS semantic classes */}
          <div className="flex flex-wrap gap-2.5 pt-1">
            {STAT_CHIPS.map(({ n, l, cls }) => (
              <div key={l} className={`${cls} px-3.5 py-2 rounded-2xl flex items-center gap-2`}>
                {/* stat-chip__number replaces style={{ letterSpacing: '-0.02em' }} */}
                <span className="stat-chip__number text-white text-[14px] font-black">{n}</span>
                <span className="text-slate-400 text-[9px] font-semibold tracking-widest uppercase">{l}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <div className="relative z-20 flex items-center justify-between">
          <span className="text-[10px] text-slate-700">© 2026 StartupNest Ecosystem</span>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse block" />
            <span className="text-[9px] text-slate-600 font-semibold tracking-widest uppercase">
              All systems live
            </span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════
          RIGHT — light panel
      ══════════════════════════════════ */}
      {/* right-panel replaces style={{ background: '#f0f4f8' }} */}
      <div className="right-panel flex-1 h-full flex flex-col relative overflow-hidden">

        {/* Dot grid — right-panel__dot-grid replaces inline style */}
        <div className="right-panel__dot-grid absolute inset-0 pointer-events-none" />

        {/* Ambient glow — right-panel__glow replaces inline style */}
        <div className="right-panel__glow" />

        {/* Top bar */}
        <div className="relative z-20 flex items-center justify-between px-8 pt-6 shrink-0">
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => step === 2 ? setStep(1) : navigate('/login')}
            className="flex items-center gap-2 text-slate-400 hover:text-sky-500 transition-colors font-bold text-[11px] uppercase tracking-widest"
          >
            <ArrowLeft size={13} />
            {step === 2 ? 'Change Role' : 'Back to Login'}
          </motion.button>

          {/* Step dots */}
          <div className="flex items-center gap-2">
            {[1, 2].map(s => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-400 ${s === step ? 'w-8 bg-sky-400' :
                    s < step ? 'w-4 bg-sky-300' :
                      'w-4 bg-slate-300'
                  }`}
              />
            ))}
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 flex items-center justify-center overflow-y-auto py-6 relative z-10">
          <AnimatePresence mode="wait">

            {/* ──────────────────────────────
                STEP 1 — ROLE SELECTION
            ────────────────────────────── */}
            {step === 1 && (
              <motion.div
                key="s1"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-2xl px-6 text-center"
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mb-10"
                >
                  {/* step1-heading replaces style={{ letterSpacing: '-0.025em' }} */}
                  <h2 className="step1-heading text-[34px] font-black text-[#0a1628] leading-none mb-3">
                    Choose your identity
                  </h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[.22em]">
                    Select how you want to contribute
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[
                    { role: 'Entrepreneur', icon: <Rocket size={26} />, desc: "I have a startup idea and I'm looking for guidance and funding.", delay: 0.16 },
                    { role: 'Mentor', icon: <Briefcase size={26} />, desc: 'I am an industry leader looking to guide or invest in startups.', delay: 0.22 },
                  ].map(({ role, icon, desc, delay }) => (
                    <motion.button
                      key={role}
                      type="button"
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay, ease: [0.22, 1, 0.36, 1] }}
                      onClick={() => { setForm(f => ({ ...f, role })); setStep(2); }}
                      /* role-card replaces style={{ boxShadow, cursor }} + <style> hover rules */
                      className="role-card text-left p-7 rounded-3xl border-2 border-slate-200 bg-white flex flex-col"
                    >
                      {/* role-icon replaces style={{ background, color }} */}
                      <div className="role-icon w-14 h-14 rounded-2xl flex items-center justify-center mb-5">
                        {icon}
                      </div>

                      {/* role-card__title replaces style={{ letterSpacing: '-0.02em' }} */}
                      <h3 className="role-card__title text-[20px] font-black text-[#0a1628] mb-2.5">
                        {role}
                      </h3>

                      <p className="text-slate-400 text-[13px] leading-relaxed mb-6 font-normal flex-1">
                        {desc}
                      </p>

                      <div className="flex items-center gap-2 text-sky-500 font-black text-[10px] uppercase tracking-widest">
                        <span>Select Role</span>
                        {/* role-arrow from CSS, hover handled by .role-card:hover .role-arrow */}
                        <ArrowRight size={12} className="role-arrow" />
                      </div>
                    </motion.button>
                  ))}
                </div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.38 }}
                  className="mt-8 text-[13px] text-slate-400"
                >
                  Already have an account?{' '}
                  <Link to="/login" className="font-bold text-[#0a1628] hover:text-sky-500 transition-colors">
                    Sign in
                  </Link>
                </motion.p>
              </motion.div>
            )}

            {/* ──────────────────────────────
                STEP 2 — FORM
            ────────────────────────────── */}
            {step === 2 && (
              <motion.div
                key="s2"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                /* form-wrap replaces style={{ maxWidth: 460 }} */
                className={`form-wrap w-full px-6 ${shake ? 'sn-shake' : ''}`}
                onAnimationEnd={() => setShake(false)}
              >
                {/* Heading */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-center mb-6"
                >
                  {/* form-heading replaces style={{ letterSpacing: '-0.025em' }} */}
                  <h2 className="form-heading text-[28px] font-black text-[#0a1628] leading-none mb-3">
                    Create account
                  </h2>
                  <span className="inline-flex items-center gap-2 bg-sky-50 border border-sky-100 px-3 py-1.5 rounded-full">
                    {/* role-badge-icon replaces style={{ background: 'rgba(14,165,233,.12)' }} */}
                    <span className="role-badge-icon flex items-center justify-center w-4 h-4 rounded-md text-sky-500">
                      {form.role === 'Entrepreneur' ? <Rocket size={10} /> : <Briefcase size={10} />}
                    </span>
                    <span className="text-[10px] font-bold text-sky-600 uppercase tracking-widest">
                      Joining as {form.role}
                    </span>
                  </span>
                </motion.div>

                <form onSubmit={handleSubmit} noValidate>
                  <div className="space-y-3">

                    <motion.div
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 }}
                    >
                      <Field
                        name="userName" label="Full Name"
                        value={form.userName}
                        onChange={handleChange('userName')}
                        onBlur={handleBlur('userName')}
                        error={errors.userName}
                        touched={touched.userName}
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.19 }}
                      className="grid grid-cols-2 gap-3"
                    >
                      <Field
                        name="email" label="Email" type="email"
                        value={form.email}
                        onChange={handleChange('email')}
                        onBlur={handleBlur('email')}
                        error={errors.email}
                        touched={touched.email}
                      />
                      <Field
                        name="mobile" label="Mobile" type="tel"
                        value={form.mobile}
                        onChange={handleChange('mobile')}
                        onBlur={handleBlur('mobile')}
                        error={errors.mobile}
                        touched={touched.mobile}
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.23 }}
                      className="grid grid-cols-2 gap-3"
                    >
                      <Field
                        name="password" label="Password"
                        type={showPass ? 'text' : 'password'}
                        value={form.password}
                        onChange={handleChange('password')}
                        onBlur={handleBlur('password')}
                        error={errors.password}
                        touched={touched.password}
                        suffix={
                          <button type="button" tabIndex={-1}
                            onClick={() => setShowPass(p => !p)}
                            className="text-slate-400 hover:text-sky-500 transition-colors p-1">
                            {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        }
                      />
                      <Field
                        name="confirmPassword" label="Confirm"
                        type={showConf ? 'text' : 'password'}
                        value={form.confirmPassword}
                        onChange={handleChange('confirmPassword')}
                        onBlur={handleBlur('confirmPassword')}
                        error={errors.confirmPassword}
                        touched={touched.confirmPassword}
                        suffix={
                          <button type="button" tabIndex={-1}
                            onClick={() => setShowConf(p => !p)}
                            className="text-slate-400 hover:text-sky-500 transition-colors p-1">
                            {showConf ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        }
                      />
                    </motion.div>

                    <PasswordStrength value={form.password} />

                    {/* Resume upload — Mentor only */}
                    {form.role === 'Mentor' && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <label className="block text-[10.5px] font-bold text-slate-500 mb-1.5 ml-0.5 tracking-wide">
                          Resume (PDF only)
                        </label>
                        {/* resume-drop-shadow replaces style={{ boxShadow }} */}
                        <div className={`resume-drop-shadow relative rounded-xl border-2 border-dashed p-4 flex items-center gap-3 cursor-pointer transition-all duration-200 ${resumeFile
                            ? 'border-emerald-400 bg-emerald-50'
                            : 'border-slate-200 bg-white hover:border-sky-400 hover:bg-sky-50/40'
                          }`}>
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={e => {
                              const f = e.target.files?.[0] || null;
                              setResumeFile(f);
                              setResumeError(f ? '' : 'PDF required');
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          {resumeFile
                            ? <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
                            : <UploadCloud size={20} className="text-sky-400 shrink-0" />}
                          <span className="text-[11px] font-semibold text-slate-400 truncate">
                            {resumeFile ? resumeFile.name : 'Upload your professional CV'}
                          </span>
                        </div>
                        {resumeError && (
                          <p className="mt-1 ml-0.5 text-[10px] font-bold text-red-400 flex items-center gap-1">
                            <span className="w-3 h-3 rounded-full bg-red-400 text-white flex items-center justify-center text-[7px] font-black shrink-0">✕</span>
                            {resumeError}
                          </p>
                        )}
                      </motion.div>
                    )}

                    {/* Submit button */}
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.28 }}
                    >
                      {/* sn-btn replaces style={{ background: 'linear-gradient(…)' }} */}
                      <button
                        type="submit"
                        disabled={loading}
                        className="sn-btn group relative w-full py-3.5 rounded-2xl font-bold text-[14px] text-white overflow-hidden transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[.98]"
                      >
                        {/* sn-btn__shimmer replaces style={{ background: 'linear-gradient(…)' }} on hover overlay */}
                        <div className="sn-btn__shimmer absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl" />
                        <span className="relative flex items-center justify-center gap-2">
                          {loading ? (
                            <><Loader2 className="animate-spin" size={16} /> Creating account…</>
                          ) : (
                            <>
                              <span>Create Account</span>
                              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                            </>
                          )}
                        </span>
                      </button>
                    </motion.div>
                  </div>
                </form>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.38 }}
                >
                  <div className="flex items-center gap-3 my-5">
                    <div className="flex-1 h-px bg-slate-200" />
                    <span className="text-[11px] font-medium text-slate-400">or</span>
                    <div className="flex-1 h-px bg-slate-200" />
                  </div>

                  <p className="text-center text-[13px] text-slate-400">
                    Already have an account?{' '}
                    <Link to="/login" className="font-bold text-[#0a1628] hover:text-sky-500 transition-colors">
                      Sign in
                    </Link>
                  </p>

                  <div className="flex items-center justify-center gap-2 mt-5">
                    <span className="text-[11px] text-slate-400">© StartupNest</span>
                    <span className="text-slate-300">·</span>
                    <button className="text-[11px] text-slate-400 hover:text-slate-600 transition-colors">Privacy</button>
                    <span className="text-slate-300">·</span>
                    <button className="text-[11px] text-slate-400 hover:text-slate-600 transition-colors">Terms</button>
                  </div>
                </motion.div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}