import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import { 
  Home, 
  Lightbulb, 
  Send, 
  LogOut, 
  Bell, 
  User, 
  Menu, 
  X, 
  ChevronDown,
  Rocket
} from 'lucide-react';

const EntrepreneurNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [notifications] = useState(3); // Mock notification count

  // Mock User Data (In real app, get from Redux/Context)
  const user = { name: "Entrepreneur10", role: "Entrepreneur" };

  // Scroll logic for "Floating" effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    toast.success('Logged out successfully!', {
      icon: '👋',
      style: { borderRadius: '15px', background: '#333', color: '#fff' },
    });
    setTimeout(() => navigate('/login'), 1000);
  };

  const navLinks = [
    { name: 'Home', path: '/entrepreneur/home', icon: <Home size={18} /> },
    { name: 'Mentor Opportunities', path: '/entrepreneur/opportunities', icon: <Lightbulb size={18} /> },
    { name: 'My Submissions', path: '/entrepreneur/my-submissions', icon: <Send size={18} /> },
    { name: 'Submit Idea', path: '/entrepreneur/submit-idea', icon: <Send size={18} /> },

  ];

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
        isScrolled 
        ? 'bg-[#003366]/80 backdrop-blur-xl py-3 shadow-2xl border-b border-white/10' 
        : 'bg-[#003366] py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* --- LOGO SECTION --- */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate('/home')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Rocket className="text-white animate-pulse" size={24} />
            </div>
            <span className="text-2xl font-black text-white tracking-tighter uppercase hidden sm:block">
              Startup<span className="text-blue-400">Nest</span>
            </span>
          </motion.div>

          {/* --- DESKTOP NAVIGATION --- */}
          <div className="hidden lg:flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/10">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path}>
                <motion.div
                  whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                  className={`relative px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold transition-all ${
                    location.pathname === link.path ? 'text-white' : 'text-slate-400'
                  }`}
                >
                  {link.icon}
                  {link.name}
                  {location.pathname === link.path && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 w-full h-full bg-blue-500/20 border-b-2 border-blue-400 rounded-xl -z-10"
                    />
                  )}
                </motion.div>
              </Link>
            ))}
          </div>

          {/* --- RIGHT ACTIONS --- */}
          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <div className="relative cursor-pointer group p-2 hover:bg-white/10 rounded-full transition-all">
              <Bell className="text-slate-300 group-hover:text-blue-400" size={22} />
              {notifications > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-[10px] font-black text-white rounded-full flex items-center justify-center border-2 border-[#003366]">
                  {notifications}
                </span>
              )}
            </div>

            {/* Profile Chip */}
            <div className="hidden md:flex items-center gap-3 pl-2 border-l border-white/10">
              <div className="text-right">
                <p className="text-xs font-black text-white">{user.name}</p>
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-tighter">{user.role}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-slate-700 to-slate-800 border-2 border-blue-500/30 flex items-center justify-center text-white font-bold">
                {user.name.charAt(0)}
              </div>
            </div>

            {/* Logout Trigger */}
            <button 
              onClick={() => setShowLogoutModal(true)}
              className="bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white p-2.5 rounded-xl transition-all border border-rose-500/20 group"
            >
              <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Mobile Toggle */}
            <button className="lg:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* --- MOBILE MENU --- */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-[#003366] border-t border-white/5 overflow-hidden"
            >
              <div className="p-6 space-y-4">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    to={link.path} 
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 text-slate-300 font-bold p-3 hover:bg-white/5 rounded-xl"
                  >
                    {link.icon} {link.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* --- ADVANCED LOGOUT MODAL (As per PDF Page 37) --- */}
      <AnimatePresence>
        {showLogoutModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutModal(false)}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-sm rounded-[2.5rem] p-10 text-center shadow-2xl"
            >
              <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <LogOut className="text-rose-500" size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-2">Wait a second!</h3>
              <p className="text-slate-500 font-medium mb-8">Are you sure you want to end your session at StartupNest?</p>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl transition-all"
                >
                  Stay Here
                </button>
                <button 
                  onClick={handleLogout}
                  className="flex-1 py-4 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-2xl shadow-lg shadow-rose-200 transition-all active:scale-95"
                >
                  Yes, Logout
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