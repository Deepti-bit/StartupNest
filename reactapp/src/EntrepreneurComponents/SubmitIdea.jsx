import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, ArrowLeft, UploadCloud, IndianRupee, MapPin, 
  TrendingUp, CalendarDays, FileCheck, ShieldCheck, Loader2, Info
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import EntrepreneurNavbar from './EntrepreneurNavbar';
import api from '../Services/api'; 

const SubmitIdea = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mentorId } = useParams(); // To fetch from URL ID if needed
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [mentorData, setMentorData] = useState(location.state?.mentorData || null);

  // 1. Fetch Mentor Data if not in location state (URL fallback)
  useEffect(() => {
    if (!mentorData && mentorId) {
      const fetchMentor = async () => {
        try {
          const res = await api.get(`/startupProfile/getStartupProfileById/${mentorId}`);
          setMentorData(res.data);
        } catch (err) {
          toast.error("Could not fetch mentor details");
        }
      };
      fetchMentor();
    }
  }, [mentorId, mentorData]);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({ mode: "onChange" });
  const fileName = watch("pitchDeck");

  const onSubmit = async (data) => {
    // 2. FUNDING LIMIT VALIDATION
    if (mentorData && Number(data.expectedFunding) > Number(mentorData.fundingLimit)) {
      toast.error(`Budget exceeds Mentor's limit of ₹${mentorData.fundingLimit.toLocaleString()}`, {
        duration: 4000,
        icon: '⚠️'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      
      // Map exactly to what the Backend/Model expects
      formData.append('marketPotential', data.marketPotential);
      formData.append('expectedFunding', data.expectedFunding);
      formData.append('launchYear', data.launchYear);
      formData.append('address', data.address);
      
      // FIXING VALIDATION ERRORS:
      formData.append('startupProfileId', mentorData?._id); // Maps to required field
      formData.append('userName', localStorage.getItem('userName')); // Fetch from storage
      
      if (data.pitchDeck && data.pitchDeck[0]) {
        // Field name MUST match multer .single('pitchDeckFile')
        formData.append('pitchDeckFile', data.pitchDeck[0]); 
      }

      await api.post('/startupSubmission/addStartupSubmission', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setIsSubmitting(false);
      setShowSuccess(true);
    } catch (err) {
      setIsSubmitting(false);
      toast.error(err.response?.data?.message || "Submission failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-12">
      <EntrepreneurNavbar />
      <Toaster />

      <main className="relative z-10 max-w-4xl mx-auto px-6 pt-28">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 font-bold mb-8">
          <ArrowLeft size={18} /> Back
        </button>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border">
          <div className="bg-[#003366] p-8 text-white">
            <h1 className="text-3xl font-black mb-2">Transmitting to <span className="text-blue-400">{mentorData?.category || "Mentor"}</span></h1>
            <p className="text-blue-100/70">Category is autofilled based on mentor selection.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* AUTOFILLED CATEGORY */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Incubation Category</label>
                <div className="w-full px-5 py-4 bg-slate-100 rounded-2xl border border-slate-200 text-slate-500 font-bold">
                  {mentorData?.category || "Loading..."}
                </div>
              </div>

              {/* FUNDING ASK WITH MENTOR LIMIT INFO */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Expected Funding (Max: ₹{mentorData?.fundingLimit.toLocaleString()})</label>
                <div className="relative">
                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    {...register("expectedFunding", { required: "Required" })}
                    type="number"
                    className="w-full pl-10 pr-5 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-[#003366] outline-none font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Market Potential (0-100)</label>
                <input {...register("marketPotential", { required: true, min: 1, max: 100 })} type="number" className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-[#003366] outline-none font-bold" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Launch Date</label>
                <input {...register("launchYear", { required: true })} type="date" className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-[#003366] outline-none font-bold" />
              </div>

              <div className="col-span-full space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Business Address</label>
                <input {...register("address", { required: true })} type="text" className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-[#003366] outline-none font-bold" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Pitch Deck (PDF Only)</label>
              <div className="relative border-2 border-dashed rounded-[2rem] p-10 text-center hover:bg-slate-50 transition-all">
                <input {...register("pitchDeck", { required: "Pitch Deck is required" })} type="file" accept=".pdf" className="absolute inset-0 opacity-0 cursor-pointer" />
                <UploadCloud size={40} className="mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-bold text-slate-500">{fileName?.[0]?.name || "Upload Pitch Deck"}</p>
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-[#003366] text-white rounded-2xl font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">
              {isSubmitting ? "Processing..." : "Submit Proposal"}
            </button>
          </form>
        </motion.div>
      </main>

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
                onClick={() => navigate('/entrepreneur/my-submissions')}
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
