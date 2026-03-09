import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast, Toaster } from 'react-hot-toast';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import api, { setAccessToken } from '../Services/api';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

/* ═══════════════════════════════════════════════════════════
   LEFT PANEL CANVAS
   Deep dark bg with subtle geometric mesh + floating orbs
   Matches the Nexus reference left panel aesthetic
═══════════════════════════════════════════════════════════ */
function LeftCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d'); let raf;
    const fit = () => { c.width = c.offsetWidth; c.height = c.offsetHeight; };
    fit(); window.addEventListener('resize', fit);

    // Subtle geometric polygon lines (like Nexus reference)
    const POLYS = Array.from({ length: 6 }, (_, i) => ({
      points: Array.from({ length: 4 }, () => ({
        x: Math.random(), y: Math.random(),
        vx: (Math.random() - .5) * .00018,
        vy: (Math.random() - .5) * .00018,
      })),
      alpha: Math.random() * .04 + .015,
    }));

    // Network nodes
    const NODES = Array.from({ length: 28 }, () => ({
      x: Math.random() * 2000, y: Math.random() * 1200,
      vx: (Math.random() - .5) * .18, vy: (Math.random() - .5) * .18,
      r: Math.random() * 1.4 + .5, phase: Math.random() * 6.28,
    }));

    // Ambient orbs
    const ORBS = [
      { cx: .18, cy: .28, r: 240, col: '14,165,233',  s: .00012, p: 0   },
      { cx: .72, cy: .68, r: 180, col: '99,102,241',  s: .00017, p: 2.1 },
      { cx: .45, cy: .82, r: 150, col: '6,182,212',   s: .00015, p: 4.2 },
    ];

    let t = 0;
    const draw = () => {
      t++;
      const W = c.width, H = c.height;
      ctx.clearRect(0, 0, W, H);

      // Deep dark background
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, '#080c14');
      bg.addColorStop(.5, '#0b1120');
      bg.addColorStop(1, '#0d1428');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

      // Orbs
      ORBS.forEach(o => {
        const x = (o.cx + Math.sin(t * o.s + o.p) * .055) * W;
        const y = (o.cy + Math.cos(t * o.s + o.p) * .055) * H;
        const g = ctx.createRadialGradient(x, y, 0, x, y, o.r);
        g.addColorStop(0, `rgba(${o.col},.14)`);
        g.addColorStop(.5, `rgba(${o.col},.04)`);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath(); ctx.arc(x, y, o.r, 0, 6.28);
        ctx.fillStyle = g; ctx.fill();
      });

      // Polygon mesh
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
        ctx.lineWidth = .7; ctx.stroke();
      });

      // Nodes + edges
      NODES.forEach(n => {
        n.x += n.vx; n.y += n.vy; n.phase += .014;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      });
      for (let i = 0; i < NODES.length; i++) {
        for (let j = i + 1; j < NODES.length; j++) {
          const dx = NODES[i].x - NODES[j].x, dy = NODES[i].y - NODES[j].y;
          const d = Math.hypot(dx, dy);
          if (d < 120) {
            ctx.beginPath(); ctx.moveTo(NODES[i].x, NODES[i].y);
            ctx.lineTo(NODES[j].x, NODES[j].y);
            ctx.strokeStyle = `rgba(14,165,233,${.07 * (1 - d / 120)})`;
            ctx.lineWidth = .5; ctx.stroke();
          }
        }
      }
      NODES.forEach(n => {
        const p = Math.sin(n.phase) * .5 + .5;
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, 6.28);
        ctx.fillStyle = `rgba(125,211,252,${.25 + p * .4})`; ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', fit); };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

/* ═══════════════════════════════════════════════════════════
   MAIN LOGIN
═══════════════════════════════════════════════════════════ */
const Login = () => {
  const { setUser }               = useAuth();
  const [loading, setLoading]     = useState(false);
  const [showPass, setShowPass]   = useState(false);
  const [isError, setIsError]     = useState(false);
  const [focused, setFocused]     = useState(null);
  const navigate                  = useNavigate();

  // Mouse-tracking cursor blob — LEFT PANEL
  const leftRef   = useRef(null);
  const rawX       = useMotionValue(0);
  const rawY       = useMotionValue(0);
  const cursorX    = useSpring(rawX, { damping: 24, stiffness: 140, mass: .9 });
  const cursorY    = useSpring(rawY, { damping: 24, stiffness: 140, mass: .9 });

  const onMouseMove = useCallback(e => {
    if (!leftRef.current) return;
    const r = leftRef.current.getBoundingClientRect();
    rawX.set(e.clientX - r.left);
    rawY.set(e.clientY - r.top);
  }, [rawX, rawY]);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({ mode: 'onChange' });
  const emailVal = watch('email', '');
  const passVal  = watch('password', '');

  const onSubmit = async data => {
    setLoading(true); setIsError(false);
    const tid = toast.loading('Signing you in…');
    try {
      const res = await api.post('/user/login', data);
      if (res.data.accessToken) {
        setAccessToken(res.data.accessToken);
        const u = {
          role:     res.data.role     || res.data.user?.role,
          userName: res.data.userName || res.data.user?.userName || res.data.name,
          userId:   res.data.ID       || res.data.user?.id       || res.data._id,
        };
        setUser(u);
        localStorage.setItem('role', u.role);
        localStorage.setItem('userName', u.userName);
        localStorage.setItem('userId', u.userId);
        toast.success(`Welcome back, ${u.userName} 🚀`, { id: tid });
        setTimeout(() => {
          const r = u.role?.toLowerCase();
          if (r === 'admin')          navigate('/admin/dashboard');
          else if (r === 'mentor')    navigate('/mentor/dashboard');
          else if (r === 'entrepreneur') navigate('/entrepreneur/home');
          else                        navigate('/home');
        }, 1200);
      }
    } catch (err) {
      setIsError(true);
      toast.error(err.response?.data?.message || 'Invalid credentials.', { id: tid });
    } finally { setLoading(false); }
  };

  return (
    <div className="w-screen h-screen flex overflow-hidden"
      style={{ fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        html,body,#root { height:100%; overflow:hidden; }

        /* Input text always visible */
        .sn-input { color:#0a1628!important; caret-color:#0ea5e9!important; background:transparent!important; }
        .sn-input::placeholder { color:#94a3b8!important; }
        .sn-input:-webkit-autofill,
        .sn-input:-webkit-autofill:hover,
        .sn-input:-webkit-autofill:focus {
          -webkit-text-fill-color:#0a1628!important;
          -webkit-box-shadow:0 0 0 1000px #ffffff inset!important;
          caret-color:#0ea5e9!important;
        }

        /* Shake on error */
        @keyframes snShake {
          0%,100%{transform:translateX(0)}
          15%{transform:translateX(-7px)} 30%{transform:translateX(6px)}
          45%{transform:translateX(-4px)} 60%{transform:translateX(3px)}
          75%{transform:translateX(-2px)}
        }
        .sn-shake { animation: snShake .4s ease; }

        /* Button gradient pulse */
        @keyframes btnPulse {
          0%,100% { box-shadow: 0 4px 24px rgba(14,165,233,.35); }
          50%      { box-shadow: 0 4px 36px rgba(14,165,233,.55); }
        }
        .sn-btn { animation: btnPulse 2.8s ease-in-out infinite; }
        .sn-btn:hover { animation: none; box-shadow: 0 6px 32px rgba(14,165,233,.60)!important; }

        /* Input focus ring */
        .sn-field-wrap:focus-within {
          border-color: rgba(14,165,233,.70)!important;
          box-shadow: 0 0 0 3px rgba(14,165,233,.12)!important;
        }
      `}</style>

      <Toaster position="top-center" toastOptions={{
        style: {
          background: '#131c2e', border: '1px solid rgba(14,165,233,.2)',
          color: '#e2e8f0', fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
          boxShadow: '0 8px 32px rgba(0,0,0,.5)',
        },
        success: { iconTheme: { primary: '#34d399', secondary: '#131c2e' } },
        error:   { iconTheme: { primary: '#f87171', secondary: '#131c2e' } },
      }} />

      {/* ══════════════════════════════════════════
          LEFT — animated dark branding panel
      ══════════════════════════════════════════ */}
      <div
        ref={leftRef}
        onMouseMove={onMouseMove}
        className="hidden lg:flex lg:w-[46%] h-full relative overflow-hidden flex-col justify-between p-10"
        style={{ background: '#080c14' }}>

        <LeftCanvas />

        {/* Mouse-tracking gradient blob on left panel */}
        <motion.div className="absolute pointer-events-none rounded-full z-10" style={{
          x: cursorX, y: cursorY,
          width: 480, height: 480,
          translateX: '-50%', translateY: '-50%',
          background: 'radial-gradient(circle, rgba(14,165,233,.18) 0%, rgba(99,102,241,.10) 40%, transparent 70%)',
          filter: 'blur(55px)',
        }} />

        {/* Right-edge fade blend */}
        <div className="absolute top-0 right-0 bottom-0 w-24 pointer-events-none z-10"
          style={{ background: 'linear-gradient(to right, transparent, #080c14)' }} />

        {/* Logo — top left */}
        <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .55 }}
          className="relative z-20 flex items-center gap-3">
          {/* S icon — two overlapping squares like Nexus */}
          <div className="relative w-10 h-10 shrink-0">
            <div className="absolute top-0 left-0 w-7 h-7 rounded-lg"
              style={{ background: 'linear-gradient(135deg,#38bdf8,#0ea5e9)', opacity: .9 }} />
            <div className="absolute bottom-0 right-0 w-7 h-7 rounded-lg"
              style={{ background: 'linear-gradient(135deg,#0284c7,#0369a1)', border: '2px solid #080c14' }} />
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

        {/* Centre branding */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: .7, delay: .2, ease: [.22, 1, .36, 1] }}
          className="relative z-20 space-y-5">

          <div>
            {['Innovate.', 'Incubate.', 'Succeed.'].map((w, i) => (
              <motion.div key={w} initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: .6, delay: .25 + i * .1, ease: [.22, 1, .36, 1] }}>
                <span className={[
                  'block font-black leading-[1.1]',
                  'text-5xl xl:text-[3.4rem]',
                  i === 1 ? 'text-sky-400' : 'text-white',
                ].join(' ')} style={{ letterSpacing: '-0.03em' }}>
                  {w}
                </span>
              </motion.div>
            ))}
          </div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .6 }}
            className="text-slate-500 text-[14px] max-w-[15rem] leading-relaxed font-normal">
            India's gateway for ambitious founders to meet world-class mentors.
          </motion.p>

          {/* Stats chips */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .72 }}
            className="flex flex-wrap gap-2.5 pt-1">
            {[
              { n: '2,400+', l: 'Mentors', c: 'rgba(14,165,233,.15)', b: 'rgba(14,165,233,.25)' },
              { n: '8,100+', l: 'Founders', c: 'rgba(99,102,241,.15)', b: 'rgba(99,102,241,.25)' },
              { n: '140+',   l: 'Countries', c: 'rgba(52,211,153,.12)', b: 'rgba(52,211,153,.22)' },
            ].map(({ n, l, c, b }) => (
              <div key={l} className="px-3.5 py-2 rounded-2xl flex items-center gap-2"
                style={{ background: c, border: `1px solid ${b}` }}>
                <span className="text-white text-[14px] font-black leading-none"
                  style={{ letterSpacing: '-0.02em' }}>{n}</span>
                <span className="text-slate-400 text-[9px] font-semibold tracking-widest uppercase">{l}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Bottom copyright */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .9 }}
          className="relative z-20 flex items-center justify-between">
          <span className="text-[10px] text-slate-700 font-medium">© 2026 StartupNest Inc.</span>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse block" />
            <span className="text-[9px] text-slate-600 font-semibold tracking-widest uppercase">All systems live</span>
          </div>
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════
          RIGHT — light theme centered form
      ══════════════════════════════════════════ */}
      <div
        className="flex-1 h-full flex items-center justify-center relative overflow-hidden"
        style={{ background: '#f0f4f8' }}>

        {/* Dot grid — same as landing page */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, #c8d6e5 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />

        {/* Static soft glow */}
        <div className="absolute pointer-events-none" style={{
          top: '25%', left: '35%', width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(14,165,233,.10) 0%, rgba(99,102,241,.06) 50%, transparent 70%)',
          filter: 'blur(50px)',
        }} />

        {/* Mobile logo */}
        <div className="lg:hidden absolute top-5 left-5 flex items-center gap-2 z-20">
          <div className="relative w-8 h-8 shrink-0">
            <div className="absolute top-0 left-0 w-5.5 h-5.5 rounded-md"
              style={{ background: 'linear-gradient(135deg,#38bdf8,#0ea5e9)' }} />
            <div className="absolute bottom-0 right-0 w-5.5 h-5.5 rounded-md"
              style={{ background: '#0284c7', border: '1.5px solid #f0f4f8' }} />
          </div>
          <span className="text-[#0a1628] font-black text-sm tracking-tight">
            Startup<span className="text-sky-500">Nest</span>
          </span>
        </div>

        {/* ── FORM — centered, no card border, matches Nexus style ── */}
        <motion.div
          className={`relative z-10 w-full ${isError ? 'sn-shake' : ''}`}
          onAnimationEnd={() => setIsError(false)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .6, ease: [.22, 1, .36, 1], delay: .1 }}
          style={{ maxWidth: 420, padding: '0 24px' }}>

          {/* Heading — centered */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .22 }} className="text-center mb-8">
            <h1 className="text-[32px] font-black text-[#0a1628] leading-none mb-2.5"
              style={{ letterSpacing: '-0.025em' }}>
              Sign in
            </h1>
            <p className="text-slate-500 text-[14px] font-normal leading-relaxed">
              Welcome back! Please sign in to continue.
            </p>
          </motion.div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3.5">

            {/* Email field */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: .30 }}>
              <label className="block text-[11.5px] font-bold text-slate-500 mb-1.5 ml-0.5"
                style={{ letterSpacing: '.02em' }}>
                Email address
              </label>
              <div className={`sn-field-wrap relative rounded-2xl border transition-all duration-200 ${
                errors.email
                  ? 'border-red-400/70 bg-red-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
                style={{ boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
                  })}
                  type="email"
                  placeholder="name@startup.com"
                  autoComplete="email"
                  className="sn-input w-full px-4 py-3.5 rounded-2xl outline-none text-[14px] font-medium"
                />
              </div>
              <AnimatePresence>
                {errors.email && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="mt-1.5 ml-1 text-[10px] font-bold text-red-400 flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-500 text-white flex items-center justify-center text-[7px] font-black shrink-0">✕</span>
                    {errors.email.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Password field */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: .36 }}>
              <label className="block text-[11.5px] font-bold text-slate-500 mb-1.5 ml-0.5"
                style={{ letterSpacing: '.02em' }}>
                Password
              </label>
              <div className={`sn-field-wrap relative rounded-2xl border transition-all duration-200 ${
                errors.password
                  ? 'border-red-400/70 bg-red-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
                style={{ boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
                <input
                  {...register('password', { required: 'Password is required' })}
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="sn-input w-full px-4 py-3.5 pr-12 rounded-2xl outline-none text-[14px] font-medium"
                />
                <button type="button" tabIndex={-1}
                  onClick={() => setShowPass(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-sky-500 transition-colors p-1 rounded-lg">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <AnimatePresence>
                {errors.password && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="mt-1.5 ml-1 text-[10px] font-bold text-red-400 flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-500 text-white flex items-center justify-center text-[7px] font-black shrink-0">✕</span>
                    {errors.password.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Forgot password — right aligned */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .41 }}
              className="flex justify-end">
              <button type="button"
                className="text-[11.5px] font-semibold text-slate-400 hover:text-sky-500 transition-colors">
                Forgot password?
              </button>
            </motion.div>

            {/* Submit button — matches Nexus blue Continue btn */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: .46 }}>
              <button
                type="submit"
                disabled={loading}
                className="sn-btn group relative w-full py-3.5 rounded-2xl font-bold text-[14px] text-white overflow-hidden transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[.98]"
                style={{
                  background: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 50%, #38bdf8 100%)',
                }}>
                {/* Hover shimmer */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl"
                  style={{ background: 'linear-gradient(135deg,#0369a1,#0284c7,#0ea5e9)' }} />
                <span className="relative flex items-center justify-center gap-2">
                  {loading
                    ? <><Loader2 className="animate-spin" size={16} /> Signing in…</>
                    : <><span>Continue</span><ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" /></>
                  }
                </span>
              </button>
            </motion.div>
          </form>

          {/* Divider */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .55 }}>
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-[11px] font-medium text-slate-400">or</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Create account */}
            <p className="text-center text-[13.5px] text-slate-500 font-normal">
              {"Don't have an account? "}
              <Link to="/signup"
                className="font-bold text-[#0a1628] hover:text-sky-500 transition-colors">
                Sign up
              </Link>
            </p>
          </motion.div>

          {/* Footer links */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .65 }}
            className="flex items-center justify-center gap-2 mt-8">
            <span className="text-[11px] text-slate-400">© StartupNest</span>
            <span className="text-slate-300">·</span>
            <button type="button" className="text-[11px] text-slate-400 hover:text-slate-600 transition-colors">Privacy</button>
            <span className="text-slate-300">·</span>
            <button type="button" className="text-[11px] text-slate-400 hover:text-slate-600 transition-colors">Terms</button>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
};

export default Login;