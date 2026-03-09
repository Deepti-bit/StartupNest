/**
 * EntrepreneurNavbar.jsx — StartupNest
 * Dark mode ON  → page is dark  + navbar goes LIGHT (white bg, dark text)
 * Dark mode OFF → page is light + navbar stays DARK  (#080c14)
 */

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Lightbulb, Send, LogOut,
  Menu, X, Sun, Moon, ChevronDown
} from 'lucide-react';

const EntrepreneurNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const [mobileOpen,      setMobileOpen]      = useState(false);
  const [dropdownOpen,    setDropdownOpen]     = useState(false);
  const [showLogoutModal, setShowLogoutModal]  = useState(false);
  const [isScrolled,      setIsScrolled]       = useState(false);
  const [isDark,          setIsDark]           = useState(() => localStorage.getItem('sn-theme') !== 'light');

  const userName = localStorage.getItem('userName') || 'User';
  const userRole = localStorage.getItem('role') || 'Entrepreneur';
  const initial  = userName.charAt(0).toUpperCase();

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem('sn-theme', next ? 'dark' : 'light');
  };

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    setShowLogoutModal(false);
    setDropdownOpen(false);
    localStorage.clear();
    setTimeout(() => navigate('/login'), 200);
  };

  const navLinks = [
    { name: 'Home',                       path: '/entrepreneur/home',          icon: <Home size={15} />      },
    { name: 'Entrepreneur Opportunities', path: '/entrepreneur/opportunities', icon: <Lightbulb size={15} /> },
    { name: 'My Submissions',             path: '/entrepreneur/my-submissions', icon: <Send size={15} />     },
  ];

  // ── Design tokens: flip when isDark ──────────────────────────────────────
  // isDark=true  → navbar is LIGHT (white)
  // isDark=false → navbar is DARK  (#080c14)

  const NAV_BG = isDark
    ? (isScrolled ? 'rgba(255,255,255,0.96)' : '#ffffff')
    : (isScrolled ? 'rgba(8,12,20,0.92)'     : '#080c14');

  const NAV_BORDER = isDark ? 'rgba(14,165,233,0.12)' : 'rgba(14,165,233,0.10)';
  const NAV_SHADOW = isScrolled
    ? (isDark ? '0 4px 20px rgba(0,0,0,0.08)' : '0 4px 32px rgba(0,0,0,0.28)')
    : 'none';

  const LOGO_TEXT   = isDark ? '#0a1628' : '#ffffff';
  const LOGO_SUB    = isDark ? 'rgba(14,165,233,0.50)' : 'rgba(56,189,248,0.40)';
  const LOGO_BORDER = isDark ? '#ffffff' : '#080c14';   // inner logo square border

  const LINK_ACTIVE = isDark ? '#0a1628' : '#ffffff';
  const LINK_IDLE   = '#64748b';
  const ACTIVE_BG   = 'rgba(14,165,233,0.10)';
  const ACTIVE_LINE = '#0ea5e9';

  const PILL_BG  = isDark ? 'rgba(0,0,0,0.04)'       : 'rgba(255,255,255,0.04)';
  const PILL_BDR = isDark ? 'rgba(0,0,0,0.10)'       : 'rgba(255,255,255,0.08)';

  const NAME_COLOR = isDark ? '#0a1628' : '#e2e8f0';
  const CARET_COLOR = isDark ? '#94a3b8' : '#64748b';

  const AVATAR_BG   = 'linear-gradient(135deg,#0ea5e9,#0284c7)';
  const AVATAR_RING = 'rgba(14,165,233,0.35)';

  // Dropdown always dark for legibility
  const DROP_BG   = '#0d1628';
  const DROP_BDR  = 'rgba(14,165,233,0.15)';
  const DROP_TEXT = '#e2e8f0';
  const DROP_SUB  = '#64748b';

  const MOBILE_BG  = isDark ? '#ffffff'              : '#080c14';
  const MOBILE_BDR = isDark ? 'rgba(0,0,0,0.08)'    : 'rgba(255,255,255,0.05)';
  const MOBILE_TEXT = isDark ? '#0a1628'             : '#e2e8f0';
  const MOBILE_IDLE = '#64748b';
  const HAMBURGER_COLOR = isDark ? '#0a1628' : '#e2e8f0';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        .sn-nav * { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
        .sn-nav-blur { backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
        html,body,#root { overflow-x: hidden; scrollbar-width: none; -ms-overflow-style: none; }
        *::-webkit-scrollbar { display: none; width: 0; height: 0; }
        * { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>

      <nav className="sn-nav fixed top-0 w-full z-[100] transition-all duration-300 sn-nav-blur"
        style={{ background: NAV_BG, borderBottom: `1px solid ${NAV_BORDER}`, boxShadow: NAV_SHADOW }}>

        <div className="max-w-7xl mx-auto px-5 h-[62px] flex items-center justify-between gap-4">

          {/* ── Logo ───────────────────────────────────────────────────── */}
          <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: .15 }}
            className="flex items-center gap-2.5 cursor-pointer shrink-0"
            onClick={() => navigate('/entrepreneur/home')}>
            <div className="relative w-9 h-9 shrink-0">
              <div className="absolute top-0 left-0 w-6 h-6 rounded-lg"
                style={{ background: 'linear-gradient(135deg,#38bdf8,#0ea5e9)', opacity: .9 }} />
              <div className="absolute bottom-0 right-0 w-6 h-6 rounded-lg"
                style={{ background: 'linear-gradient(135deg,#0284c7,#0369a1)', border: `2px solid ${LOGO_BORDER}` }} />
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <span className="text-white font-black text-xs leading-none drop-shadow">S</span>
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="text-[15px] font-black tracking-tight leading-none transition-colors duration-300"
                style={{ color: LOGO_TEXT }}>
                Startup<span style={{ color: '#0ea5e9' }}>Nest</span>
              </div>
              <div className="text-[8px] font-semibold tracking-[.18em] uppercase mt-0.5 transition-colors duration-300"
                style={{ color: LOGO_SUB }}>
                Premium Platform
              </div>
            </div>
          </motion.div>

          {/* ── Desktop Nav Pill ─────────────────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-0.5 px-1.5 py-1.5 rounded-2xl transition-all duration-300"
            style={{ background: PILL_BG, border: `1px solid ${PILL_BDR}` }}>
            {navLinks.map(link => {
              const active = location.pathname === link.path;
              return (
                <Link key={link.name} to={link.path}>
                  <div className="relative px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors duration-150"
                    style={{ color: active ? LINK_ACTIVE : LINK_IDLE }}>
                    {link.icon}
                    <span className="text-[12px] font-bold whitespace-nowrap">{link.name}</span>
                    {active && (
                      <motion.div layoutId="snActiveTab"
                        className="absolute inset-0 rounded-xl -z-10"
                        style={{ background: ACTIVE_BG, borderBottom: `2px solid ${ACTIVE_LINE}` }}
                        transition={{ type: 'spring', bounce: .2, duration: .4 }}
                      />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* ── Right ───────────────────────────────────────────────────── */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end transition-colors duration-300" style={{ lineHeight: 1.2 }}>
              <span className="text-[12px] font-black transition-colors duration-300" style={{ color: NAME_COLOR }}>{userName}</span>
              <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: '#0ea5e9' }}>{userRole}</span>
            </div>

            {/* Avatar + Dropdown */}
            <div ref={dropdownRef} className="relative">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: .97 }}
                onClick={() => setDropdownOpen(o => !o)}
                className="flex items-center gap-1.5 rounded-2xl p-1 transition-all duration-200 outline-none"
                style={{
                  background: dropdownOpen ? ACTIVE_BG : 'transparent',
                  border: `1.5px solid ${dropdownOpen ? ACTIVE_LINE : AVATAR_RING}`,
                }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-[13px]"
                  style={{ background: AVATAR_BG, boxShadow: `0 0 0 2px ${AVATAR_RING}` }}>
                  {initial}
                </div>
                <motion.div animate={{ rotate: dropdownOpen ? 180 : 0 }} transition={{ duration: .2 }}>
                  <ChevronDown size={13} style={{ color: CARET_COLOR }} />
                </motion.div>
              </motion.button>

              {/* Dropdown — always dark */}
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: .96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: .96 }}
                    transition={{ duration: .18, ease: [.22, 1, .36, 1] }}
                    className="absolute right-0 top-[calc(100%+8px)] w-56 rounded-2xl overflow-hidden z-50"
                    style={{ background: DROP_BG, border: `1px solid ${DROP_BDR}`, boxShadow: '0 16px 48px rgba(0,0,0,0.5)' }}>

                    {/* Profile */}
                    <div className="px-4 py-3.5 border-b" style={{ borderColor: DROP_BDR }}>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0"
                          style={{ background: AVATAR_BG }}>{initial}</div>
                        <div>
                          <p className="text-[12.5px] font-black leading-tight" style={{ color: DROP_TEXT }}>{userName}</p>
                          <p className="text-[9px] font-bold uppercase tracking-widest text-sky-400">{userRole}</p>
                        </div>
                      </div>
                    </div>

                    {/* Theme toggle */}
                    <div className="px-4 py-3 border-b" style={{ borderColor: DROP_BDR }}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {isDark
                            ? <Moon size={13} style={{ color: '#0ea5e9' }} />
                            : <Sun  size={13} style={{ color: '#f59e0b' }} />}
                          <span className="text-[11px] font-bold" style={{ color: DROP_SUB }}>
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
                    </div>

                    {/* Sign out */}
                    <div className="p-2">
                      <button onClick={() => { setDropdownOpen(false); setShowLogoutModal(true); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all duration-150 group"
                        style={{ color: '#f43f5e' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(244,63,94,0.08)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <LogOut size={14} />
                        <span className="text-[12px] font-bold">Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile hamburger */}
            <button className="lg:hidden p-2 rounded-xl transition-all duration-300"
              style={{ color: HAMBURGER_COLOR, background: PILL_BG, border: `1px solid ${PILL_BDR}` }}
              onClick={() => setMobileOpen(o => !o)}>
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ──────────────────────────────────────────────── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }} transition={{ duration: .22 }}
              className="lg:hidden overflow-hidden"
              style={{ background: MOBILE_BG, borderTop: `1px solid ${MOBILE_BDR}` }}>
              <div className="p-4 space-y-1">
                {navLinks.map(link => {
                  const active = location.pathname === link.path;
                  return (
                    <Link key={link.name} to={link.path} onClick={() => setMobileOpen(false)}>
                      <div className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
                        style={{
                          background: active ? ACTIVE_BG : 'transparent',
                          borderLeft: active ? `3px solid ${ACTIVE_LINE}` : '3px solid transparent',
                          color: active ? LINK_ACTIVE : MOBILE_IDLE,
                        }}>
                        {link.icon}
                        <span className="text-[13px] font-bold" style={{ color: active ? LINK_ACTIVE : MOBILE_TEXT }}>
                          {link.name}
                        </span>
                      </div>
                    </Link>
                  );
                })}

                {/* Mobile theme toggle */}
                <div className="flex items-center justify-between px-4 py-3 mt-2"
                  style={{ borderTop: `1px solid ${MOBILE_BDR}` }}>
                  <div className="flex items-center gap-2">
                    {isDark
                      ? <Moon size={14} style={{ color: '#0ea5e9' }} />
                      : <Sun  size={14} style={{ color: '#f59e0b' }} />}
                    <span className="text-[12px] font-bold" style={{ color: MOBILE_TEXT }}>
                      {isDark ? 'Dark Mode' : 'Light Mode'}
                    </span>
                  </div>
                  <button onClick={toggleTheme}
                    className="relative w-10 h-5 rounded-full transition-colors duration-300"
                    style={{ background: isDark ? '#0ea5e9' : '#475569' }}>
                    <motion.div animate={{ x: isDark ? 20 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-md" />
                  </button>
                </div>

                <button onClick={() => { setMobileOpen(false); setShowLogoutModal(true); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl mt-1"
                  style={{ color: '#f43f5e', background: 'rgba(244,63,94,0.06)' }}>
                  <LogOut size={15} />
                  <span className="text-[13px] font-bold">Sign Out</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── Logout Modal ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showLogoutModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowLogoutModal(false)} className="absolute inset-0"
              style={{ background: 'rgba(8,12,20,0.80)', backdropFilter: 'blur(8px)' }} />
            <motion.div
              initial={{ scale: .92, opacity: 0, y: 16 }} animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: .92, opacity: 0, y: 16 }} transition={{ duration: .25, ease: [.22, 1, .36, 1] }}
              className="relative w-full max-w-sm rounded-[2rem] p-8 text-center shadow-2xl"
              style={{ fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif", background: '#0d1628', border: '1px solid rgba(14,165,233,0.15)', boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ background: 'rgba(244,63,94,0.10)' }}>
                <LogOut size={28} style={{ color: '#f43f5e' }} />
              </div>
              <h3 className="text-xl font-black mb-2 text-slate-100" style={{ letterSpacing: '-0.02em' }}>Sign out?</h3>
              <p className="text-sm font-medium mb-7 text-slate-500">
                You'll need to log back in to access your StartupNest account.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowLogoutModal(false)}
                  className="flex-1 py-3 rounded-2xl text-[13px] font-bold text-slate-400 transition-all"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  Stay Here
                </button>
                <button onClick={handleLogout}
                  className="flex-1 py-3 rounded-2xl text-[13px] font-black text-white transition-all active:scale-[.97]"
                  style={{ background: 'linear-gradient(135deg,#e11d48,#f43f5e)', boxShadow: '0 6px 20px rgba(244,63,94,0.35)' }}>
                  Yes, Sign Out
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EntrepreneurNavbar;