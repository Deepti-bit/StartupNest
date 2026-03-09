import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, CheckCircle, Shield, Zap,
  Star, ChevronRight, Menu, X, Briefcase, Rocket,
  MessageSquare, BarChart2,
} from 'lucide-react';
import './HomePage.css';

/* ─────────────────────────────────────────────────────────
   ANIMATED COUNTER
───────────────────────────────────────────────────────── */
function Counter({ to, suffix = '', duration = 1600, go }) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!go) return;
    let start = null;
    const tick = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * to));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [go, to, duration]);

  return <>{val.toLocaleString()}{suffix}</>;
}

/* ─────────────────────────────────────────────────────────
   FADE-UP WRAPPER
───────────────────────────────────────────────────────── */
function FadeUp({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   DATA CONSTANTS
───────────────────────────────────────────────────────── */

const FEATURES = [
  {
    icon: Zap,
    iconClass: 'feature-icon-blue',
    title: 'Smart Matching',
    desc: "Get paired with mentors who've built in your exact industry and stage — not random connections.",
  },
  {
    icon: Shield,
    iconClass: 'feature-icon-green',
    title: 'Verified Mentors',
    desc: 'Every mentor is vetted for real exits and domain expertise. Only practitioners, no theorists.',
  },
  {
    icon: MessageSquare,
    iconClass: 'feature-icon-purple',
    title: 'Direct Pitching',
    desc: 'Share your deck directly with investors actively looking for startups at your stage.',
  },
  {
    icon: BarChart2,
    iconClass: 'feature-icon-amber',
    title: 'Growth Tracking',
    desc: 'Track milestones, KPIs, and investor engagement in one clean dashboard built for founders.',
  },
];

const HOW = [
  {
    num: '01',
    badgeClass: 'step-badge-blue',
    title: 'Create your profile',
    desc: 'Tell us your industry, stage, and what you need. Founders pitch, mentors define their thesis.',
  },
  {
    num: '02',
    badgeClass: 'step-badge-green',
    title: 'Get matched',
    desc: 'Our algorithm surfaces the right people for your specific goals and growth stage.',
  },
  {
    num: '03',
    badgeClass: 'step-badge-purple',
    title: 'Grow together',
    desc: 'Schedule sessions, get feedback on your pitch, and unlock real funding opportunities.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    role: 'Founder, HealthBridge AI',
    initials: 'PS',
    avatarClass: 'testimonial-avatar-blue',
    badge: '$2.4M raised',
    text: "StartupNest connected me with a mentor who'd scaled a health-tech company. Within 3 months I had my first term sheet.",
  },
  {
    name: 'Arjun Mehta',
    role: 'Founder, LogiFlow',
    initials: 'AM',
    avatarClass: 'testimonial-avatar-green',
    badge: '$800K raised',
    text: 'The quality of mentors here is unmatched — 4 exits between them. That kind of wisdom is priceless at the early stage.',
  },
  {
    name: 'Sneha Patel',
    role: 'Founder, EduSpark',
    initials: 'SP',
    avatarClass: 'testimonial-avatar-purple',
    badge: 'Series A',
    text: 'After one session my investor conversion rate tripled. The structured feedback on my deck made all the difference.',
  },
];

const SOCIAL_AVATARS = [
  { initials: 'SV', cls: 'avatar-sv' },
  { initials: 'RK', cls: 'avatar-rk' },
  { initials: 'AM', cls: 'avatar-am' },
  { initials: 'PG', cls: 'avatar-pg' },
];

const DASH_STATS = [
  { label: 'Profile Views', val: '2,847', up: '+18%', upClass: 'stat-up-blue' },
  { label: 'Mentor Matches', val: '12', up: '+3 new', upClass: 'stat-up-green' },
  { label: 'Pitch Reviews', val: '5', up: 'This week', upClass: 'stat-up-purple' },
];

const ACTIVITY = [
  { initial: 'R', dotClass: 'activity-dot-blue', name: 'Rahul Khanna', action: 'viewed your pitch deck', time: '2m ago' },
  { initial: 'N', dotClass: 'activity-dot-green', name: 'Neha Gupta', action: 'sent a connection request', time: '1h ago' },
  { initial: 'V', dotClass: 'activity-dot-purple', name: 'Vikram Shah', action: 'commented on your profile', time: '3h ago' },
];

/* ─────────────────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────────────────── */
function Navbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const scrollTo = (id) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const NAV = [
    { label: 'How it works', id: 'how-it-works' },
    { label: 'Features', id: 'features' },
    { label: 'Mentors', id: 'for-mentors' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100'
            : 'bg-transparent'
          }`}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">

          {/* Logo */}
          <button
            onClick={() => scrollTo('hero')}
            className="flex items-center gap-2.5 shrink-0"
          >
            <div className="w-8 h-8 bg-[#002a5c] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm leading-none">S</span>
            </div>
            <span className="text-[#002a5c] font-extrabold text-lg tracking-tight">
              Startup<span className="text-blue-500">Nest</span>
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map(n => (
              <button
                key={n.id}
                onClick={() => scrollTo(n.id)}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:text-[#002a5c] hover:bg-gray-50 transition-all"
              >
                {n.label}
              </button>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-[#002a5c] transition-colors"
            >
              Sign in
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-5 py-2.5 bg-[#002a5c] text-white rounded-xl text-sm font-bold hover:bg-[#003878] active:scale-95 transition-all shadow-sm"
            >
              Get started free
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(o => !o)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-50"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="fixed top-16 inset-x-0 z-40 bg-white border-b border-gray-100 shadow-lg px-5 py-4 space-y-1 md:hidden"
          >
            {NAV.map(n => (
              <button
                key={n.id}
                onClick={() => scrollTo(n.id)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all"
              >
                {n.label}
                <ChevronRight size={14} className="text-gray-400" />
              </button>
            ))}
            <div className="pt-3 flex flex-col gap-2">
              <button
                onClick={() => { setOpen(false); navigate('/login'); }}
                className="w-full py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-700"
              >
                Sign in
              </button>
              <button
                onClick={() => { setOpen(false); navigate('/signup'); }}
                className="w-full py-3 rounded-xl bg-[#002a5c] text-white text-sm font-bold"
              >
                Get started free
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────── */
export default function LandingPage() {
  const navigate = useNavigate();
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: '-80px' });

  return (
    <div className="lp-font bg-white min-h-screen">
      <Navbar />

      {/* ══ HERO ════════════════════════════════════════════ */}
      <section id="hero" className="relative pt-28 pb-20 sm:pt-36 sm:pb-28 overflow-hidden">

        {/* Dot grid */}
        <div className="absolute inset-0 dot-grid opacity-40" />

        {/* Radial wash — CSS class replaces inline style */}
        <div className="absolute inset-0 hero-bg-wash pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-5 sm:px-8">
          <div className="max-w-3xl mx-auto text-center">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              Now supporting 500+ early-stage startups
            </motion.div>

            {/* Headline — letter-spacing + gradient via CSS classes */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="hero-h1 text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0a1628] leading-[1.15] tracking-tight mb-6"
            >
              Where founders meet{' '}
              <span className="relative inline-block hero-headline-gradient">
                the right mentors.
              </span>
            </motion.h1>

            {/* Sub */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-gray-500 leading-relaxed mb-10 max-w-xl mx-auto font-normal"
            >
              StartupNest is a professional network that connects ambitious founders with
              battle-tested mentors to grow, pitch, and get funded.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.32 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              <button
                onClick={() => navigate('/signup', { state: { role: 'Entrepreneur' } })}
                className="group w-full sm:w-auto flex items-center justify-center gap-2 bg-[#002a5c] text-white px-7 py-3.5 rounded-xl text-sm font-bold hover:bg-[#003878] active:scale-95 transition-all shadow-md hover:shadow-lg"
              >
                Join as Founder
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/signup', { state: { role: 'Mentor' } })}
                className="w-full sm:w-auto flex items-center justify-center gap-2 border border-gray-200 text-gray-700 px-7 py-3.5 rounded-xl text-sm font-bold hover:border-[#002a5c] hover:text-[#002a5c] hover:bg-gray-50 transition-all"
              >
                <Briefcase size={15} />
                Become a Mentor
              </button>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8"
            >
              {/* Avatar stack — each bg via CSS class */}
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {SOCIAL_AVATARS.map(({ initials, cls }) => (
                    <div
                      key={initials}
                      className={`${cls} w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold text-white`}
                    >
                      {initials}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex gap-0.5 mb-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={11} fill="#f59e0b" className="text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 font-medium">1,200+ members</p>
                </div>
              </div>

              <div className="hidden sm:block w-px h-8 bg-gray-200" />

              {/* Quick stats */}
              <div className="flex items-center gap-5">
                {[
                  { v: '$48M+', l: 'Total raised' },
                  { v: '500+', l: 'Startups' },
                  { v: '92%', l: 'Satisfaction' },
                ].map(({ v, l }) => (
                  <div key={l} className="text-center">
                    <p className="text-sm font-extrabold text-[#002a5c]">{v}</p>
                    <p className="text-[10px] text-gray-400 font-medium">{l}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Dashboard preview card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-16 max-w-4xl mx-auto"
          >
            <div className="relative rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-gray-200/80 overflow-hidden">

              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-white border border-gray-200 rounded-md px-3 py-1 text-xs text-gray-400 max-w-xs mx-auto text-center">
                    startupnest.app/dashboard
                  </div>
                </div>
              </div>

              {/* Stat cards — colour via CSS class on "up" text */}
              <div className="bg-slate-50 p-4 sm:p-6">
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {DASH_STATS.map(s => (
                    <div key={s.label} className="bg-white rounded-xl p-3 sm:p-4 border border-gray-100 shadow-sm">
                      <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">{s.label}</div>
                      <div className="text-lg sm:text-2xl font-extrabold text-[#0a1628] leading-none">{s.val}</div>
                      <div className={`text-[10px] font-semibold mt-1 ${s.upClass}`}>{s.up}</div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Recent activity — dot colour via CSS class */}
                  <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Recent Activity</p>
                    {ACTIVITY.map(a => (
                      <div key={a.name} className="flex items-start gap-2.5 mb-2.5 last:mb-0">
                        <div className={`${a.dotClass} w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold text-white shrink-0 mt-0.5`}>
                          {a.initial}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-800 truncate">
                            <span className="font-bold">{a.name}</span> {a.action}
                          </p>
                          <p className="text-[10px] text-gray-400">{a.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Top match */}
                  <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Top Mentor Match</p>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-[#002a5c] flex items-center justify-center text-white text-xs font-bold shrink-0">RK</div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">Rahul Khanna</p>
                        <p className="text-xs text-gray-400">Partner, Accel · 3 exits</p>
                      </div>
                      <div className="ml-auto bg-green-50 text-green-700 text-[9px] font-bold px-2 py-1 rounded-full border border-green-100">
                        98% match
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {['B2B SaaS', 'FinTech', 'Series A'].map(t => (
                        <span key={t} className="bg-gray-50 border border-gray-100 text-gray-500 text-[9px] font-semibold px-2 py-0.5 rounded-full">{t}</span>
                      ))}
                    </div>
                    <button className="w-full py-2 bg-[#002a5c] text-white text-xs font-bold rounded-lg hover:bg-[#003878] transition-colors">
                      Request Introduction
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══ TRUST BAR ═══════════════════════════════════════ */}
      <section className="border-y border-gray-100 bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <p className="text-center text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6">
            Mentors from the world's leading ecosystems
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 lg:gap-16">
            {['Y Combinator', 'Techstars', 'Sequoia', '500 Global', 'Accel'].map(name => (
              <span
                key={name}
                className="text-sm font-extrabold text-gray-300 hover:text-gray-500 transition-colors duration-300 tracking-tight cursor-default select-none"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══ ANIMATED STATS ══════════════════════════════════ */}
      <section ref={statsRef} className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { val: 1200, suffix: '+', label: 'Members', desc: 'Founders & mentors', prefix: '' },
              { val: 48, suffix: 'M+', label: 'Funding Raised', desc: 'Total USD raised', prefix: '$' },
              { val: 500, suffix: '+', label: 'Startups', desc: 'Actively supported', prefix: '' },
              { val: 92, suffix: '%', label: 'Satisfaction', desc: 'Member satisfaction', prefix: '' },
            ].map(({ val, suffix, label, desc, prefix }) => (
              <FadeUp key={label} className="text-center">
                {/* Letter-spacing via CSS class .stat-number */}
                <div className="stat-number text-3xl sm:text-4xl font-extrabold text-[#002a5c] mb-1 tracking-tight">
                  {prefix}<Counter to={val} suffix={suffix} go={statsInView} />
                </div>
                <div className="text-sm font-bold text-gray-800 mb-0.5">{label}</div>
                <div className="text-xs text-gray-400 font-normal">{desc}</div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ════════════════════════════════════ */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-[#f8fafc]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <FadeUp className="text-center mb-14">
            <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full mb-4">
              How it works
            </span>
            {/* Letter-spacing via .section-h2 */}
            <h2 className="section-h2 text-3xl sm:text-4xl font-extrabold text-[#0a1628] tracking-tight">
              From signup to funded
            </h2>
            <p className="text-gray-500 mt-3 text-base max-w-md mx-auto font-normal leading-relaxed">
              Three straightforward steps to start connecting and growing.
            </p>
          </FadeUp>

          <div className="grid md:grid-cols-3 gap-6 relative">
            <div className="hidden md:block absolute top-9 left-1/3 right-1/3 h-px bg-gradient-to-r from-blue-200 via-green-200 to-purple-200" />
            {HOW.map((step, i) => (
              <FadeUp key={step.num} delay={i * 0.1}>
                <div className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all">
                  {/* Badge bg via CSS class */}
                  <div className={`${step.badgeClass} w-10 h-10 rounded-xl flex items-center justify-center mb-5 text-white text-sm font-black`}>
                    {step.num}
                  </div>
                  <h3 className="text-base font-bold text-[#0a1628] mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed font-normal">{step.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURES ════════════════════════════════════════ */}
      <section id="features" className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <FadeUp className="text-center mb-14">
            <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-purple-600 bg-purple-50 border border-purple-100 px-3 py-1.5 rounded-full mb-4">
              Platform features
            </span>
            <h2 className="section-h2 text-3xl sm:text-4xl font-extrabold text-[#0a1628] tracking-tight">
              Built for real growth
            </h2>
            <p className="text-gray-500 mt-3 text-base max-w-md mx-auto font-normal leading-relaxed">
              Every feature is designed around what founders and mentors actually need.
            </p>
          </FadeUp>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f, i) => (
              <FadeUp key={f.title} delay={i * 0.08}>
                <div className="group bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg hover:border-gray-200 hover:-translate-y-1 transition-all duration-300 h-full">
                  {/* Icon wrapper — bg + colour via CSS class */}
                  <div className={`${f.iconClass} w-10 h-10 rounded-xl flex items-center justify-center mb-4`}>
                    <f.icon size={18} />
                  </div>
                  <h3 className="text-sm font-bold text-[#0a1628] mb-2">{f.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed font-normal">{f.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ════════════════════════════════════ */}
      <section className="py-16 sm:py-24 bg-[#f8fafc]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <FadeUp className="text-center mb-14">
            <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-green-600 bg-green-50 border border-green-100 px-3 py-1.5 rounded-full mb-4">
              Success stories
            </span>
            <h2 className="section-h2 text-3xl sm:text-4xl font-extrabold text-[#0a1628] tracking-tight">
              Founders who made it
            </h2>
          </FadeUp>

          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <FadeUp key={t.name} delay={i * 0.1}>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all h-full flex flex-col">
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} size={13} fill="#f59e0b" className="text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed flex-1 mb-5 font-normal">"{t.text}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                    {/* Avatar bg via CSS class */}
                    <div className={`${t.avatarClass} w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0`}>
                      {t.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#0a1628] truncate">{t.name}</p>
                      <p className="text-xs text-gray-400 truncate">{t.role}</p>
                    </div>
                    <span className="shrink-0 text-[9px] font-bold bg-green-50 text-green-700 border border-green-100 px-2 py-1 rounded-full">
                      {t.badge}
                    </span>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FOR MENTORS ═════════════════════════════════════ */}
      <section id="for-mentors" className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            <FadeUp>
              <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-orange-600 bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-full mb-5">
                For mentors &amp; investors
              </span>
              <h2 className="section-h2 text-3xl sm:text-4xl font-extrabold text-[#0a1628] tracking-tight mb-4">
                Build your portfolio. Shape the next generation.
              </h2>
              <p className="text-gray-500 text-base leading-relaxed mb-8 font-normal">
                Whether you're an angel investor or industry expert, StartupNest gives you structured
                tools to find, support, and invest in the most promising founders.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  'Define your investment thesis and criteria',
                  'Receive matched startup pitches directly',
                  "Track mentees' milestones and growth",
                  'Build your mentor reputation and portfolio',
                ].map(b => (
                  <div key={b} className="flex items-center gap-3">
                    <CheckCircle size={16} className="text-orange-500 shrink-0" />
                    <span className="text-sm text-gray-600 font-medium">{b}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate('/signup', { state: { role: 'Mentor' } })}
                className="group inline-flex items-center gap-2 bg-[#002a5c] text-white px-6 py-3.5 rounded-xl text-sm font-bold hover:bg-[#003878] active:scale-95 transition-all shadow-sm"
              >
                Apply as Mentor
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </FadeUp>

            {/* Mentor card mockup */}
            <FadeUp delay={0.15}>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 max-w-sm mx-auto lg:mx-0">
                <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-50">
                  <div className="w-12 h-12 rounded-xl bg-[#002a5c] flex items-center justify-center text-white font-bold shrink-0">
                    RK
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0a1628]">Rahul Khanna</p>
                    <p className="text-xs text-gray-400">Partner, Accel India · 3 exits</p>
                    <span className="inline-block mt-1 text-[9px] font-bold bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded-full">
                      ● Accepting pitches
                    </span>
                  </div>
                </div>

                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Investment Thesis</p>
                <p className="text-xs text-gray-600 leading-relaxed mb-4 font-normal">
                  B2B SaaS, FinTech infrastructure, and AI-native startups at Series A. Cheque ₹2–15 Cr.
                </p>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {['B2B SaaS', 'FinTech', 'AI/ML', 'Series A'].map(t => (
                    <span key={t} className="bg-gray-50 border border-gray-100 text-gray-500 text-[9px] font-semibold px-2 py-1 rounded-full">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-3 mb-5 pt-4 border-t border-gray-50">
                  {[
                    { v: '24', l: 'Portfolio' },
                    { v: '₹8Cr', l: 'Avg check' },
                    { v: '78%', l: 'Success' },
                  ].map(m => (
                    <div key={m.l} className="text-center">
                      <p className="text-base font-extrabold text-[#002a5c]">{m.v}</p>
                      <p className="text-[9px] text-gray-400 font-medium">{m.l}</p>
                    </div>
                  ))}
                </div>

                <button className="w-full py-2.5 bg-[#002a5c] text-white rounded-xl text-xs font-bold hover:bg-[#003878] transition-colors">
                  Request Introduction
                </button>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ══ CTA SECTION ═════════════════════════════════════ */}
      <section className="py-16 sm:py-24 bg-[#002a5c] relative overflow-hidden">

        {/* White dot grid — CSS class replaces inline style */}
        <div className="absolute inset-0 dot-grid-white opacity-10" />

        {/* Radial glow — CSS class replaces inline style */}
        <div className="absolute inset-0 cta-glow pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <FadeUp>
            {/* Letter-spacing via .cta-h2 */}
            <h2 className="cta-h2 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-5 tracking-tight">
              Ready to build something great?
            </h2>
            <p className="text-blue-200 text-base leading-relaxed mb-10 font-normal max-w-xl mx-auto">
              Join 1,200+ founders and mentors already using StartupNest to connect, grow, and raise funding.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => navigate('/signup', { state: { role: 'Entrepreneur' } })}
                className="group w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-[#002a5c] px-7 py-3.5 rounded-xl text-sm font-bold hover:bg-blue-50 active:scale-95 transition-all shadow-lg"
              >
                <Rocket size={15} />
                Join as Founder
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/signup', { state: { role: 'Mentor' } })}
                className="w-full sm:w-auto flex items-center justify-center gap-2 border border-white/30 text-white px-7 py-3.5 rounded-xl text-sm font-bold hover:border-white/60 hover:bg-white/5 transition-all"
              >
                <Briefcase size={15} />
                Apply as Mentor
              </button>
            </div>
            <p className="text-blue-300/60 text-xs font-medium mt-6">
              Free forever for entrepreneurs · No credit card required
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ══ FOOTER ══════════════════════════════════════════ */}
      <footer className="bg-[#001a3d] border-t border-white/10 py-12">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">

            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-[#002a5c] font-bold text-xs">S</span>
                </div>
                <span className="text-white font-extrabold tracking-tight">
                  Startup<span className="text-sky-400">Nest</span>
                </span>
              </div>
              <p className="text-blue-200/50 text-xs leading-relaxed font-normal">
                The professional network for ambitious founders and battle-tested mentors.
              </p>
            </div>

            {/* Link columns */}
            {[
              {
                title: 'Platform',
                items: [
                  { label: 'Features', action: () => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }) },
                  { label: 'How It Works', action: () => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }) },
                  { label: 'For Mentors', action: () => document.getElementById('for-mentors')?.scrollIntoView({ behavior: 'smooth' }) },
                ],
              },
              {
                title: 'Account',
                items: [
                  { label: 'Sign In', action: () => navigate('/login') },
                  { label: 'Join as Founder', action: () => navigate('/signup', { state: { role: 'Entrepreneur' } }) },
                  { label: 'Become Mentor', action: () => navigate('/signup', { state: { role: 'Mentor' } }) },
                ],
              },
              {
                title: 'Company',
                items: [
                  { label: 'About', action: () => { } },
                  { label: 'Privacy', action: () => { } },
                  { label: 'Terms', action: () => { } },
                ],
              },
            ].map(col => (
              <div key={col.title}>
                <p className="text-[9px] font-bold uppercase tracking-widest text-white/30 mb-4">{col.title}</p>
                <div className="space-y-2.5">
                  {col.items.map(item => (
                    <button
                      key={item.label}
                      onClick={item.action}
                      className="block text-xs text-blue-200/50 hover:text-white transition-colors font-medium"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-blue-200/30 text-[10px] font-medium">
              © 2026 StartupNest Inc. All rights reserved.
            </p>
            <p className="text-blue-200/30 text-[10px] font-medium">
              Accelerating the next generation of founders.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}