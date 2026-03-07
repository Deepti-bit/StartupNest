import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { toast, Toaster } from 'react-hot-toast';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';
import api, { setAccessToken } from '../Services/api';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext'; // IMPORT CONTEXT

const Login = () => {
  const { setUser } = useAuth(); // INITIALIZE CONTEXT HOOK
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  // Animation Logic
  const leftPanelRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const handleLeftPanelMouseMove = (e) => {
    if (!leftPanelRef.current) return;
    const rect = leftPanelRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - 150);
    mouseY.set(e.clientY - rect.top - 150);
  };

  const { register, handleSubmit, formState: { errors } } = useForm({ mode: "onChange" });

  const onSubmit = async (data) => {
    setLoading(true);
    setIsError(false);
    const loginToast = toast.loading("Securely authenticating...");

    try {
      const response = await api.post("/user/login", data);

      if (response.data.accessToken) {
        setAccessToken(response.data.accessToken);

        // 1. MAP DATA FROM LOGIN RESPONSE
        const userData = {
            role: response.data.role || response.data.user?.role,
            userName: response.data.userName || response.data.user?.userName || response.data.name,
            userId: response.data.ID || response.data.user?.id || response.data._id
        };

        // 2. CRUCIAL: Save user to Context Memory (unblocks PrivateRoute)
        setUser(userData);

        // 3. Save to LocalStorage for UI persistence
        localStorage.setItem('role', userData.role);
        localStorage.setItem('userName', userData.userName);
        localStorage.setItem('userId', userData.userId);

        toast.success(`Access Granted. Welcome, ${userData.userName}`, { id: loginToast });

        // 4. ROLE-BASED REDIRECTION
        setTimeout(() => {
          const role = userData.role?.toLowerCase();
          if (role === 'admin') {
            navigate('/admin/dashboard');
          } else if (role === 'mentor') {
            navigate('/mentor/dashboard');
          } else if (role === 'entrepreneur') {
            navigate('/entrepreneur/home');
          } else {
            navigate('/home');
          }
        }, 1500);
      }
    } catch (error) {
      setIsError(true);
      const msg = error.response?.data?.message || "Authentication failed.";
      toast.error(msg, { id: loginToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#f8fafc] overflow-hidden font-sans relative">
      <Toaster position="top-center" />
      
      {/* LEFT PANEL */}
      <div ref={leftPanelRef} onMouseMove={handleLeftPanelMouseMove} className="hidden lg:flex lg:w-[45%] bg-[#002a5c] relative flex-col justify-center p-12 text-white overflow-hidden">
        <div className="absolute top-8 left-10 z-20 flex items-center gap-2">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-[#002a5c] font-black text-xl">S</span>
          </div>
          <span className="text-xl font-black tracking-tighter uppercase">Startup<span className="text-blue-400">Nest</span></span>
        </div>
        <motion.div className="absolute pointer-events-none z-0" style={{ x: smoothX, y: smoothY, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 80%)", filter: "blur(40px)" }} />
        <div className="relative z-10 space-y-6">
          <h1 className="text-6xl font-black leading-tight">Innovate. <br /> <span className="text-[#ffc107]">Incubate.</span> <br /> Succeed.</h1>
          <p className="text-blue-100/70 text-lg max-w-xs leading-relaxed">The premium gateway for Indian entrepreneurs to meet global mentors.</p>
        </div>
      </div>

      {/* RIGHT PANEL (FORM) */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50 lg:bg-transparent">
        <motion.div animate={isError ? { x: [-10, 10, -10, 10, 0] } : {}} className="w-full max-w-[380px] bg-white p-10 rounded-[2rem] shadow-2xl border border-slate-100">
          <h2 className="text-3xl font-black text-slate-800 mb-1">Login</h2>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-8">Secure Access Point</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <input {...register("email", { required: true })} className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-xl outline-none font-bold text-sm" placeholder="name@startup.com" />
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} {...register("password", { required: true })} className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-xl outline-none font-bold text-sm" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-4 bg-[#002a5c] text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg hover:bg-black transition-all flex items-center justify-center gap-3">
              {loading ? <Loader2 className="animate-spin" size={16} /> : "Validate Credentials"}
            </button>

            <p className="text-center text-slate-400 font-bold text-[9px] uppercase tracking-widest mt-6">
              New to StartupNest? <Link to="/signup" className="text-blue-600 hover:underline">Join Ecosystem</Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;