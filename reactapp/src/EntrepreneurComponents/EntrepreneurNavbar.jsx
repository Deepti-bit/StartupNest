import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import axios from 'axios';
import {
  Home,
  Lightbulb,
  Send,
  LogOut,
  Bell,
  Menu,
  X,
  Rocket,
  ChevronDown,
  Zap,
  Settings,
  User,
  TrendingUp,
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

const EntrepreneurNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const username = localStorage.getItem('username') || 'Entrepreneur';
  const role = localStorage.getItem('role') || 'Entrepreneur';

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch notifications from backend
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE}/notifications/getAll`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(res.data || []);
      } catch {
        // Fallback mock data
        setNotifications([
          { _id: '1', message: 'Your HealthTech idea was shortlisted!', read: false, time: '2h ago' },
          { _id: '2', message: 'New mentor opportunity in FinTech added', read: false, time: '5h ago' },
          { _id: '3', message: 'Profile review completed', read: true, time: '1d ago' },
        ]);
      }
    };
    fetchNotifications();
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifDropdown(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfileDropdown(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE}/notifications/markAllRead`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {}
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE}/auth/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {}
    localStorage.clear();
    toast.success('Logged out successfully!', {
      icon: '👋',
      style: { borderRadius: '12px', background: '#0f172a', color: '#f8fafc', fontWeight: '700' },
    });
    setTimeout(() => navigate('/login'), 900);
  };

  const navLinks = [
    { name: 'Dashboard', path: '/home', icon: <Home size={16} /> },
    { name: 'Opportunities', path: '/mentor-opportunities', icon: <Lightbulb size={16} /> },
    { name: 'My Ventures', path: '/my-submissions', icon: <TrendingUp size={16} /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <Toaster position="top-center" />

      {/* NAVBAR */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          isScrolled
            ? 'bg-[#060d1f]/95 backdrop-blur-2xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.4)] py-3'
            : 'bg-transparent py-5'
        }`}
        style={{
          background: isScrolled
            ? 'rgba(6,13,31,0.95)'
            : 'linear-gradient(180deg, rgba(6,13,31,1) 0%, rgba(6,13,31,0.8) 100%)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

          {/* LOGO */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => navigate('/home')}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#6366f1] flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.5)]">
                <Rocket size={20} className="text-white" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#060d1f] animate-pulse" />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-black text-white tracking-tight">
                Startup<span className="text-[#6366f1]">Nest</span>
              </span>
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] -mt-0.5">
                Entrepreneur Portal
              </div>
            </div>
          </motion.div>

          {/* DESKTOP NAV */}
          <div className="hidden lg:flex items-center gap-1 bg-white/5 border border-white/10 rounded-2xl p-1.5 backdrop-blur-xl">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className={`relative px-5 py-2.5 rounded-xl flex items-center gap-2.5 text-sm font-bold transition-all duration-200 ${
                    isActive(link.path)
                      ? 'text-white'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {isActive(link.path) && (
                    <motion.div
                      layoutId="navActiveIndicator"
                      className="absolute inset-0 bg-gradient-to-r from-[#3b82f6]/30 to-[#6366f1]/30 border border-[#6366f1]/30 rounded-xl"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {link.icon}
                    {link.name}
                  </span>
                </motion.div>
              </Link>
            ))}
          </div>

          {/* RIGHT SECTION */}
          <div className="flex items-center gap-3">

            {/* NOTIFICATION BELL */}
            <div ref={notifRef} className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setShowNotifDropdown(!showNotifDropdown); setShowProfileDropdown(false); }}
                className="relative w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
              >
                <Bell size={18} className="text-slate-300" />
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-rose-500 text-[9px] font-black text-white rounded-full flex items-center justify-center border-2 border-[#060d1f] px-0.5"
                  >
                    {unreadCount}
                  </motion.span>
                )}
              </motion.button>

              <AnimatePresence>
                {showNotifDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 6, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-80 bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                  >
                    <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
                      <span className="text-sm font-black text-white">Notifications</span>
                      {unreadCount > 0 && (
                        <button onClick={markAllRead} className="text-[10px] font-bold text-[#6366f1] hover:text-white transition-colors">
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="py-10 text-center text-slate-500 text-sm font-medium">No notifications yet</div>
                      ) : notifications.map((notif) => (
                        <div
                          key={notif._id}
                          className={`px-5 py-3.5 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${!notif.read ? 'bg-[#6366f1]/5' : ''}`}
                        >
                          <div className="flex items-start gap-3">
                            {!notif.read && <div className="w-2 h-2 bg-[#6366f1] rounded-full mt-1.5 shrink-0" />}
                            {notif.read && <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" />}
                            <div>
                              <p className={`text-xs font-semibold ${notif.read ? 'text-slate-400' : 'text-white'}`}>{notif.message}</p>
                              <p className="text-[10px] text-slate-500 mt-0.5">{notif.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* PROFILE DROPDOWN */}
            <div ref={profileRef} className="relative hidden md:block">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { setShowProfileDropdown(!showProfileDropdown); setShowNotifDropdown(false); }}
                className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-3 py-2 hover:bg-white/10 transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#6366f1] flex items-center justify-center text-white font-black text-sm">
                  {username.charAt(0).toUpperCase()}
                </div>
                <div className="text-left">
                  <p className="text-xs font-black text-white leading-none">{username}</p>
                  <p className="text-[9px] text-[#6366f1] font-bold uppercase tracking-wider mt-0.5">{role}</p>
                </div>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} />
              </motion.button>

              <AnimatePresence>
                {showProfileDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 6, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-52 bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                  >
                    {[
                      { icon: <User size={14} />, label: 'My Profile', action: () => navigate('/profile') },
                      { icon: <Send size={14} />, label: 'My Submissions', action: () => navigate('/my-submissions') },
                      { icon: <Settings size={14} />, label: 'Settings', action: () => navigate('/settings') },
                    ].map((item) => (
                      <button
                        key={item.label}
                        onClick={() => { item.action(); setShowProfileDropdown(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <span className="text-[#6366f1]">{item.icon}</span>
                        {item.label}
                      </button>
                    ))}
                    <div className="border-t border-white/10 p-2">
                      <button
                        onClick={() => { setShowProfileDropdown(false); setShowLogoutModal(true); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-rose-400 hover:text-white hover:bg-rose-500/20 rounded-xl transition-colors"
                      >
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* LOGOUT BUTTON (compact, desktop only when no profile dropdown) */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowLogoutModal(true)}
              className="hidden md:hidden w-10 h-10 items-center justify-center bg-rose-500/10 border border-rose-500/20 rounded-xl hover:bg-rose-500 hover:border-rose-500 text-rose-400 hover:text-white transition-all"
            >
              <LogOut size={18} />
            </motion.button>

            {/* MOBILE TOGGLE */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="lg:hidden w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all"
              onClick={() => setIsMobileOpen(!isOpen)}
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <X size={20} />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Menu size={20} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden border-t border-white/10 overflow-hidden bg-[#060d1f]/98 backdrop-blur-xl"
            >
              <div className="px-6 py-6 space-y-2">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsMobileOpen(false)}
                      className={`flex items-center gap-4 px-4 py-3.5 rounded-xl font-bold text-sm transition-all ${
                        isActive(link.path)
                          ? 'bg-[#6366f1]/20 text-white border border-[#6366f1]/30'
                          : 'text-slate-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <span className={isActive(link.path) ? 'text-[#6366f1]' : ''}>{link.icon}</span>
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: navLinks.length * 0.07 }} className="pt-2 border-t border-white/10 mt-2">
                  <button
                    onClick={() => { setIsMobileOpen(false); setShowLogoutModal(true); }}
                    className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl font-bold text-sm text-rose-400 hover:bg-rose-500/10 transition-all"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* LOGOUT CONFIRMATION MODAL */}
      <AnimatePresence>
        {showLogoutModal && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isLoggingOut && setShowLogoutModal(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 30 }}
              transition={{ type: 'spring', bounce: 0.3 }}
              className="relative w-full max-w-sm bg-[#0f172a] border border-white/10 rounded-[2rem] p-8 text-center shadow-2xl overflow-hidden"
            >
              {/* Decorative glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent rounded-full" />

              <div className="w-20 h-20 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <LogOut size={36} className="text-rose-400" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">Leaving so soon?</h3>
              <p className="text-slate-400 text-sm font-medium mb-8 leading-relaxed">
                Are you sure you want to end your session on <span className="text-white font-bold">StartupNest</span>?
              </p>
              <div className="flex gap-3">
                <button
                  disabled={isLoggingOut}
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 font-bold rounded-xl transition-all text-sm"
                >
                  Stay Here
                </button>
                <button
                  disabled={isLoggingOut}
                  onClick={handleLogout}
                  className="flex-1 py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-xl transition-all text-sm shadow-lg shadow-rose-900/30 flex items-center justify-center gap-2"
                >
                  {isLoggingOut ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                      <Zap size={16} />
                    </motion.div>
                  ) : (
                    <>
                      <LogOut size={16} /> Yes, Logout
                    </>
                  )}
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