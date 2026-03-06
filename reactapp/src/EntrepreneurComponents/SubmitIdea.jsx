import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, 
  ArrowLeft, 
  UploadCloud, 
  IndianRupee, 
  MapPin, 
  TrendingUp, 
  CalendarDays, 
  FileCheck,
  ShieldCheck,
  Loader2,
  X
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import EntrepreneurNavbar from './EntrepreneurNavbar';

const SubmitIdea = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Get selected mentor profile info from navigation state (as per PDF flow)
  const selectedMentor = location.state?.mentorData || { category: "General", industry: "Tech" };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const fileName = watch("pitchDeck");

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    // Simulating API call to /startupSubmission/addStartupSubmission (PDF Page 13)
    console.log("Submission Payload:", {
      ...data,
      mentorId: selectedMentor._id,
      submissionDate: new Date().toISOString()
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      toast.success("Startup Proposal Sent!");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-12 overflow-x-hidden">
      <EntrepreneurNavbar />
      <Toaster />

      {/* --- BACKGROUND ORBS --- */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50 animate-pulse delay-700"></div>
      </div>

      <main className="relative z-10 max-w-4xl mx-auto px-6 pt-28">
        
        {/* --- HEADER --- */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 font-bold hover:text-[#003366] transition-colors group text-sm"
          >
            <div className="p-2 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-all">
              <ArrowLeft size={18} />
            </div>
            Back to Opportunities
          </button>
          
          <div className="text-right">
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
              Pitching to {selectedMentor.category}
            </span>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden"
        >
          {/* Form Banner */}
          <div className="bg-[#003366] p-8 md:p-12 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-3xl md:text-4xl font-black mb-2 tracking-tight flex items-center gap-3">
                Submit Your <span className="text-blue-400">Startup Idea</span>
                <Rocket className="text-blue-400 animate-bounce" size={28} />
              </h1>
              <p className="text-blue-100/70 font-medium max-w-md">
                Provide the core metrics of your venture. This data will be used by mentors to evaluate your funding potential.
              </p>
            </div>
            <Rocket size={180} className="absolute -right-10 -bottom-10 text-white/5 rotate-12" />
          </div>

          {/* --- FORM SECTION --- */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-8 md:p-12 space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Market Potential */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                  <TrendingUp size={14} className="text-blue-500" /> Market Potential (0-100) *
                </label>
                <input 
                  {...register("marketPotential", { 
                    required: "Score is required", 
                    min: { value: 1, message: "Min 1" },
                    max: { value: 100, message: "Max 100" } 
                  })}
                  type="number"
                  placeholder="E.g. 85"
                  className={`w-full px-5 py-4 bg-slate-50 rounded-2xl border-2 outline-none transition-all ${errors.marketPotential ? 'border-rose-400' : 'border-transparent focus:border-[#003366] focus:bg-white'}`}
                />
                {errors.marketPotential && <p className="text-rose-500 text-[10px] font-bold ml-2">{errors.marketPotential.message}</p>}
              </div>

              {/* Expected Funding */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                  <IndianRupee size={14} className="text-blue-500" /> Expected Funding *
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    {...register("expectedFunding", { required: "Funding amount required" })}
                    type="number"
                    placeholder="E.g. 500000"
                    className={`w-full pl-10 pr-5 py-4 bg-slate-50 rounded-2xl border-2 outline-none transition-all ${errors.expectedFunding ? 'border-rose-400' : 'border-transparent focus:border-[#003366] focus:bg-white'}`}
                  />
                </div>
                {errors.expectedFunding && <p className="text-rose-500 text-[10px] font-bold ml-2">{errors.expectedFunding.message}</p>}
              </div>

              {/* Launch Year */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                  <CalendarDays size={14} className="text-blue-500" /> Target Launch Year *
                </label>
                <input 
                  {...register("launchYear", { required: "Launch year required" })}
                  type="date"
                  className={`w-full px-5 py-4 bg-slate-50 rounded-2xl border-2 outline-none transition-all ${errors.launchYear ? 'border-rose-400' : 'border-transparent focus:border-[#003366] focus:bg-white'}`}
                />
                {errors.launchYear && <p className="text-rose-500 text-[10px] font-bold ml-2">{errors.launchYear.message}</p>}
              </div>

              {/* Address */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                  <MapPin size={14} className="text-blue-500" /> Business Location *
                </label>
                <input 
                  {...register("address", { required: "Location address required" })}
                  type="text"
                  placeholder="E.g. Bangalore, India"
                  className={`w-full px-5 py-4 bg-slate-50 rounded-2xl border-2 outline-none transition-all ${errors.address ? 'border-rose-400' : 'border-transparent focus:border-[#003366] focus:bg-white'}`}
                />
                {errors.address && <p className="text-rose-500 text-[10px] font-bold ml-2">{errors.address.message}</p>}
              </div>
            </div>

            {/* Pitch Deck File Upload */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                <UploadCloud size={14} className="text-blue-500" /> Pitch Deck (PDF Only) *
              </label>
              <div className="relative group">
                <input 
                  {...register("pitchDeck", { required: "Please upload your Pitch Deck" })}
                  type="file"
                  accept=".pdf"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                />
                <div className={`w-full py-10 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center transition-all ${fileName?.length > 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200 group-hover:border-[#003366] group-hover:bg-blue-50/30'}`}>
                   {fileName?.length > 0 ? (
                     <>
                        <FileCheck size={40} className="text-emerald-500 mb-2 animate-bounce" />
                        <p className="text-sm font-black text-emerald-700">{fileName[0].name}</p>
                        <p className="text-[10px] font-bold text-emerald-500 mt-1 uppercase">File ready for upload</p>
                     </>
                   ) : (
                     <>
                        <UploadCloud size={40} className="text-slate-300 mb-2 group-hover:text-blue-500 transition-colors" />
                        <p className="text-sm font-bold text-slate-500">Drag & drop or <span className="text-blue-600">Browse files</span></p>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Max size: 10MB</p>
                     </>
                   )}
                </div>
              </div>
              {errors.pitchDeck && <p className="text-rose-500 text-[10px] font-bold ml-2">{errors.pitchDeck.message}</p>}
            </div>

            {/* Important Notice */}
            <div className="bg-blue-50/50 p-4 rounded-2xl flex items-start gap-3 border border-blue-100">
               <ShieldCheck className="text-blue-500 shrink-0" size={20} />
               <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
                 <b>Policy:</b> By submitting, you agree to share your vision with the selected mentor. Proposals cannot be edited once shortlisted or rejected.
               </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 ${isSubmitting ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-[#003366] text-white hover:shadow-blue-900/20 hover:bg-[#002244]'}`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Encrypting Proposal...
                </>
              ) : (
                "Transmit Startup Pitch 🚀"
              )}
            </button>
          </form>
        </motion.div>
      </main>

      {/* --- SUCCESS MODAL (As per PDF Page 40) --- */}
      <AnimatePresence>
        {showSuccess && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-sm bg-slate-900/60">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-[3rem] p-12 max-w-sm w-full text-center shadow-2xl relative overflow-hidden"
            >
               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
               <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500">
                  <FileCheck size={48} />
               </div>
               <h2 className="text-3xl font-black text-slate-800 mb-2">Successfully Submitted!</h2>
               <p className="text-slate-500 font-medium mb-8">Your startup pitch is now live on the Mentor's desk for evaluation.</p>
               <button 
                onClick={() => navigate('/my-submissions')}
                className="w-full py-4 bg-[#003366] text-white font-black rounded-2xl shadow-lg active:scale-95 transition-all"
               >
                 Go to Dashboard
               </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default SubmitIdea;