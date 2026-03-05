import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import {
  User, Mail, Phone, Lock, ShieldCheck, Rocket, Eye, EyeOff,
  Briefcase, Moon, Sun, ArrowLeft, Loader2, CheckCircle2, UploadCloud
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import api from '../Services/api'; // Your custom axios instance

const Signup = () => {
  const [step, setStep] = useState(1); // 1: Role Selection, 2: Form
  const [role, setRole] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // --- 1. THEME & CURSOR LOGIC ---
  const themeClass = darkMode ? "dark bg-[#020617] text-white" : "bg-white text-slate-900";
  const leftPanelRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e) => {
    if (!leftPanelRef.current) return;
    const rect = leftPanelRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - 150);
    mouseY.set(e.clientY - rect.top - 150);
  };

  // --- 2. FORM CONFIGURATION ---
  const { register, handleSubmit, watch, formState: { errors } } = useForm({ mode: "onChange" });
  const password = watch("password");
  const selectedFile = watch("resume"); // Watch file input for UI feedback

  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const MOBILE_REGEX = /^[6-9]\d{9}$/;
  const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

  // --- 3. SUBMISSION LOGIC (USING FORMDATA) ---
  const onSubmit = async (data) => {
    setLoading(true);
    const signupToast = toast.loading("Creating your secure profile...");

    try {
      // Use FormData for Multipart (File + Text)
      const formData = new FormData();
      formData.append("userName", data.username);
      formData.append("email", data.email);
      formData.append("mobile", data.mobile);
      formData.append("password", data.password);
      formData.append("role", role);

      // Only add resume if role is Mentor
      if (role === 'Mentor' && data.resume?.[0]) {
        formData.append("resume", data.resume[0]);
      }

      const response = await api.post("/user/register", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      toast.success(response.data.message, { id: signupToast, duration: 5000 });
      
      // Delay navigation so user can read the message
      setTimeout(() => navigate('/login'), 3000);

    } catch (error) {
      const errorMsg = error.response?.data?.message || "Signup failed. Please check your details.";
      toast.error(errorMsg, { id: signupToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${themeClass} min-h-screen w-full font-sans transition-colors duration-500 flex overflow-hidden relative`}>
      <Toaster position="top-center" />

      {/* --- LEFT SIDE: BRANDING --- */}
      <div
        ref={leftPanelRef}
        onMouseMove={handleMouseMove}
        className="hidden lg:flex lg:w-[40%] bg-[#002a5c] relative flex-col justify-between p-12 text-white overflow-hidden"
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
            x: smoothX, y: smoothY,
            width: 400, height: 400, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(56,189,248,0.2) 0%, rgba(139,92,246,0.05) 50%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />

        <div className="relative z-10 space-y-6 mt-24">
          <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-6xl font-black leading-tight tracking-tighter">
            Build. <br /> Mentor. <br /> <span className="text-sky-400">Invest.</span>
          </motion.h1>
          <p className="text-blue-100/70 text-lg max-w-xs font-medium leading-relaxed">
            The elite gateway for Indian founders and global industry leaders.
          </p>
        </div>

        <div className="relative z-10 opacity-40 text-[10px] font-bold tracking-[0.3em] uppercase">
          &copy; 2026 StartupNest Ecosystem
        </div>
      </div>

      {/* --- RIGHT SIDE: CONTENT --- */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative overflow-y-auto bg-slate-50 dark:bg-[#020617]">
        
        {/* Header Controls */}
        <div className="absolute top-8 right-10 flex items-center gap-6 z-50">
          <Link to="/login" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-black text-[10px] uppercase tracking-widest">
            <ArrowLeft size={14} /> Back to Login
          </Link>
          <button onClick={() => setDarkMode(!darkMode)} className="p-2.5 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            {darkMode ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-slate-600" />}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            /* --- STEP 1: ROLE SELECTION --- */
            <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-3xl text-center">
              <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Choose your identity</h2>
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.25em] mb-12">Select how you want to contribute</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <RoleCard
                  title="Entrepreneur" icon={<Rocket size={28} />}
                  desc="I have a startup idea and I'm looking for guidance and funding."
                  onClick={() => { setRole('Entrepreneur'); setStep(2); }}
                  accent="blue" darkMode={darkMode}
                />
                <RoleCard
                  title="Mentor" icon={<Briefcase size={28} />}
                  desc="I am an industry leader looking to guide or invest in startups."
                  onClick={() => { setRole('Mentor'); setStep(2); }}
                  accent="sky" darkMode={darkMode}
                />
              </div>
            </motion.div>
          ) : (
            /* --- STEP 2: FORM --- */
            <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="w-full max-w-md bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800">
              <div className="mb-8 flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Register</h3>
                  <p className="text-blue-500 font-bold text-[10px] uppercase tracking-widest mt-1">As {role}</p>
                </div>
                <button onClick={() => setStep(1)} className="text-slate-400 text-[9px] font-black uppercase hover:text-blue-600 transition-colors">Change Role</button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <InputField label="Full Name" {...register("username", { required: "Required" })} error={errors.username} darkMode={darkMode} />
                
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Email" {...register("email", { required: "Required", pattern: { value: EMAIL_REGEX, message: "Invalid" } })} error={errors.email} darkMode={darkMode} />
                  <InputField label="Mobile" {...register("mobile", { required: "Required", pattern: { value: MOBILE_REGEX, message: "10-digits" } })} error={errors.mobile} darkMode={darkMode} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Password" type={showPassword ? "text" : "password"} {...register("password", { required: "Required", pattern: { value: PASSWORD_REGEX, message: "Weak" } })} error={errors.password} darkMode={darkMode} />
                  <InputField label="Confirm" type="password" {...register("confirmPassword", { required: "Required", validate: v => v === password || "Mismatch" })} error={errors.confirmPassword} darkMode={darkMode} />
                </div>

                {/* --- CONDITIONAL FILE UPLOAD FOR MENTOR --- */}
                {role === 'Mentor' && (
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Resume (PDF Only)</label>
                    <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-slate-50 dark:bg-slate-800/50 hover:border-blue-500 transition-all flex flex-col items-center justify-center gap-2">
                      <input 
                        type="file" accept=".pdf"
                        {...register("resume", { required: "PDF Resume is required for Mentors" })}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <UploadCloud size={24} className="text-blue-500" />
                      <span className="text-[10px] font-bold text-slate-500">
                        {selectedFile?.[0] ? selectedFile[0].name : "Upload professional CV"}
                      </span>
                    </div>
                    {errors.resume && <p className="text-rose-500 text-[9px] font-bold ml-1">{errors.resume.message}</p>}
                  </div>
                )}

                <button disabled={loading} className="w-full py-4 bg-[#002a5c] text-white font-black uppercase tracking-[0.25em] rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-3 text-[10px] mt-4">
                  {loading ? <Loader2 className="animate-spin" size={16} /> : "Initialize Account"}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const RoleCard = ({ title, icon, desc, onClick, accent, darkMode }) => (
  <motion.div
    whileHover={{ y: -5, scale: 1.02 }} onClick={onClick}
    className={`p-8 rounded-[2rem] cursor-pointer transition-all border-2 text-left flex flex-col bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl ${darkMode ? 'border-slate-800 hover:border-sky-500' : 'border-slate-100 hover:border-blue-500'}`}
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${accent === 'blue' ? 'bg-blue-50 text-blue-600' : 'bg-sky-50 text-sky-500'}`}>
      {icon}
    </div>
    <h3 className="text-xl font-black mb-3 text-slate-800 dark:text-white">{title}</h3>
    <p className="text-xs font-medium text-slate-400 leading-relaxed mb-6">{desc}</p>
    <div className="mt-auto flex items-center gap-2 text-blue-600 font-black text-[9px] uppercase tracking-widest">
      Select Role <CheckCircle2 size={12} />
    </div>
  </motion.div>
);

const InputField = React.forwardRef(({ label, error, darkMode, type = "text", ...props }, ref) => (
  <div className="space-y-1 text-left flex-1">
    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <input
      ref={ref} type={type} {...props}
      className={`w-full px-4 py-3 border-2 rounded-xl outline-none transition-all text-xs font-bold ${darkMode ? 'bg-slate-800 border-slate-700 text-white focus:border-sky-400' : 'bg-slate-50 border-transparent text-slate-800 focus:border-blue-500'} ${error ? 'border-rose-500' : ''}`}
    />
    {error && <p className="text-rose-500 text-[8px] font-bold ml-1">{error.message}</p>}
  </div>
));

export default Signup;