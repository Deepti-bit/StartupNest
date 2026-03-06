import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
// Removed useNavigate
import { toast, Toaster } from 'react-hot-toast';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';
import api, { setAccessToken } from '../Services/api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isError, setIsError] = useState(false); 
  const navigate = useNavigate()

  // --- 1. CURSOR TRACKING LOGIC ---
  const leftPanelRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const handleLeftPanelMouseMove = (e) => {
    if (!leftPanelRef.current) return;
    const rect = leftPanelRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseX.set(x - 150); 
    mouseY.set(y - 150);
  };

  // --- 2. FORM INITIALIZATION ---
  const { register, handleSubmit, formState: { errors } } = useForm({
    mode: "onChange",
  });

  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

  // --- 3. LOGIN FUNCTIONALITY ---
  const onSubmit = async (data) => {
    setLoading(true);
    setIsError(false);
    const loginToast = toast.loading("Securely authenticating...");
  
    try {
      const response = await api.post("/user/login", data);
  
      if (response.data.accessToken) {
        // 1. Store token in memory
        setAccessToken(response.data.accessToken);
  
        // 2. Store info for the UI
        localStorage.setItem('role', response.data.role);
        localStorage.setItem('userName', response.data.userName);
        
        toast.success(`Access Granted. Welcome, ${response.data.userName}`, { id: loginToast });
        
        // 3. UPDATED REDIRECTION LOGIC
        setTimeout(() => {
            const role = response.data.role;
  
            if (role === 'Admin') {
                navigate('/admin/dashboard');
            } else if (role === 'Mentor') {
                navigate('/mentor/dashboard');
            } else if (role === 'Entrepreneur') {
                // --- THIS IS THE CHANGE ---
                navigate('/entrepreneur/home');
            } else {
                navigate('/asd')
            }
        }, 1500);
      }
    } catch (error) {
      setIsError(true); 
      let errorMsg = error.response?.data?.message || "Authentication failed.";
      toast.error(errorMsg, { id: loginToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#f8fafc] overflow-hidden font-sans select-none relative">
      <Toaster position="top-center" />

      {/* --- LEFT SIDE --- */}
      <div 
        ref={leftPanelRef}
        onMouseMove={handleLeftPanelMouseMove}
        className="hidden lg:flex lg:w-[45%] bg-[#002a5c] relative flex-col justify-center p-12 text-white text-left overflow-hidden"
      >
        <div className="absolute top-8 left-10 z-20 flex items-center gap-2">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
             <span className="text-[#002a5c] font-black text-xl">S</span>
          </div>
          <span className="text-xl font-black tracking-tighter uppercase">Startup<span className="text-blue-400">Nest</span></span>
        </div>

        <motion.div
          className="absolute pointer-events-none z-0"
          style={{
            x: smoothX,
            y: smoothY,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(59,130,246,0.4) 0%, rgba(147,197,253,0.1) 50%, transparent 80%)",
            filter: "blur(40px)",
          }}
        />

        <div className="relative z-10 space-y-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-5xl xl:text-6xl font-black leading-tight"
          >
            Innovate. <br /> <span className="text-[#ffc107]">Incubate.</span> <br /> Succeed.
          </motion.h1>
          <p className="text-blue-100/70 text-lg max-w-xs leading-relaxed font-medium">
            The premium gateway for Indian entrepreneurs to meet global mentors.
          </p>
        </div>
      </div>

      {/* --- RIGHT SIDE: FORM --- */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 relative bg-slate-50 lg:bg-transparent">
        <motion.div 
          animate={isError ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[380px] bg-white p-8 md:p-10 rounded-[2rem] shadow-[0_15px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-100 z-10"
        >
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-black text-slate-800 mb-1 tracking-tight">Login</h2>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">Secure Access Point</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-left">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <input
                {...register("email", { 
                  required: "Required", 
                  pattern: { value: EMAIL_REGEX, message: "Invalid email" } 
                })}
                className={`w-full px-5 py-3.5 bg-slate-50 border-2 rounded-xl outline-none transition-all font-bold text-sm text-slate-700 placeholder:text-slate-300 ${
                    errors.email ? 'border-rose-400 focus:border-rose-500 bg-rose-50' : 'border-transparent focus:border-blue-600 focus:bg-white'
                }`}
                placeholder="name@startup.com"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", { required: "Required" })}
                  className={`w-full px-5 py-3.5 bg-slate-50 border-2 rounded-xl outline-none transition-all font-bold text-sm text-slate-700 placeholder:text-slate-300 ${
                    errors.password ? 'border-rose-400 focus:border-rose-500 bg-rose-50' : 'border-transparent focus:border-blue-600 focus:bg-white'
                  }`}
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-black uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all flex items-center justify-center gap-3 text-[10px] ${
                loading ? 'bg-slate-200 text-slate-400 cursor-wait' : 'bg-[#002a5c] text-white hover:bg-black'
              }`}
            >
              {loading ? <> <Loader2 className="animate-spin" size={16} /> Verifying... </> : "Validate Credentials"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;