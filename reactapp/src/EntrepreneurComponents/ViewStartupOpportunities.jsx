import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
// Use your custom api instance for consistency (it handles base URL and tokens)
import api from '../Services/api'; 
import {
  Search,
  Filter,
  Rocket,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import EntrepreneurNavbar from './EntrepreneurNavbar';

const ViewStartupOpportunities = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [industryFilter, setIndustryFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [opportunities, setOpportunities] = useState([]);
  const [submittedProfileIds, setSubmittedProfileIds] = useState([]);

  // Use the ID stored during login to check application status
  const userId = localStorage.getItem('userId'); 

  useEffect(() => {
    fetchInitialData();
  }, [userId]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);

      // 1. Fetch All Startup Profiles
      const profilesRes = await api.get('/startupProfile/getAllStartupProfiles');
      setOpportunities(profilesRes.data);

      // 2. Fetch User's Submissions to handle Button State
      // Note: Switched from 'axios' to 'api' to ensure Authorization headers are sent
      if (userId) {
        const submissionsRes = await api.get(`/api/startupSubmission/getSubmissionsByUserId/${userId}`);
        const appliedIds = submissionsRes.data.map(sub => sub.startupProfileId);
        setSubmittedProfileIds(appliedIds);
      }

    } catch (err) {
      console.error("Data fetch failed:", err);
      toast.error("Failed to load opportunities.");
    } finally {
      setLoading(false);
    }
  };

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = 
      opp.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.targetIndustry?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = industryFilter === "All" || opp.targetIndustry === industryFilter;
    return matchesSearch && matchesIndustry;
  });

  // --- UPDATED NAVIGATION LOGIC ---
  const handleNavigateToSubmit = (opp) => {
    // We append the ID to the URL path and also pass the data in state as a backup
    navigate(`/entrepreneur/submit-idea/${opp._id}`, { state: { mentorData: opp } });
  };

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-screen bg-[#f8fafc]">
       <div className="w-12 h-12 border-4 border-[#003366] border-t-transparent rounded-full animate-spin mb-4"></div>
       <div className="font-black text-[#003366] uppercase tracking-widest text-xs">Loading Opportunities...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-20">
      <EntrepreneurNavbar />
      <Toaster />

      {/* Hero Section */}
      <section className="bg-[#003366] pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center relative z-10">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
              Mentor <span className="text-blue-400">Opportunities</span>
            </h1>
            <p className="text-blue-100/70 text-lg font-medium max-w-xl">
              Explore profiles and pitch your vision to the right mentors.
            </p>
          </motion.div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
        {/* Search and Filter Toolbar */}
        <div className="bg-white p-3 rounded-[1.5rem] shadow-xl border border-slate-100 flex items-center gap-4 mb-10">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search by category or industry..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl outline-none text-sm font-medium"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="bg-slate-50 px-4 py-3 rounded-2xl text-xs font-black text-slate-600 outline-none border border-slate-100"
            onChange={(e) => setIndustryFilter(e.target.value)}
          >
            <option value="All">All Industries</option>
            {[...new Set(opportunities.map(o => o.targetIndustry))].map(ind => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
        </div>

        {/* Opportunities Table */}
        <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">SNo</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Industry</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Limit</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredOpportunities.map((opp, index) => {
                const isSubmitted = submittedProfileIds.includes(opp._id);
                return (
                  <tr key={opp._id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="px-8 py-6 font-bold text-slate-400 text-sm">{index + 1}</td>
                    <td className="px-8 py-6 font-black text-[#003366] text-sm">{opp.category}</td>
                    <td className="px-8 py-6 text-xs font-bold text-slate-500 uppercase">{opp.targetIndustry}</td>
                    <td className="px-8 py-6 font-black text-slate-700 text-sm">₹{(opp.fundingLimit / 100000).toFixed(1)}L</td>
                    <td className="px-8 py-6 text-right">
                      <button
                        disabled={isSubmitted}
                        onClick={() => handleNavigateToSubmit(opp)}
                        className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${isSubmitted
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-[#003366] text-white hover:bg-[#002244]'
                          }`}
                      >
                        {isSubmitted ? "Submitted" : "Submit Idea"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default ViewStartupOpportunities;