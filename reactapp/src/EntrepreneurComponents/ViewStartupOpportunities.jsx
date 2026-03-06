<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import api from '../Services/api'; // Your custom axios instance
import {
  Search,
  Filter,
  Rocket,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import EntrepreneurNavbar from './EntrepreneurNavbar';

const ViewStartupOpportunities = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [industryFilter, setIndustryFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [opportunities, setOpportunities] = useState([]);
  const [submittedProfileIds, setSubmittedProfileIds] = useState([]);

  // Get Auth Data from localStorage (stored during login)
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('ID'); 

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${token}` };

      // 1. Fetch All Startup Profiles (SRS Page 10/15)
      const profilesRes = await api.get('http://localhost:8080/startupProfile/getAllStartupProfiles', { headers });
      setOpportunities(profilesRes.data);

      // 2. Fetch User's Submissions to handle Button State (SRS Page 41)
      // This identifies which profiles the user has already applied to
      const submissionsRes = await axios.get(`http://localhost:8080/startupSubmission/getSubmissionsByUserId/${userId}`, { headers });
      const appliedIds = submissionsRes.data.map(sub => sub.startupProfileId);
      setSubmittedProfileIds(appliedIds);

    } catch (err) {
      console.error("Data fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredOpportunities = opportunities.filter(opp => {
    // Note: Using 'targetIndustry' as per your StartupProfile Model
    const matchesSearch = 
      opp.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.targetIndustry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = industryFilter === "All" || opp.targetIndustry === industryFilter;
    return matchesSearch && matchesIndustry;
  });

  const handleNavigateToSubmit = (opp) => {
    // Passing full mentorData object to the state as per your Flow logic
    navigate('/submit-idea', { state: { mentorData: opp } });
  };

  if (loading) return <div className="flex justify-center items-center h-screen font-black text-[#003366]">LOADING OPPORTUNITIES...</div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-20">
      <EntrepreneurNavbar />
      <Toaster />

      {/* --- HERO HEADER --- */}
      <section className="bg-[#003366] pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] -mr-64 -mt-64"></div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center relative z-10">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-blue-500 text-white text-[10px] font-black px-3 py-1 rounded-full tracking-widest uppercase">Incubation Market</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
              Mentor <span className="text-blue-400">Opportunities</span>
            </h1>
            <p className="text-blue-100/70 text-lg font-medium max-w-xl">
              Connect with mentors providing capital and strategic guidance. Explore profiles and pitch your vision.
            </p>
          </motion.div>

          <div className="hidden lg:flex gap-4">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-[2.5rem] text-center w-40">
              <p className="text-3xl font-black text-white">{opportunities.length}</p>
              <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mt-1">Global Profiles</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- TOOLBAR --- */}
      <main className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
        <div className="bg-white p-3 rounded-[1.5rem] shadow-xl border border-slate-100 flex flex-wrap lg:flex-nowrap items-center gap-4 mb-10">
          <div className="relative flex-grow group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search by category or industry..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 text-sm font-medium transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 bg-slate-50 px-4 py-1.5 rounded-2xl border border-slate-100">
            <Filter size={16} className="text-slate-400" />
            <select
              className="bg-transparent py-2 text-xs font-black text-slate-600 outline-none border-none cursor-pointer"
              onChange={(e) => setIndustryFilter(e.target.value)}
            >
              <option value="All">All Industries</option>
              {[...new Set(opportunities.map(o => o.targetIndustry))].map(ind => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>
        </div>

        {/* --- DATA TABLE --- */}
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100">
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">SNo</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Incubation Category</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Target Industry</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Funding Limit</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Equity (%)</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredOpportunities.length > 0 ? filteredOpportunities.map((opp, index) => {
                  // SRS Page 41 Logic: Check if user already submitted to THIS profile
                  const isSubmitted = submittedProfileIds.includes(opp._id);

                  return (
                    <motion.tr
                      key={opp._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-blue-50/40 transition-all group"
                    >
                      <td className="px-8 py-6 font-bold text-slate-400 text-sm">{index + 1}</td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                            <Rocket size={16} />
                          </div>
                          <span className="font-black text-[#003366] text-sm">{opp.category}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-tighter">
                          {opp.targetIndustry}
                        </span>
                      </td>
                      <td className="px-8 py-6 font-black text-slate-700 text-sm">
                        ₹{(opp.fundingLimit / 100000).toFixed(1)}L
                      </td>
                      <td className="px-8 py-6 font-black text-emerald-600 text-sm">
                        {opp.avgEquityExpectation}%
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button
                          disabled={isSubmitted}
                          onClick={() => handleNavigateToSubmit(opp)}
                          className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-lg ${isSubmitted
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                              : 'bg-[#003366] text-white hover:bg-[#002244] shadow-blue-900/10'
                            }`}
                        >
                          {isSubmitted ? (
                            <> <CheckCircle2 size={12} /> Submitted </>
                          ) : (
                            <> Submit Idea <ArrowRight size={12} /> </>
                          )}
                        </button>
                      </td>
                    </motion.tr>
                  );
                }) : (
                  <tr>
                    <td colSpan="6" className="py-20 text-center text-slate-400 font-bold">
                      No opportunities found. Try adjusting your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- PAGINATION --- */}
        <div className="flex justify-center mt-10">
          <div className="flex items-center gap-1 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
            <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors disabled:opacity-30"><ChevronRight size={20} className="rotate-180" /></button>
            <span className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-x border-slate-100">Page 1 of 1</span>
            <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors disabled:opacity-30"><ChevronRight size={20} /></button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ViewStartupOpportunities;
=======
import React from 'react'

const ViewStartupOpportunities = () => {
  return (
    <div>ViewStartupOpportunities</div>
  )
}

export default ViewStartupOpportunities
>>>>>>> 0ea87e6cefdcb8a0801a87c7037a2029be537c03
